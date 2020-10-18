class HistoriesController < ApplicationController
  before_action :user_auth_required!

  def index
    histories = if histories_params[:condition].present?
      filter = Filter.new(condition: histories_params[:condition].to_s.strip)
      filter.matched_histories
    elsif histories_params[:filter_id].present?
      filter = Filter.find(histories_params[:filter_id])
      filter.matched_histories
    else
      History.all
    end
    histories = histories.includes(:history_tags)
    histories = histories.tagged_by(histories_params[:tag_id])
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

  def histories_params
    {
      condition: params[:condition],
      tag_id: params[:tag_id],
      filter_id: params[:filter_id],
    }
  end
end
