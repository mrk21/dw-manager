module Support
  # @see https://github.com/varvet/pundit/blob/f252293/lib/pundit/rspec.rb
  module LoggedInContext
    module DSL
      def when_user_logged_in(&block)
        let(:auth_user) { create(:user, :with_password_auth) }

        context 'when user logged in' do
          before do
            post '/session/password', params: {
              auth: {
                email: auth_user.email,
                password: auth_user.password_auth.password,
              }
            }
          end

          instance_eval(&block)
        end

        context 'when user did not log in' do
          it { is_expected.to eq 401 }
        end
      end
    end

    def self.included(base)
      base.extend DSL
      super
    end
  end
end
