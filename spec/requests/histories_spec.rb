require 'rails_helper'

RSpec.describe "Histories", type: :request do
  describe 'GET /histories' do
    when_user_logged_in do
      it { is_expected.to eq 200 }
    end
  end
end
