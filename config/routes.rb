Rails.application.routes.draw do
  resources :histories, only: [:index] do
    collection do
      get 'report', action: :report
    end
  end
  resources :filters, only: [:index, :show, :create, :update]
  resources :tags do
    collection do
      get 'batched/:ids', action: :batch_show
    end
  end
  resource :session, only: [:show, :destroy] do
    scope module: :sessions do
      resource :password, only: [:create]
    end
  end
end
