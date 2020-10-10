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

  def create
    filter = Filter.new(new_filter_params)
    ValidationFailedError.capture(type: 'filter', path: '/data') do
      filter.save!
    end
    render status: 201, json: FilterSerializer.new(filter)
  end

  private

  def new_filter_params
    body = json_params.permit(
      data: [
        :type,
        attributes: [
          :name,
          :condition,
        ]
      ]
    )
    body[:data][:attributes]
  end
end
