class TagsController < ApplicationController
  before_action :user_auth_required!

  def index
    tags = policy_scope(Tag)
    tags = tags.page(page_params[:page]).per(page_params[:per])
    serializer = FilterSerializer.new(tags, {
      meta: {
        page: OffsetPaginationSerializer.new(tags)
      }
    })
    render json: serializer.serializable_hash
  end

  def show
    tag = Tag.find(params[:id])
    authorize tag
    render json: TagSerializer.new(tag).serializable_hash
  end

  def batch_show
    batch_response(Tag, limit: 1000) do |tag|
      authorize tag
      TagSerializer.new(tag).serializable_hash
    end
  end
end
