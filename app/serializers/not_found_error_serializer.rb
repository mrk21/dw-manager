class NotFoundErrorSerializer < SimpleSerializer
  def initialize
    super({
      code: 'not_found_error',
      title: 'Not Found',
    })
  end
end
