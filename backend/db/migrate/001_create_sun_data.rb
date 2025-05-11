class CreateSunData < ActiveRecord::Migration[7.1]
    def change
      create_table :sun_data do |t|
        t.string :location
        t.date :date
        t.string :sunrise
        t.string :sunset
        t.string :golden_hour
        t.float :lat
        t.float :lng
  
        t.timestamps
      end
    end
  end