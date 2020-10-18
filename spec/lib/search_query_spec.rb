require 'rails_helper'
require 'search_query'

RSpec.describe SearchQuery do
  let(:context_clazz) {
    Class.new(SearchQuery::Context) do
      def table
        Arel::Table.new(:resources)
      end

      def text_column
        :text
      end

      def attrs
        {
          attr: ->(context, store, value) {
            attr_clazz = Class.new(SearchQuery::Context::AttributeCondition) do
              def self.name
                'AttrCondition'
              end

              def for_arel
                context.table[:attr].eq(value)
              end
            end
            attr_clazz.new(context, store, value)
          },
        }
      end
    end
  }
  let(:parser) { SearchQuery::Parser.new(context_clazz.new) }
  subject { parser.parse(query).to_h }

  query = 'a OR (b -(c OR -attr:value))'
  context query.inspect do
    q = query.dup
    let(:query) { q }
    it {
      is_expected.to eq({
        root: {
          or: [
            { word: 'a' },
            { group: {
              and: [
                { word: 'b' },
                { not: { group: {
                  or: [
                    { word: 'c' },
                    { not: { attr: {
                      name: :attr,
                      value: 'value',
                      class_name: 'AttrCondition',
                    } } },
                  ]
                } } }
              ]
            } }
          ]
        }
      })
    }
  end
end
