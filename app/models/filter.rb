class Filter < ApplicationRecord
  validates :name, length: { in: 1..255 }
  validates :condition, presence: true

  def matched_histories
    histories = History.all
    histories = histories.where('title REGEXP ?', condition) if condition.present?
    histories
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
