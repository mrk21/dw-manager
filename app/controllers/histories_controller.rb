class HistoriesController < ApplicationController
  before_action :user_auth_required!

  def index
    histories = case
    when filter_params[:condition].present?
      filter = Filter.new(user: user_auth.current)
      authorize filter, :show?
      filter.assign_attributes(filter_params)
      filter.matched_histories
    else
      policy_scope(History)
    end
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
    result = {}
    result[:condition] = params[:condition].to_s.strip
    result
  end
end
