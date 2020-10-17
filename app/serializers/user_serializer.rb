class UserSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower
  attribute :screen_name
  attribute :name
end
