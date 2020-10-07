class SimpleSerializer
  def initialize(obj)
    @obj = obj
  end

  def serializable_hash
    @obj.deep_transform_keys { |k| k.to_s.camelize(:lower).to_sym }
  end

  def as_json(_options = nil)
    serializable_hash
  end

  def to_json
    as_json.to_json
  end
end
