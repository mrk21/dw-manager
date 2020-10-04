class TagSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attribute :name
end
