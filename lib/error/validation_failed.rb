module Error
  class ValidationFailed < StandardError
    attr_reader :type
    attr_reader :path
    attr_reader :errors

    def initialize(type:, path:, errors:)
      @type = type
      @path = path
      @errors = errors
    end

    def self.capture(type:, path:)
      yield
    rescue ActiveRecord::RecordInvalid => e
      raise new(type: type, path: path, errors: e.record.errors)
    rescue => e
      raise e
    end
  end
end
