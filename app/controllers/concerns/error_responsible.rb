module ErrorResponsible
  extend ActiveSupport::Concern

  class ErrorResponse
    Response = Struct.new(:status, :json, keyword_init: true)

    def initialize(is_debug)
      @is_debug = is_debug
    end

    # @param e [T extends StandardError]
    def from(e)
      raise e if @is_debug
      case e
      when UserAuthenticatable::UserAuthentication::SessionExpired
        Rails.logger.warn(e.inspect)
        Response.new(
          status: 401,
          json: {
            errors: [ Error::SessionExpiredSerializer.new.serializable_hash ]
          }
        )
      when UserAuthenticatable::UserAuthentication::AuthenticationFailed
        Rails.logger.warn(e.inspect)
        Response.new(
          status: 401,
          json: {
            errors: [ Error::AuthenticationFailedSerializer.new.serializable_hash ]
          }
        )
      when Pundit::NotAuthorizedError
        Rails.logger.warn(e.inspect)
        Response.new(
          status: 403,
          json: {
            errors: [ Error::NotAuthorizedSerializer.new.serializable_hash ]
          }
        )
      when ActiveRecord::RecordNotFound
        Rails.logger.warn(e.inspect)
        Response.new(
          status: 404,
          json: {
            errors: [ Error::NotFoundSerializer.new.serializable_hash ]
          }
        )
      when Error::ValidationFailed
        Rails.logger.warn(e.inspect)
        Response.new(
          status: 400,
          json: {
            errors: [
              Error::ValidationFailedSerializer.new(e).serializable_hash
            ]
          }
        )
      when BatchRequestable::BatchRequest::TooManyRequestError
        Rails.logger.warn(e.inspect)
        Response.new(
          status: 400,
          json: {
            errors: [ Error::TooManyRequestSerializer.new(size: e.size, limit: e.limit).serializable_hash ]
          }
        )
      else
        Rails.logger.error(e.full_message)
        Response.new(
          status: 500,
          json: {
            errors: [ Error::InternalServerErrorSerializer.new.serializable_hash ]
          }
        )
      end
    end
  end

  protected

  def error_response
    @error_response ||= ErrorResponse.new(
      Rails.env.development? && params[:_debug] == '1'
    )
  end

  # @example
  #  class FooController < ActionController::Base
  #    include ErrorResponsible
  #
  #    rescue_from StandardError, with: :render_error_response
  #  end
  def render_error_response(e)
    render error_response.from(e).to_h
  end
end
