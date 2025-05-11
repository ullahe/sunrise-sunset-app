require "httparty"

class SunFetcher
  def initialize(location, start_date, end_date)
    @location = location
    @start_date = start_date
    @end_date = end_date
  end

  def fetch!
    # Get lat/lng coordinates from location using Geocoder
    coordinates = fetch_coordinates
    raise ArgumentError, "Location must be a valid city or town" unless coordinates

    lat, lng = coordinates
    dates = (@start_date..@end_date).to_a

    # Retrieve existing records from the database to avoid duplicate API calls
    existing_records = SunData.where(location: @location, date: dates).index_by(&:date)
    missing_dates = dates - existing_records.keys

    final_results = existing_records.values.map do |entry|
      {
        lat: entry.lat,
        lng: entry.lng,
        date: entry.date,
        sunrise: entry.sunrise,
        sunset: entry.sunset,
        golden_hour: entry.golden_hour
      }
    end

    new_entries = []

    missing_dates.each do |date|
      begin
        # API request for sunrise/sunset data for missing dates
        response = HTTParty.get("https://api.sunrisesunset.io/json", query: {
          lat: lat,
          lng: lng,
          date: date.to_s,
          formatted: 0
        })

        unless response.success?
          puts "API error for #{@location} on #{date}"
          final_results << build_na_entry(date, lat, lng)
          next
        end

        sun = response["results"]

        if sun.nil? || sun["sunrise"].to_s.strip.empty? || sun["sunset"].to_s.strip.empty?
          puts "Incomplete or empty data for #{@location} on #{date}"
          final_results << build_na_entry(date, lat, lng)
          next
        end

        new_entries << {
          location: @location, lat: lat, lng: lng, date: date,
          sunrise: sun["sunrise"],
          sunset: sun["sunset"],
          golden_hour: sun["golden_hour"],
          created_at: Time.now,
          updated_at: Time.now
        }

        final_results << {
          lat: lat, lng: lng, date: date,
          sunrise: sun["sunrise"],
          sunset: sun["sunset"],
          golden_hour: sun["golden_hour"]
        }

      rescue => e
        # TODO: Replace with proper logging
        puts "Error in asking for the #{date}: #{e.message}"
        final_results << build_na_entry(date, lat, lng)
        next
      end
    end

    # Save newly fetched records to database (bulk insert, avoids duplicates)
    SunData.insert_all(new_entries, unique_by: %i[location date]) if new_entries.any?

    final_results.sort_by { |entry| entry[:date] }
  end

  private

  def build_na_entry(date, lat, lng)
    {
      lat: lat,
      lng: lng,
      date: date,
      sunrise: "N/A",
      sunset: "N/A",
      golden_hour: "N/A"
    }
  end

  def fetch_coordinates
    result = Geocoder.search(@location).first
    raise ArgumentError, "Location must be a valid city or town" if result.nil? || result.coordinates.nil?

    result.coordinates
  end
end
