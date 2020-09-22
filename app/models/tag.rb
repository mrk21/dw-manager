class Tag < ApplicationRecord
  has_many :history_tags
  has_many :histories, through: :history_tags
end
