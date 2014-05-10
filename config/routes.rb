Rails.application.routes.draw do
  root :to => "home#index"
  devise_for :users, :controllers => {:registrations => "registrations"}
  resources :users
  get 'locational_clearances/queued', :to => 'locational_clearances#queued'
  get 'locational_clearances/list', :to => 'locational_clearances#list'
  put 'locational_clearances/approve', :to => 'locational_clearances#approve'
  put 'locational_clearances/reject', :to => 'locational_clearances#reject'
  resources :locational_clearances

  authenticated :user do
    root to: "locational_clearances#show", as: :application
  end
end