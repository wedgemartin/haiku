source "http://rubygems.org"
git_source(:github) { |repo| "http://github.com/#{repo}.git" }

ruby "3.3.6"

gem "rails", "~> 7.1.4.1"

gem 'mongoid'
gem "puma", "~> 5.0"

# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails"

gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem 'factory_bot_rails'
  gem 'rspec-rails'
  gem 'rails-controller-testing'
end
