require "sinatra"
require "sinatra/activerecord"
require "json"
require "date"
require "geocoder"
require_relative "./services/sun_fetcher"

# Sinatra configuration
set :bind, '0.0.0.0'              # Accept connections from all network interfaces
set :port, 4567                   # Use port 4567 by default
set :host_authorization, false    # Disable host checking (use with caution)
disable :protection               # Disable built-in security (use with caution in production)

# Set CORS headers for all responses
before do
  response.headers['Access-Control-Allow-Origin'] = '*'
end
# Handle CORS preflight requests
options '*' do
  response.headers['Access-Control-Allow-Origin'] = '*'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
  200
end

# Define ActiveRecord model for storing sunrise/sunset data
class SunData < ActiveRecord::Base; end

# API endpoint: /api/sun
# Returns sunrise/sunset data for a given location and date range
get "/api/sun" do
  puts "API wurde aufgerufen"
  content_type :json

  location = params[:location]&.strip
  start_date = params[:start] ? Date.parse(params[:start]) : Date.today
  end_date = params[:end] ? Date.parse(params[:end]) : start_date + 3

  # Validate input parameters
  halt 400, { error: "Missing location" }.to_json unless location
  halt 400, { error: "Only city or town names allowed" }.to_json unless location.match?(/\A[a-zA-Z\s\-]+\z/)

  begin
    # Fetch sunrise/sunset data using service class
    results = SunFetcher.new(location, start_date, end_date).fetch!
    results.to_json
  rescue ArgumentError => e
    halt 400, { error: e.message }.to_json
  rescue => e
    halt 502, { error: e.message }.to_json
  end
end

# Handle specific error when a variable is not defined
error NameError do
  content_type :json
  status 500
  { error: "The specified location could not be found: #{env['sinatra.error'].message}" }.to_json
end

# Catch-all error handler for unexpected failures
error do
  content_type :json
  status 500
  err = env['sinatra.error']
  puts "Error: #{err.class} – #{err.message}"
  puts err.backtrace.join("\n")
  { error: "Unexpected error: #{err.class} - #{err.message}" }.to_json
end