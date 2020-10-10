class FilterSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  attribute :name
  attribute :condition
end
