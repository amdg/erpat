class AddMoreFieldsToLocationalClearances < ActiveRecord::Migration
  def change
    add_column :locational_clearances, :street_address, :string
    add_column :locational_clearances, :land_use, :string
    add_column :locational_clearances, :contact_number, :string
    add_column :locational_clearances, :full_name, :string
    add_column :locational_clearances, :lat, :float
    add_column :locational_clearances, :long, :float
  end
end
