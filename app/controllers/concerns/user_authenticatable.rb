module UserAuthenticatable
  extend ActiveSupport::Concern

  class UserAuthentication
    class Error < StandardError; end
    class AuthenticationFailed < Error; end
    class SessionExpired < Error; end

    def initialize(session, reset_session)
      @session = session
      @reset_session = reset_session
    end

    def current
      @current ||= User.find_by(id: @session[:user_id])
    end

    def logged_in?
      @session[:user_id].present? && User.where(id: @session[:user_id]).exists?
    end

    def clear!
      @current = nil
      @reset_session.call
    end

    def required!
      raise SessionExpired unless logged_in?
    end

    def authenticate!(user)
      raise AuthenticationFailed if user.nil?
      clear!
      @current = user
      @session[:user_id] = user.id
    end
  end

  protected

  def user_auth
    @user_auth ||= UserAuthentication.new(session, method(:reset_session))
  end

  # @example
  #  class FooController < ActionController::Base
  #    include UserAuthenticatable
  #    before_action :user_auth_required!
  #
  #    def show
  #      user = user_auth.current
  #      ...
  #    end
  #  end
  def user_auth_required!
    user_auth.required!
  end

  # for Pundit
  def pundit_user
    user_auth.current
  end
end
