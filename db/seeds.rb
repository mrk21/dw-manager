user1 = User.create!(email: 'user1@localhost.local', screen_name: 'user 1', name: 'Sample User 1')
user1.create_password_auth!(password: 'password')

user2 = User.create!(email: 'user2@localhost.local', screen_name: 'user 2', name: 'Sample User 2')
user2.create_password_auth!(password: 'password')

[user1, user2].each do |user|
  history_types = {
    convenience_store_a: 'A コンビニ',
    convenience_store_b: 'コンビニ B',
    supermarket_n: 'Nスーパー',
    supermarket_m: 'スーパーマーケット M',
  }
  subscription_history_types = {
    product_x: 'X COMPANY PRODUCTS',
    service_y: 'HOO SERVICE Y',
  }

  days = 3650
  history_props = days.times.map do |i|
    date = Time.zone.now.ago(days.days - i.days).to_date
    {
      id: SecureRandom.uuid,
      user_id: user.id,
      date: date,
      title: history_types.values.sample,
      amount: -rand(5000),
      institution: 'credit card A',
      is_transfer: false,
    }
  end
  History.import history_props

  months = days / 30
  history_props = months.times.map do |i|
    date = Time.zone.now.ago(days.days - i.months).to_date
    subscription_history_types.map do |_, title|
      {
        id: SecureRandom.uuid,
        user_id: user.id,
        date: date,
        title: title,
        amount: -rand(15000),
        institution: 'credit card A',
        is_transfer: false,
      }
    end
  end
  History.import history_props.flatten

  tag_food = Tag.create!(user: user, name: '食費')
  tag_convenience_store = Tag.create!(user: user, name: 'コンビニ')
  tag_subscription = Tag.create!(user: user, name: 'サブスクリプション')
  tag_supermarket = Tag.create!(user: user, name: 'スーパー')

  filter_convenience_store = Filter.create(user: user, name: 'コンビニ', condition: 'コンビニ')
  filter_supermarket = Filter.create(user: user, name: 'スーパー', condition: 'スーパー')
  filter_subscription = Filter.create(user: user, name: 'サブスクリプション', condition: '"X COMPANY PRODUCTS" OR "HOO SERVICE Y"')
  filter_without_food_and_daily_necessities = Filter.create(user: user, name: '食費・日用品以外', condition: '-スーパー -コンビニ')

  filter_convenience_store.tag_to_matched_histories!([tag_food, tag_convenience_store])
  filter_supermarket.tag_to_matched_histories!([tag_food, tag_supermarket])
  filter_subscription.tag_to_matched_histories!([tag_subscription])
end
