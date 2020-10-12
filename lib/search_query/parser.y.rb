class SearchQuery::Parser
rule
  start conditions

  conditions : condition
             | condition conditions           { result = AST::AND.new(@context, val[0], val[1]) }
             | condition binary_op conditions { result = AST.binary_op(val[1]).new(@context, val[0], val[2]) }
             ;

  binary_op : AND
            | OR
            ;

  unary_op : '-'
           ;

  condition : condition_value
            | unary_op condition_value { result = AST.unary_op(val[0]).new(@context, val[1]) }
            ;

  condition_value : word
                  | group
                  ;

  word : word_value { result = AST::Word.new(@context, val[0]) }
       ;

  word_value : WORD
             | QUATED_WORD
             ;

  group : '(' conditions ')' { result = AST::Group.new(@context, val[1]) }
        ;
end

---- header

require 'strscan'
require 'pp'

---- inner

# @param context [SearchQuery::Context]
def initialize(context)
  @context = context
end

def parse(str)
  scanner = StringScanner.new(str)
  @tokens = []
  until scanner.eos?
    case
    when scanner.scan(/"[^"]+"/)
      @tokens << [:QUATED_WORD, scanner.matched[1..-2]]

    when scanner.scan(/'[^']+'/)
      @tokens << [:QUATED_WORD, scanner.matched[1..-2]]

    when scanner.scan(/-/)
      @tokens << [scanner.matched, scanner.matched]
      while scanner.scan(/-/); end # ignore

    when scanner.scan(/\s(AND|OR)(?=\s)/)
      matched = scanner.matched[1..-1]
      @tokens << [matched.to_sym, matched]
      while scanner.scan(/\s(AND|OR)(?=\s)/); end # ignore

    when scanner.scan(/[\(|\)]/)
      @tokens << [scanner.matched, scanner.matched]

    when scanner.scan(/[^\s"()-]+/)
      @tokens << [:WORD, scanner.matched]

    when scanner.scan(/./)
      # ignore
    end
  end
  Rails.logger.debug @tokens.pretty_inspect
  do_parse
end

def next_token
  @tokens.shift
end
