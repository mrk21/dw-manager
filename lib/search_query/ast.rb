module SearchQuery::AST
  def self.binary_op(val)
    {
      'AND' => AND,
      'OR' =>  OR,
    }
    .fetch(val)
  end

  def self.unary_op(val)
    {
      '-' => NOT,
    }
    .fetch(val)
  end

  class Node
    attr_reader :context

    # @param context [SearchQuery::Context]
    def initialize(context)
      @context = context
    end

    def to_arel
      raise NotImplementedError
    end
  end

  class BinaryOP < Node
    def initialize(context, lop, rop)
      super(context)
      @lop = lop
      @rop = rop
    end
  end

  class UnaryOP < Node
    def initialize(context, op)
      super(context)
      @op = op
    end
  end

  class AND < BinaryOP
    def to_arel
      @lop.to_arel.and @rop.to_arel
    end
  end

  class OR < BinaryOP
    def to_arel
      @lop.to_arel.or @rop.to_arel
    end
  end

  class NOT < UnaryOP
    def to_arel
      @op.to_arel.not
    end
  end

  class Group < Node
    def initialize(context, node)
      super(context)
      @node = node
    end

    def to_arel
      @node.to_arel
    end
  end

  class Word < Node
    def initialize(context, value)
      super(context)
      @value = value
    end

    def to_arel
      context.table[context.text_column].matches("%#{@value}%")
    end
  end
end
