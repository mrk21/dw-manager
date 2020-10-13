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
    attr_reader :store
    attr_reader :parent
    attr_reader :children

    # @param context [SearchQuery::Context]
    def initialize(context)
      @context = context
    end

    def to_arel
      raise NotImplementedError
    end

    def init(parent: nil)
      @parent = parent
      @store = parent ? parent.store : {}
      children.each do |child|
        child.init(parent: self)
      end
    end
  end

  class Root < Node
    def initialize(context, node)
      super(context)
      @node = node
      @children = [@node]
      init
    end

    def to_arel
      context.on_to_arel(store)
      @node.to_arel
    end
  end

  class BinaryOP < Node
    def initialize(context, lop, rop)
      super(context)
      @lop = lop
      @rop = rop
      @children = [@lop, @rop]
    end
  end

  class UnaryOP < Node
    def initialize(context, op)
      super(context)
      @op = op
      @children = [@op]
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
      @children = [@node]
    end

    def to_arel
      Arel::Nodes::Grouping.new(@node.to_arel)
    end
  end

  class Word < Node
    def initialize(context, value)
      super(context)
      @value = value
      @children = []
    end

    def to_arel
      context.table[context.text_column].matches("%#{@value}%")
    end
  end

  class Attribute < Node
    def initialize(context, attr, value)
      super(context)
      @attr = attr.to_sym
      @value = value
      @children = []
    end

    def init(parent: nil)
      super
      store[@attr] ||= { values: [] }
      store[@attr][:values].push(@value)
      @condition = context.attrs[@attr][context, store, @value]
    end

    def to_arel
      Arel::Nodes::Grouping.new(@condition.for_arel)
    end
  end
end
