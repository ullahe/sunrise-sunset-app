class AddIndexToSunData < ActiveRecord::Migration[7.2]
  def change
    add_index :sun_data, [:location, :date], unique: true
  end
end
