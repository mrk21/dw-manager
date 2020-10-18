module BatchRequestable
  extend ActiveSupport::Concern

  class BatchRequest
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

    # @param error_response [ErrorResponsible::ErrorResponse]
    # @param handleable_errors [Array<T extends StandardErrorClass>] Error classes handled on each request
    def initialize(error_response:, handleable_errors:)
      @error_response = error_response
      @handleable_errors = handleable_errors
    end

    def response(scope, ids:, limit: 100)
      ids = ids.split(',').map(&:strip).uniq
      raise TooManyRequestError.new(size: ids.size, limit: limit) if ids.size > limit

      records = scope.where(id: ids)
      records = Hash[*records.map { |r| [r.id.to_s, r] }.flatten(1)]

      response = ids.map do |id|
        begin
          record = records[id]
          raise ActiveRecord::RecordNotFound if record.nil?
          [id, yield(record)]
        rescue *@handleable_errors => e
          [id, @error_response.from(e).json]
        end
      end
      response = { data: Hash[*response.flatten(1)] }
      response
    end
  end

  protected

  def batch_request
    @batch_request ||= BatchRequest.new(
      error_response: error_response,
      handleable_errors: [
        ActiveRecord::RecordNotFound,
        Error::ValidationFailed,
        Pundit::NotAuthorizedError,
      ]
    )
  end

  # GET /resources/batched/:ids
  #
  # @return [{
  #   data: {
  #     [key:string]: JsonAPIResponse;
  #   };
  # }]
  #
  # @example
  #  class ResourcesController < ActionController::Base
  #    include ErrorResponsible
  #    include BatchRequestable
  #
  #    def batch_show
  #      batch_response(Resource.where(is_archived: false), limit: 30) do |record|
  #        ResourceSerializer.new(record).serializable_hash
  #      end
  #    end
  #  end
  def batch_response(scope, limit: 100, &block)
    render json: batch_request.response(
      scope,
      ids: params[:ids],
      limit: limit,
      &block
    )
  end
end
