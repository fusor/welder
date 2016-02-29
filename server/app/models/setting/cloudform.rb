module Fusor
  class Setting::Cloudform < ::Setting

    def self.load_defaults
      return unless super

      self.transaction do
        [
        ].each { |s| self.create! s.update(:category => "Setting::Cloudforms") }

      end
      true
    end

  end
end
