class SessionsController < ApplicationController
  def show
    raise SessionExpiredError if session[:user_id].nil?
    user = User.find_by(id: session[:user_id])
    raise SessionExpiredError if user.nil?
    render json: UserSerializer.new(user).serializable_hash
  end

  def destroy
    reset_session
    render status: 204, plain: ''
  end
end
