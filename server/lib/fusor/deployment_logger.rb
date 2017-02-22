require 'logger'
require 'fusor/password_filter'

##
# DeploymentLogger
# ================
# Child of Ruby base logging class. Filters passwords from logs using context
# provided by a Deployment object.
#
class DeploymentLogger < Logger

  def initialize(*args, deployment)
    super(*args)
    if !deployment.nil?
      add_deployment_passwords(deployment)
    end
  end

  def add(severity, message = nil, progname = nil)
    if !message.nil?
      message = @password_filter.filter_passwords(message.clone)
    end
    if !progname.nil?
      progname = @password_filter.filter_passwords(progname.clone)
    end
    super(severity, message, progname)
  end

  def add_passwords_to_filter(deployment)
    # pulls passwords from deployment object so that
    # future logs will not expose passwords in plaintext
    if !deployment.nil?
      @password_filter || @password_filter = PasswordFilter.new
      @password_filter.extract_deployment_passwords(deployment)
    end
  end
end
