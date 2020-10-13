module SearchQuery
  class Context
    # @return [Arel::Table]
    def table
      raise NotImplementedError
    end

    # @return [Symbol]
    def text_column
      raise NotImplementedError
    end

    # @return [Hash<Symbol, (String) => AttributeCondition>]
    def attrs
      raise NotImplementedError
    end

    def on_to_arel(store)
      # You may override
    end

    class AttributeCondition
      attr_reader :context
      attr_reader :store
      attr_reader :value

      def initialize(context, store, value)
        @context = context
        @store = store
        @value = value
      end

      def for_arel
        raise NotImplementedError
      end
    end
  end
end
