class AddInspectorNoteToLocationalClearance < ActiveRecord::Migration
  def change
    add_column :locational_clearances, :inspector_note, :string
  end
end
