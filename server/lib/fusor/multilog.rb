require 'logger'

class MultiLogger
  attr_reader :logdev

  def initialize(logger)
    @original = logger
  end

  # Creates and write to additional log file(s).
  def attach(name)
    @logdev ||= {}
    if !name.nil? and !@logdev.key? name
      logger = Logger.new(name)
      logger.level = log_level
      @logdev[name] = logger
    end
  end

  # Closes a secondary log file.
  def detach(name)
    @logdev ||= {}
    if !name.nil? and @logdev.key? name
      @logdev[name].close
      @logdev.delete(name)
    end
  end

  def detach_all
    @logdev ||= {}

    @logdev.each do |name, dev|
      detach(name)
    end
  end

  def method_missing(method, *args)
    @original.send(method, *args)

    @logdev ||= {}
    @logdev.each do |name, dev|
      dev.send(method, *args)
    end
  end

  def log_level
    levels = { ":debug" => Logger::DEBUG,
               ":info" => Logger::INFO,
               ":warn" => Logger::WARN,
               ":error" => Logger::ERROR,
               ":fatal" => Logger::FATAL,
               ":unknown" => Logger::UNKNOWN }
    levels[SETTINGS[:fusor][:system][:logging][:level]]
  end
end
