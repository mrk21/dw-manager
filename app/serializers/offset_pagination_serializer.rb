class OffsetPaginationSerializer < SimpleSerializer
  # @param records [ActiveRecord::Relation]
  def initialize(records)
    super({
      type: 'offset',
      data: {
        total: records.total_pages,
        current: records.current_page,
        next: records.next_page,
        prev: records.prev_page,
        is_first: records.first_page?,
        is_last: records.last_page?,
      }
    })
  end
end
