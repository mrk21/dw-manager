class Sessions::PasswordsController < ApplicationController
  def create
    params_ = auth_params
    user = User::Auth::Password.authenticate(email: params_['email'], password: params_['password'])
    raise AuthenticationError if user.nil?
    session[:user_id] = user.id
    render status: 201, json: UserSerializer.new(user).serializable_hash
  end

  private

  def auth_params
    params.require(:auth).permit(:email, :password)
  end
end
