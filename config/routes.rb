Rails.application.routes.draw do
  root :to => "home#index"
  devise_for :users, :controllers => {:registrations => "registrations"}
  resources :users
  get 'locational_clearances/queued', :to => 'locational_clearances#queued'
  resources :locational_clearances

  authenticated :user do
    root to: "locational_clearances#show", as: :application
  end
end