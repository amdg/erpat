class CreateLocationalClearances < ActiveRecord::Migration
  def change
    create_table :locational_clearances do |t|
      t.string :first_name
      t.string :last_name
      t.string :mobile
      t.string :address
      t.string :coordinates
      t.timestamps
    end
  end
end
