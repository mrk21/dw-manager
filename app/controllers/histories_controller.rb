class HistoriesController < ApplicationController
  def index
    records = History.includes(:history_tags)
    records = records.page(params[:page] || 1).per(params[:per] || 20)
    records = records.order(date: :desc)
    serializer = HistorySerializer.new(records, {
      meta: {
        page: OffsetPaginationSerializer.new(records)
      }
    })
    render json: serializer.serializable_hash
  end
end
