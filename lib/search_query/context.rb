module SearchQuery
  class Context
    attr_reader :table
    attr_reader :text_column

    # @param table [Arel::Table]
    # @param text_column [String | Symbol]
    def initialize(table:, text_column:)
      @table = table
      @text_column = text_column
    end
  end
end
