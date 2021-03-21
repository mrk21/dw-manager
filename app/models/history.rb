class History < ApplicationRecord
  belongs_to :user
  has_many :history_tags
  has_many :tags, through: :history_tags

  scope :tagged_by, ->(tag_id) {
    return all if tag_id.blank?
    where(<<~SQL, tag_id)
      exists (
        select 1
        from history_tags as t
        where t.history_id = histories.id
          and t.tag_id = ?
      )
    SQL
  }

  Report = Struct.new(*%i(
    period
    period_type
    pamount
    namount
    amount
  ), keyword_init: true)

  # @example
  #   user = User.first
  #   tag = user.tags.first
  #   user.histories.tagged_by(tag.id).report
  def self.report(period_type = :monthly)
    format = case period_type.to_s.intern
      when :yearly then '%Y'
      when :monthly then '%Y-%m'
      else raise ArgumentError, 'invalid period type'
    end
    scope = all.where(is_transfer: 0)
    results = connection.select_all(<<~SQL).to_a
      select
        `period`
      , '#{period_type}' as `period_type`
      , sum(pamount) pamount
      , sum(namount) namount
      , sum(amount) amount
      from (
        select
          date_format(`date`, '#{format}') as `period`
        , case when amount > 0 then amount else 0 end as pamount
        , case when amount < 0 then amount else 0 end as namount
        , amount
        from (#{scope.to_sql}) as tt
      ) as t
      group by `period`
      order by `period`
    SQL
    results.map(&Report.method(:new))
  end
end
