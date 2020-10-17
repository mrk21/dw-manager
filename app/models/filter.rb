require 'search_query'

class Filter < ApplicationRecord
  validates :name, length: { in: 1..255 }, uniqueness: true
  validates :condition, presence: true

  def matched_histories
    histories = History.all
    histories = histories.where(parsed_condition.to_arel) if condition.present?
    histories
  end

  def parsed_condition
    parser = SearchQuery::Parser.new(ConditionQueryContext.new)
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

  class ConditionQueryContext < SearchQuery::Context
    def table
      Arel::Table.new(:histories)
    end

    def text_column
      :title
    end

    def attrs
      {
        tag: ->(context, store, value) { TagCondition.new(context, store, value) },
      }
    end

    def on_to_arel(store)
      if store[:tag]
        tag_names = store[:tag][:values]
        tags = Tag.where(name: tag_names).select(:id, :name)
        tags = Hash[*tags.map { |t| [t.name, t.id] }.flatten(1)]
        store[:tag][:ids] = tags
      end
    end

    class TagCondition < AttributeCondition
      def for_arel
        tag_id = store[:tag][:ids][value]
        return Arel.sql('0') if tag_id.nil?

        Arel.sql(<<~SQL.strip.gsub(/\s+/, ' '))
          EXISTS (
            SELECT 1
            FROM history_tags AS t
            WHERE t.history_id = histories.id
              AND #{Arel::Table.new('t')[:tag_id].eq(tag_id).to_sql}
          )
        SQL
      end
    end
  end
end
