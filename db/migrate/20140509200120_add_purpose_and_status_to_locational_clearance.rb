class AddPurposeAndStatusToLocationalClearance < ActiveRecord::Migration
  def change
    add_column :locational_clearances, :purpose, :string
    add_column :locational_clearances, :status, :integer, default: 0
  end
end
