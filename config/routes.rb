Rails.application.routes.draw do
  resources :haikus
  resources :comments
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      match '/haiku' => 'haiku#create', via: :post
      match '/haiku' => 'haiku#index', via: :get
      match '/haiku/:haiku_id/upvote' => 'haiku#upvote', via: :put
      match '/haiku/:haiku_id/downvote' => 'haiku#downvote', via: :put
      match '/haiku/:haiku_id/vote/:vote_id' => 'haiku#delete_vote', via: :delete
    end
  end
end
