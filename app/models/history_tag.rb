class HistoryTag < ApplicationRecord
  belongs_to :history
  belongs_to :tag
end
