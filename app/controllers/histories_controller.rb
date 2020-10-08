class HistoriesController < ApplicationController
  def index
    records = History.includes(:history_tags)
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
end
