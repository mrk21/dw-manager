class HistoriesController < ApplicationController
  def index
    filter = Filter.new(filter_params)
    records = filter.matched_histories
    records = records.includes(:history_tags)
    records = records.page(page_params[:page]).per(page_params[:per])
    records = records.order(date: :desc)
    serializer = HistorySerializer.new(records, {
      meta: {
        page: OffsetPaginationSerializer.new(records)
      }
    })
    render json: serializer.serializable_hash
  end

  private

  def page_params
    @page_params ||= {
      page: params[:page] || 1,
      per: params[:per] || 20,
    }
  end

  def filter_params
    @filter_params ||= {
      condition: params[:condition]
    }
  end
end
