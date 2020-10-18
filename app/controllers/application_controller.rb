class ApplicationController < ActionController::Base
  include Pundit
  include UserAuthenticatable
  include ErrorResponsible
  include BatchRequestable

  skip_forgery_protection
  rescue_from StandardError, with: :render_error_response

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
end
