class Error::InternalServerErrorSerializer < SimpleSerializer
  def initialize
    super({
      code: 'internal_server_error',
      title: 'Internal Server Error',
    })
  end
end
