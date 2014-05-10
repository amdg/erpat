class LocationalClearance < ActiveRecord::Base
  enum status: [:queued, :inspected, :approved, :rejected]
  scope :queued, -> { where(status: :queued) }

  def as_json(opts={})
    json = super(opts)
    Hash[*json.map{|k, v| [k, v || ""]}.flatten]
  end
end
