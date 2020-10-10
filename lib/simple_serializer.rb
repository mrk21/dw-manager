class SimpleSerializer
  def initialize(obj)
    @obj = obj
  end

  def serializable_hash
    @obj.as_json.deep_transform_keys { |k| k.to_s.camelize(:lower).to_sym }
  end

  def as_json(options = nil)
    serializable_hash.as_json(options)
  end

  def to_json
    as_json.to_json
  end
end
