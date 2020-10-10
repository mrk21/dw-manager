class TagsController < ApplicationController
  def index
    tags = Tag.all
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
