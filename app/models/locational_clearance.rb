class LocationalClearance < ActiveRecord::Base
  validates :first_name, :last_name, :address, presence: true
  enum status: [:queued, :inspected, :approved, :rejected]
end
