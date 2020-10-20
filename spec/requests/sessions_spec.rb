require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe 'POST /session/password' do
    let(:user) { create(:user, :with_password_auth) }

    let(:params) {{
      auth: {
        email: user.email,
        password: user.password_auth.password,
      }
    }}

    it 'creates session' do
      expect(get '/session').to eq 401
      is_expected.to eq 201
      expect(get '/session').to eq 200
    end
  end

  describe 'GET /session' do
    when_user_logged_in do
      it { is_expected.to eq 200 }
    end
  end

  describe 'DELETE /session' do
    let(:user) { create(:user, :with_password_auth) }

    before do
      post '/session/password', params: {
        auth: {
          email: user.email,
          password: user.password_auth.password,
        }
      }
    end

    it 'deletes session' do
      expect(get '/session').to eq 200
      is_expected.to eq 200
      expect(get '/session').to eq 401
    end
  end
end
