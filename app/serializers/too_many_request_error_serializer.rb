class TooManyRequestErrorSerializer < SimpleSerializer
  def initialize
    super({
      code: 'too_many_request_error',
      title: 'Too many requests',
    })
  end
end
