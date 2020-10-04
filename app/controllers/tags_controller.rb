class TagsController < ApplicationController
  def index
    records = Tag.all
    render json: TagSerializer.new(records).serializable_hash
  end

  def show
    record = Tag.find(params[:id])
    render json: TagSerializer.new(record).serializable_hash
  end

  def batch_show
    batch_response(Tag) do |record|
      TagSerializer.new(record).serializable_hash
    end
  end
end
