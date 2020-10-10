Rails.application.routes.draw do
  resources :histories, only: [:index]
  resources :filters, only: [:index, :create]
  resources :tags do
    collection do
      get 'batched/:ids', action: :batch_show
    end
  end
end
