class Error::AuthenticationFailedSerializer < SimpleSerializer
  def initialize
    super({
      code: 'authentication_failed',
      title: 'Authentication failed',
    })
  end
end
