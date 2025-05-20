#!/bin/bash

# Exit on error
set -e

# Copy environment file
echo "Setting up environment..."
cp netlify.env .env

# Install PHP dependencies
echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

# Generate application key
echo "Generating application key..."
php artisan key:generate

# Install JS dependencies
echo "Installing NPM dependencies..."
npm ci

# Build frontend assets
echo "Building frontend assets..."
npm run build

# Create a Netlify _redirects file
echo "Creating Netlify redirects..."
cat > public/_redirects << EOL
# Handle SPA routing
/* /index.html 200
EOL

echo "Build completed successfully!"
