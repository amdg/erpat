class RemoveMobileFromLocationalClearance < ActiveRecord::Migration
  def change
    remove_column :locational_clearances, :first_name, :string
    remove_column :locational_clearances, :last_name, :string
    remove_column :locational_clearances, :street_address, :string
    remove_column :locational_clearances, :coordinates, :string
    remove_column :locational_clearances, :mobile, :string
  end
end
