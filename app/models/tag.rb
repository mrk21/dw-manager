class Tag < ApplicationRecord
  has_many :history_tags
  has_many :histories, through: :history_tags

  validates :name, presence: true, uniqueness: true
end
