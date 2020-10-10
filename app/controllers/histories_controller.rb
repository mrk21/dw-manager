class HistoriesController < ApplicationController
  def index
    filter = Filter.new(filter_params)
    histories = filter.matched_histories
    histories = histories.includes(:history_tags)
    histories = histories.page(page_params[:page]).per(page_params[:per])
    histories = histories.order(date: :desc)
    serializer = HistorySerializer.new(histories, {
      meta: {
        page: OffsetPaginationSerializer.new(histories)
      }
    })
    render json: serializer.serializable_hash
  end

  private

  def filter_params
    @filter_params ||= {
      condition: params[:condition].to_s.strip
    }
  end
end
