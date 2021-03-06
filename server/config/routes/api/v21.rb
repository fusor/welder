Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope "(:api_version)", :module => :v21, :defaults => {:api_version => 'v21'}, :api_version => /v21/, :constraints => ApiConstraints.new(:version => 21, :default => false) do
        resources :deployments do
          member do
            put :deploy
            put :redeploy
            get :validate
            get :validate_cdn
            get :log
            get :openshift_disk_space
            get :check_mount_point
            get :compatible_cpu_families
          end
        end
        resources :openstack_deployments do
          member do
            post :sync_openstack
          end
        end
        resources :subscriptions do
          collection do
            put :upload
            get :validate
          end
        end

        scope 'unlogged' do
          get '/deployments/:id/log', to: 'deployments#log'
        end
      end
    end
  end
end
