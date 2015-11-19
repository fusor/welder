require 'logger'

class Logger
  # Creates and write to additional log file(s).
  def attach(name)
    @logdev.attach(name)
  end

  # Closes a secondary log file.
  def detach(name)
    @logdev.detach(name)
  end

  class LogDevice 
    attr_reader :devs

    def attach(log)
      @devs ||= {}
      @devs[log] = open_logfile(log)
    end

    def detach(log)
      @devs ||= {}
      if @devs.has_key? log
        @devs[log].close
        @devs.delete(log)
      end
    end

    alias_method :old_write, :write
    def write(message)
      old_write(message)

      @devs ||= {}
      @devs.each do |log, dev|
        dev.write(message)
      end
    end
  end
end
