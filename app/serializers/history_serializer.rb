class HistorySerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attribute(:date) { |o| o.date.iso8601 }
  attribute :title
  attribute :amount
  attribute :institution
  attribute :is_transfer
  has_many :tags
end
