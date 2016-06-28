#
# This file was originally included in Satellite 6.1 and was removed from Sat 6.2
#   https://github.com/Katello/katello/blob/d24cc15da9a6943ea567363e296246e9f510864f/lib/katello/middleware/silenced_logger.rb
#
module Fusor
  module Middleware
    class SilencedLogger < Rails::Rack::Logger
      def prefixes
        SETTINGS[:fusor][:system][:silenced_logging][:paths]
      end

      def initialize(app, _options = {})
        @app = app
      end

      def call(env)
        old_level = Rails.logger.level
        if prefixes.any? { |path|  env["PATH_INFO"].include?(path) }
          Rails.logger.level = Logger::WARN
        end
        @app.call(env)
      ensure
        Rails.logger.level = old_level
      end
    end
  end
end
