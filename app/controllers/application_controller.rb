class ApplicationController < ActionController::Base
  skip_forgery_protection

  rescue_from StandardError, with: :render_error_response

  class ValidationFailedError < StandardError
    attr_reader :type
    attr_reader :path
    attr_reader :errors

    def initialize(type:, path:, errors:)
      @type = type
      @path = path
      @errors = errors
    end

    def self.capture(type:, path:)
      yield
    rescue ActiveRecord::RecordInvalid => e
      raise new(type: type, path: path, errors: e.record.errors)
    rescue => e
      raise e
    end
  end

  module BatchedRequest
    class Error < StandardError; end

    class TooManyRequestError < Error
      attr_reader :size
      attr_reader :limit

      def initialize(size:, limit:)
        @size = size
        @limit = limit
        super("size: #{size}, limit: #{limit}")
      end
    end

    REQUEST_ERRORS = [
      ActiveRecord::RecordNotFound,
      ValidationFailedError,
    ].freeze
  end

  protected

  def page_params
    {
      page: (params[:page] || 1).to_i,
      per: (params[:per] || 20).to_i,
    }
  end

  def json_params
    @json_params ||= ActionController::Parameters.new(
      JSON.parse(request.body.read)
        .deep_transform_keys { |k| k.to_s.underscore.to_sym }
    )
  end

  # GET /resources/batched/:ids
  # type JsonAPIBatchedResponse = {
  #   data: {
  #     [key:string]: JsonAPIResponse;
  #   };
  # };
  # @example
  #   class ResourcesController < ApplicationController
  #     def batch_show
  #       batch_response(Resource.where(is_archived: false), limit: 30) do |record|
  #         ResourceSerializer.new(record).serializable_hash
  #       end
  #     end
  #   end
  def batch_response(scope, limit: 100)
    ids = params[:ids].split(',').map(&:strip).uniq
    raise BatchedRequest::TooManyRequestError.new(size: ids.size, limit: limit) if ids.size > limit
    records = scope.where(id: ids)
    records = Hash[*records.map { |r| [r.id.to_s, r] }.flatten(1)]
    response = ids.map do |id|
      begin
        record = records[id]
        raise ActiveRecord::RecordNotFound if record.nil?
        [id, yield(record)]
      rescue *BatchedRequest::REQUEST_ERRORS => e
        [id, error_response(e)[:json]]
      end
    end
    render json: {
      data: Hash[*response.flatten(1)]
    }
  end

  def render_error_response(e)
    render error_response(e)
  end

  def error_response(e)
    raise e if Rails.env.development? && params[:_debug] == '1'
    case e
    when ActiveRecord::RecordNotFound then
      Rails.logger.warn(e.full_message)
      {
        status: 404,
        json: {
          errors: [ Error::NotFoundSerializer.new.serializable_hash ]
        }
      }
    when ValidationFailedError then
      Rails.logger.warn(e.full_message)
      {
        status: 400,
        json: {
          errors: [
            Error::ValidationFailedSerializer.new(e).serializable_hash
          ]
        }
      }
    when BatchedRequest::TooManyRequestError then
      Rails.logger.warn(e.full_message)
      {
        status: 400,
        json: {
          errors: [ Error::TooManyRequestSerializer.new(size: e.size, limit: e.limit).serializable_hash ]
        }
      }
    else
      Rails.logger.error(e.full_message)
      {
        status: 500,
        json: {
          errors: [ Error::InternalServerErrorSerializer.new.serializable_hash ]
        }
      }
    end
  end
end
