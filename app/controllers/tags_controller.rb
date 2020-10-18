class TagsController < ApplicationController
  before_action :user_auth_required!

  def index
    tags = Tag.all
    tags = tags.page(page_params[:page]).per(page_params[:per])
    render json: TagSerializer.new(tags).serializable_hash
  end

  def show
    tag = Tag.find(params[:id])
    render json: TagSerializer.new(tag).serializable_hash
  end

  def batch_show
    batch_response(Tag, limit: 1000) do |tag|
      TagSerializer.new(tag).serializable_hash
    end
  end
end
