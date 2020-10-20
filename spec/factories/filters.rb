FactoryBot.define do
  factory :filter do
    association :user
    name { Faker::Name.unique.name }
    condition { Faker::Name.name }
  end
end
