class Error::ValidationFailedSerializer < SimpleSerializer
  # @param e [ValidationFailedError]
  def initialize(e)
    super({
      code: "validation_failed",
      title: "Invalid #{e.type.humanize(capitalize: false)}",
      source: { pointer: e.path },
      meta: {
        messages: e.errors.messages
      },
    })
  end
end
