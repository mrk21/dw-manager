require 'rails_helper'

RSpec.describe "Tags", type: :request do
  describe 'GET /tags' do
    when_user_logged_in do
      it { is_expected.to eq 200 }
    end
  end

  describe 'GET /tags/:id' do
    let(:tag) { create(:tag, user: auth_user) }
    let(:id) { tag.id }

    when_user_logged_in do
      it { is_expected.to eq 200 }
    end
  end

  describe 'GET /tags/batched/:ids' do
    let(:tags) { create_list(:tag, 4, user: auth_user) }
    let(:ids) { tags.map(&:id).join(',') }

    when_user_logged_in do
      it { is_expected.to eq 200 }
    end
  end
end
