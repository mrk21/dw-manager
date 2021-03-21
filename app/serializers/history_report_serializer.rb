class HistoryReportSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  def self.from_report(user:, condition:, data:)
    new(
      data.map { |d|
        OpenStruct.new(
          id: Digest::MD5.hexdigest({
            user: user.id,
            condition: condition,
            period: d.period,
          }.to_json),
          period: d.period,
          period_type: d.period_type,
          pamount: d.pamount,
          namount: d.namount,
          amount: d.amount,
        )
      }
    )
  end

  attribute :period
  attribute :period_type
  attribute :pamount
  attribute :namount
  attribute :amount
end
