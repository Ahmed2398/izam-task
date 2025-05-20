#!/bin/bash

# Copy Heroku environment file
cp .env.heroku .env

# Generate application key
php artisan key:generate --force

# Run database migrations
php artisan migrate --force

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "Heroku post-deploy setup completed!"
