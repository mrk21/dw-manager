class Error::SessionExpiredSerializer < SimpleSerializer
  def initialize
    super({
      code: 'session_expired',
      title: 'Session expired',
    })
  end
end
