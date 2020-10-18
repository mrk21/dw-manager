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
end
