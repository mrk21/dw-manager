require 'csv'

class Importer
  def initialize(user)
    @user = user
  end

  # CSV headers: "計算対象","日付","内容","金額（円）","保有金融機関","大項目","中項目","メモ","振替","ID"
  def import(path)
    csv = CSV.read(path, headers: true, return_headers: false, encoding: "Shift_JIS:UTF-8")
    data = csv.to_a[1..-1].map do |d|
      {
        id: d[9],
        user_id: @user.id,
        date: Date.parse(d[1]),
        title: d[2],
        amount: d[3].to_i,
        institution: d[4],
        is_transfer: d[8].to_i == 1,
        data: {
          is_calculatable: d[0].to_i == 1,
          major_category: d[5],
          minor_category: d[6],
          memo: d[7],
        }
      }
    end
    History.import data
  end
end
