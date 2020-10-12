require 'search_query'

class Filter < ApplicationRecord
  validates :name, length: { in: 1..255 }
  validates :condition, presence: true

  def matched_histories
    histories = History.all
    histories = histories.where(parsed_condition.to_arel) if condition.present?
    histories
  end

  def parsed_condition
    parser = SearchQuery::Parser.new(
      SearchQuery::Context.new(
        table: Arel::Table.new(:histories),
        text_column: :title,
      )
    )
    parser.parse(condition)
  end

  # @param tags [Array<Tag> | Relation<Tag>]
  def tag_to_matched_histories!(tags)
    matched_histories.in_batches(of: 1000 / tags.size) do |histories|
      records = histories.map do |history|
        tags.map do |tag|
          {
            history_id: history.id,
            tag_id: tag.id,
          }
        end
      end
      HistoryTag.import records.flatten
    end
  end
end
