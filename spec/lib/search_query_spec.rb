require 'rails_helper'
require 'search_query'

RSpec.describe SearchQuery do
  describe SearchQuery::Parser do
    describe '#parse(query)' do
      let(:context_clazz) {
        Class.new(SearchQuery::Context) do
          def attrs
            {
              attr: ->(context, store, value) {
                attr_clazz = Class.new(SearchQuery::Context::AttributeCondition) do
                  def self.name
                    'AttrCondition'
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

      context 'a OR (b -(c OR -attr:value))' do
        let(:query) { self.class.description }
        let(:parsed) {{
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
        }}
        it { is_expected.to eq parsed }
      end
    end
  end
end
