class LocationalClearance < ActiveRecord::Base
  enum status: [:queued, :inspected, :approved, :rejected]
end
