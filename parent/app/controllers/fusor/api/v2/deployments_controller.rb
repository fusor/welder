module Fusor
  class Api::V2::DeploymentsController < Api::V2::BaseController

    def index
      puts "XXX index called"
      Rails.logger.info("XXX index called")
      @deployment = Deployment.all
    end

    def create
      Rails.logger.info("XXX create")
      puts "XXX create"
      @deployment = Deployment.new(params[:deployment])
      process_response @deployment.save
    end

    def update
      puts "XXX update"
      process_response @deployment.update_attributes(params[:deployment])
    end

    def destroy
      puts "XXX destroy"
      process_response @deployment.destroy
    end

  end
end
