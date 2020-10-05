class HistorySerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  Tag = Struct.new(:id, keyword_init: true)

  attribute(:date) { |o| o.date.iso8601 }
  attribute :title
  attribute :amount
  attribute :institution
  attribute :is_transfer
  has_many :tags, serializer: TagSerializer do |o|
    o.history_tags.map { |t| Tag.new(id: t.tag_id) }
  end
end
