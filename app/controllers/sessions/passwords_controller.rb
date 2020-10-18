class Sessions::PasswordsController < ApplicationController
  def create
    user_auth.authenticate! User::Auth::Password.authenticate(**auth_params)
    render status: 201, json: UserSerializer.new(user_auth.current).serializable_hash
  end

  private

  def auth_params
    params.require(:auth)
      .permit(:email, :password)
      .to_h
      .deep_symbolize_keys
  end
end
