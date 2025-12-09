#!/bin/bash

# Ensure storage directories exist with correct permissions
mkdir -p /var/www/storage/framework/{sessions,views,cache}
mkdir -p /var/www/storage/logs
mkdir -p /var/www/bootstrap/cache

# Set correct permissions
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Run migrations
php artisan migrate --force

# Clear and cache configuration
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Get PORT from Railway (they provide this)
PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Update nginx configuration - replace BOTH listen directives
sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/conf.d/default.conf
sed -i "s/listen \[::]:8080/listen [::]:$PORT/g" /etc/nginx/conf.d/default.conf

# Show the updated config for debugging
echo "Nginx config after PORT substitution:"
grep "listen" /etc/nginx/conf.d/default.conf

# Test nginx configuration
nginx -t

# Start PHP-FPM in background
php-fpm -D

# Start Nginx in foreground
nginx -g 'daemon off;'
