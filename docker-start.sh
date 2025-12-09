#!/bin/bash
set -e  # Exit on any error

echo "=== Starting HRFlow Application ==="

# Ensure storage directories exist with correct permissions
echo "Creating storage directories..."
mkdir -p /var/www/storage/framework/{sessions,views,cache}
mkdir -p /var/www/storage/logs
mkdir -p /var/www/bootstrap/cache

# Set correct permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Clear and cache configuration
echo "Caching configuration..."
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Get PORT from Railway
PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Update nginx configuration
echo "Updating nginx configuration..."
sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/conf.d/default.conf
sed -i "s/listen \[::]:8080/listen [::]:$PORT/g" /etc/nginx/conf.d/default.conf

echo "Nginx listen directives:"
grep "listen" /etc/nginx/conf.d/default.conf

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Start PHP-FPM
echo "Starting PHP-FPM..."
php-fpm -D

# Give PHP-FPM time to start
sleep 2

# Check if PHP-FPM is running
if ! pgrep -x php-fpm > /dev/null; then
    echo "ERROR: PHP-FPM failed to start!"
    exit 1
fi

echo "PHP-FPM started successfully"

# Start Nginx in foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'
