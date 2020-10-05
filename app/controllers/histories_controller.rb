class HistoriesController < ApplicationController
  def index
    records = History.includes(:history_tags).all
    render json: HistorySerializer.new(records).serializable_hash
  end
end
