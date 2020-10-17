class Error::AuthenticationErrorSerializer < SimpleSerializer
  def initialize
    super({
      code: 'authentication_error',
      title: 'Authentication error',
    })
  end
end
