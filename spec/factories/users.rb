FactoryBot.define do
  factory :user do
    transient do
      data { Faker::Twitter.user(include_email: true) }
    end

    email { data[:email] }
    screen_name { data[:screen_name] }
    name { data[:name] }

    trait :with_password_auth do
      password_auth_attributes {{ password: 'password' }}
    end
  end
end
