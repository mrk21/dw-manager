class Error::NotFoundSerializer < SimpleSerializer
  def initialize
    super({
      code: 'not_found',
      title: 'Not Found',
    })
  end
end
