class SearchQuery::Parser
rule
  start root

  root : conditions { result = AST::Root.new(@context, val[0]) }
       ;

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
                  | attribute
                  ;

  word : word_value { result = AST::Word.new(@context, val[0]) }
       ;

  word_value : WORD
             | QUATED_WORD
             ;

  attribute : ATTR_NAME ':' ATTR_VALUE { result = AST::Attribute.new(@context, val[0], val[2]) }
            ;

  group : '(' conditions ')' { result = AST::Group.new(@context, val[1]) }
        ;
end

---- header

require 'strscan'

---- inner

# @param context [SearchQuery::Context]
def initialize(context)
  @context = context
end

def parse(str)
  scanner = StringScanner.new(str)
  @q = []
  attrs = @context.attrs.keys
  until scanner.eos?
    case
    when scanner.scan(/"[^"]+"/)
      @q << [:QUATED_WORD, scanner.matched[1..-2]]

    when scanner.scan(/'[^']+'/)
      @q << [:QUATED_WORD, scanner.matched[1..-2]]

    when attrs.present? && scanner.scan(%r`(?<=\s|　|^)?(#{attrs.join('|')}):[^\s　]+(?=\s|　|$)?`)
      attr, value = scanner.matched.split(':', 2)
      @q << [:ATTR_NAME, attr]
      @q << [':', ':']
      @q << [:ATTR_VALUE, value]

    when scanner.scan(/(?<=\s|　|^)-(?=[^\s　$])/)
      @q << [scanner.matched, scanner.matched]
      while scanner.scan(/-/); end # ignore

    when scanner.scan(/(?<=\s|　|^)(AND|OR)(?=\s|　|$)/)
      matched = scanner.matched[1..-1]
      @q << [matched.to_sym, matched]
      while scanner.scan(/(?<=\s|　|^)(AND|OR)(?=\s|　|$)/); end # ignore

    when scanner.scan(/[\(|\)]/)
      @q << [scanner.matched, scanner.matched]

    when scanner.scan(/[^\s　"()-]+/)
      @q << [:WORD, scanner.matched]

    when scanner.scan(/./)
      # ignore
    end
  end
  Rails.logger.debug @q.inspect
  do_parse
end

def next_token
  @q.shift
end
