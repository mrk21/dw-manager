FactoryBot.define do
  factory :tag do
    association :user
    name { Faker::Name.unique.name }
  end
end
