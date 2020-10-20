require 'rails_helper'

RSpec.describe "Filters", type: :request do
  describe 'GET /filters' do
    when_user_logged_in do
      it { is_expected.to eq 200 }
    end
  end

  describe 'GET /filters/:id' do
    let(:filter) { create(:filter, user: auth_user) }
    let(:id) { filter.id }

    when_user_logged_in do
      it { is_expected.to eq 200 }
    end
  end

  describe 'POST /filters' do
    let(:filter) { build(:filter, user: auth_user) }
    let(:params) {{
      data: {
        type: 'filter',
        attributes: {
          name: filter.name,
          condition: filter.condition,
        }
      }
    }}
    let(:headers){{
      'Content-Type' => 'application/json'
    }}

    when_user_logged_in do
      it 'is expected to eq 201' do
        expect {
          is_expected.to eq 201
        }.to change { Filter.count }.by(1)
      end
    end
  end

  describe 'PUT /filters/:id' do
    let(:filter) { create(:filter, user: auth_user) }
    let(:new_attr) { attributes_for(:filter) }
    let(:id) { filter.id }
    let(:params) {{
      data: {
        id: filter.id,
        type: 'filter',
        attributes: {
          name: new_attr[:name],
          condition: new_attr[:condition],
        }
      }
    }}
    let(:headers){{
      'Content-Type' => 'application/json'
    }}

    when_user_logged_in do
      it 'is_expected.to eq 200' do
        expect {
          is_expected.to eq 200
        }.to change { filter.reload.attributes }
      end
    end
  end
end
