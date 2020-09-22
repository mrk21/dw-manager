class History < ApplicationRecord
  has_many :history_tags
  has_many :tags, through: :history_tags
end
