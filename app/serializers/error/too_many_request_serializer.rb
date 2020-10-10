class Error::TooManyRequestSerializer < SimpleSerializer
  def initialize(size:, limit:)
    super({
      code: 'too_many_request',
      title: "Too many requests (size: #{size}, limit: #{limit})",
    })
  end
end
