#
# Copyright 2015 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Fusor
  module Api
    module CustomerPortal
      class CustomerPortalProxiesController < Api::V21::BaseController

        before_filter :verify_logged_in, :except => [:login, :logout, :is_authenticated]
        before_filter :verify_portal_credentials, :only => [:login]
        before_filter :proxy_request_path, :except => [:login, :logout, :is_authenticated]
        before_filter :proxy_request_body, :except => [:login, :logout, :is_authenticated]

        resource_description do
          name 'Customer Portal Proxy'
          desc 'Proxy to Red Hat customer portal for some API methods. Refer to customer portal '\
               'documentation for parameters available to each method.'
          api_version 'fusor_v21'
          api_base_url '/fusor/api/customer_portal'
        end

        api :post, '/login', 'Log in to customer portal (creates session)'
        param :username, String, desc: 'Customer portal account username to log in'
        param :password, String, desc: 'Customer portal account password to log in'
        def login
          session[:portal_username] = params[:username]
          session[:portal_password] = params[:password]
          render :json => {}
        end

        api :post, '/logout', 'Log out of customer portal (deletes session)'
        def logout
          session.delete(:portal_username)
          session.delete(:portal_password)
          render :json => {}
        end

        api :get, '/is_authenticated', 'Is there an active authenticated session to the customer portal'
        def is_authenticated
          authenticated = false
          if session[:portal_username] && session[:portal_password]
            # they are not nil, let's make sure neither is empty
            authenticated = !session[:portal_username].empty? && !session[:portal_password].empty?
          end
          render :json => authenticated
        end

        # Apipie doesn't support multiple actions for a single controller method
        # The following methods document the requests but are not used directly.
        #
        #### BEGIN Apipie Docs ####
        api :get, '/users/:login/owners', '(Proxied API method) Get a list of subscription owners'
        param :login, String, desc: 'Subscription account login user ID'
        def get_owners_no_op; end #apipie docs dummy.  Routes to get()

        api :get, '/pools', '(Proxied API method) Get a list of subscription pools'
        def get_pools_no_op; end #apipie docs dummy.  Routes to get()

        api :get, '/owners/:id/consumers', '(Proxied API method) Get a list of subscription consumers'
        param :id, :identifier, desc: 'UUID of the subscription owner'
        def get_consumers_no_op; end #apipie docs dummy.  Routes to get()

        api :get, '/consumers/:id', '(Proxied API method) Get a subscription consumer'
        param :id, String, desc: 'Subscription consumer UUID'
        def get_consumer_no_op; end #apipie docs dummy.  Routes to get()

        api :post, '/consumers', '(Proxied API method) Create a new subscription consumer'
        def create_consumer_no_op; end #apipie docs dummy.  Routes to post()

        api :get, '/consumers/:id/entitlements', '(Proxied API method) Get a list of subscription entitlements'
        param :id, String, desc: 'Subscription consumer UUID'
        def get_entitlements_no_op; end #apipie docs dummy.  Routes to get()

        api :post, '/consumers/:id/entitlements', '(Proxied API method) Create new subscription entitlement'
        param :id, String, desc: 'Subscription consumer UUID'
        def create_entitlement_no_op; end #apipie docs dummy.  Routes to post()

        api :delete, '/consumers/:id/entitlements', '(Proxied API method) Delete all entitlements for a subscription consumer'
        param :id, String, desc: 'Subscription consumer UUID'
        def delete_entitlements_no_op; end #apipie docs dummy.  Routes to delete()
        #### END Apipie Docs ####

        def get
          response = Resources::CustomerPortal::Proxy.get(@request_path, credentials)
          logger.debug response
          render :json => response
        end

        def post
          response = Resources::CustomerPortal::Proxy.post(@request_path, credentials, @request_body.read)
          logger.debug response
          render :json => response
        end

        def delete
          response = Resources::CustomerPortal::Proxy.delete(@request_path, credentials, @request_body.read)
          logger.debug response
          render :json => response
        end

        private

        def proxy_request_path
          @request_path = drop_api_namespace(@_request.fullpath)
        end

        def proxy_request_body
          @request_body = @_request.body
        end

        def drop_api_namespace(original_request_path)
          prefix = "/customer_portal"
          original_request_path.gsub(prefix, '')
        end

        def verify_portal_credentials
          unless (params[:username] && params[:password])
            fail ::Katello::HttpErrors::Unauthorized, _("Please provide username and password.")
          end
        end

        def verify_logged_in
          unless (session[:portal_username] && session[:portal_password])
            fail ::Katello::HttpErrors::Unauthorized, _("Customer portal credentials are required.  Please provide them using login.")
          end
        end

        def credentials
          { :username => session[:portal_username], :password => session[:portal_password] }
        end
      end
    end
  end
end
