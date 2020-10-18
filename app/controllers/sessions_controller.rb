class SessionsController < ApplicationController
  before_action :user_auth_required!, only: [:show]

  def show
    render json: UserSerializer.new(user_auth.current).serializable_hash
  end

  def destroy
    user_auth.clear!
    render json: { data: true }
  end
end
