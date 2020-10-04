class ApplicationController < ActionController::Base
  rescue_from StandardError, with: :render_error_response

  protected

  # GET /resources/batched/:ids
  # type Response = {
  #   [key:string]: JsonApiResponse;
  # };
  def batch_response(scope)
    ids = params[:ids].split(',').uniq
    records = scope.where(id: ids)
    records = Hash[*records.map { |r| [r.id.to_s, r] }.flatten(1)]
    response = ids.map do |id|
      begin
        record = records[id]
        raise ActiveRecord::RecordNotFound if record.nil?
        [id, yield(record)]
      rescue => e
        [id, error_response(e)[:json]]
      end
    end
    render json: Hash[*response.flatten(1)]
  end

  def render_error_response(e)
    response = error_response(e)
    render response
  end

  def error_response(e)
    raise e if Rails.env.development? && params[:_debug] == '1'
    case e
    when ActiveRecord::RecordNotFound then
      Rails.logger.warn(e.full_message)
      {
        status: 404,
        json: {
          errors: [
            status: '404',
            code: '404',
            title: 'Not Found',
          ]
        }
      }
    when StandardError then
      Rails.logger.error(e.full_message)
      {
        status: 500,
        json: {
          errors: [
            status: '500',
            code: '500',
            title: 'Internal Server Error',
          ]
        }
      }
    end
  end
end
