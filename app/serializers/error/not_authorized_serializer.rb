class Error::NotAuthorizedSerializer < SimpleSerializer
  def initialize
    super({
      code: 'not_authorized',
      title: 'Not authorized',
    })
  end
end
