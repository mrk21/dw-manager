class FiltersController < ApplicationController
  def index
    filters = Filter.page(page_params[:page]).per(page_params[:per])
    serializer = FilterSerializer.new(filters, {
      meta: {
        page: OffsetPaginationSerializer.new(filters)
      }
    })
    render json: serializer.serializable_hash
  end

  def show
    filter = Filter.find(params[:id])
    render json: FilterSerializer.new(filter).serializable_hash
  end

  def create
    filter = Filter.new(filter_params)
    ValidationFailedError.capture(type: 'filter', path: '/data') do
      filter.save!
    end
    render status: 201, json: FilterSerializer.new(filter)
  end

  def update
    filter = Filter.find(params[:id])
    filter.assign_attributes(filter_params)
    ValidationFailedError.capture(type: 'filter', path: '/data') do
      filter.save!
    end
    render json: FilterSerializer.new(filter)
  end

  private

  def filter_params
    body = json_params.permit(
      data: [
        attributes: [
          :name,
          :condition,
        ]
      ]
    )
    body[:data][:attributes]
  end
end
