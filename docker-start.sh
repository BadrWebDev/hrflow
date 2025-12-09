#!/bin/bash

# Run migrations
php artisan migrate --force

# Cache configuration
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
