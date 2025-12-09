#!/bin/bash

# Run migrations
php artisan migrate --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update nginx to use Railway's PORT (default 8080)
PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Update nginx configuration in conf.d
sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/conf.d/default.conf

# Test nginx configuration
nginx -t

# Start PHP-FPM in background
php-fpm -D

# Start Nginx in foreground
nginx -g 'daemon off;'
