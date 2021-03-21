class User < ApplicationRecord
  has_one :password_auth, dependent: :destroy, inverse_of: :user,
    class_name: :'User::Auth::Password', foreign_key: :user_id

  has_many :histories
  has_many :tags
  has_many :filters

  accepts_nested_attributes_for :password_auth, allow_destroy: true

  validates :email, presence: :true
  validates :screen_name, presence: :true
  validates :name, presence: :true
end
