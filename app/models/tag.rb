class Tag < ApplicationRecord
  belongs_to :user
  has_many :history_tags
  has_many :histories, through: :history_tags

  validates :name, presence: true, uniqueness: { case_sensitive: false, scope: :user }
end
