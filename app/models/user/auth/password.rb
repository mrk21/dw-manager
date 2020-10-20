class User::Auth::Password < ApplicationRecord
  has_secure_password
  belongs_to :user, inverse_of: :password_auth
  validates :password, length: { in: 8..64 }

  # @return [User | nil]
  def self.authenticate(email:, password:)
    user = User.find_by(email: email)
    return nil if user.nil?
    return nil if user.password_auth.nil?
    return user if user.password_auth.authenticate(password)
    return nil
  end
end
