class ApplicationController < ActionController::Base
  rescue_from StandardError, with: :render_error_response

  module BatchedRequest
    class Error < StandardError; end
    class TooManyRequestError < Error; end
    REQUEST_ERRORS = [
      ActiveRecord::RecordNotFound
    ].freeze
  end

  protected

  # GET /resources/batched/:ids
  # type JsonAPIBatchedResponse = {
  #   data: {
  #     [key:string]: JsonAPIResponse;
  #   };
  # };
  # @example
  #   class ResourcesController < ApplicationController
  #     def batch_show
  #       batch_response(Resource.where(is_archived: false), max_size: 30) do |record|
  #         ResourceSerializer.new(record).serializable_hash
  #       end
  #     end
  #   end
  def batch_response(scope, max_size: 100)
    ids = params[:ids].split(',').map(&:strip).uniq
    raise BatchedRequest::TooManyRequestError if ids.size > max_size
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

  # type Error = NotFoundError | TooManyRequestError | InternalServerError;
  # type NotFoundError = {
  #   code: 'not_found';
  #   title: string;
  # };
  # type TooManyRequestError = {
  #   code: 'too_many_request_error';
  #   title: string;
  # };
  # type InternalServerError = {
  #   code: 'internal_server_error';
  #   title: string;
  # };
  def error_response(e)
    raise e if Rails.env.development? && params[:_debug] == '1'
    case e
    when ActiveRecord::RecordNotFound then
      Rails.logger.warn(e.full_message)
      {
        status: 404,
        json: {
          errors: [
            NotFoundErrorSerializer.new.serializable_hash
          ]
        }
      }
    when BatchedRequest::TooManyRequestError then
      Rails.logger.warn(e.full_message)
      {
        status: 400,
        json: {
          errors: [
            TooManyRequestErrorSerializer.new.serializable_hash
          ]
        }
      }
    when StandardError then
      Rails.logger.error(e.full_message)
      {
        status: 500,
        json: {
          errors: [
            InternalServerErrorSerializer.new.serializable_hash
          ]
        }
      }
    end
  end
end
