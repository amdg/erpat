class AddLandUseToLocationalClearance < ActiveRecord::Migration
  def change
    add_column :locational_clearances, :land_use, :string
  end
end
