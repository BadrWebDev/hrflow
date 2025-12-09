#!/usr/bin/env bash
# Render build script

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Generating application key if needed..."
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Build completed successfully!"
