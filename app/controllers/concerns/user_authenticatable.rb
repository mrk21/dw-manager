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

    def current=(user)
      @current = user
      @session[:user_id] = user&.id
    end

    def clear!
      @current = nil
      @reset_session.call
    end

    def required!
      raise SessionExpired if current.nil?
    end

    def authenticate!(user)
      raise AuthenticationFailed if user.nil?
      clear!
      self.current = user
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
end
