require_relative "../app"

SunData.all.each do |entry|
  puts "#{entry.date} – #{entry.location}: Sunrise: #{entry.sunrise}, Sunset: #{entry.sunset}, Golden Hour: #{entry.golden_hour}"
end