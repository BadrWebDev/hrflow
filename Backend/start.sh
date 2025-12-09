#!/usr/bin/env bash
# Render start script

echo "Running migrations..."
php artisan migrate --force

echo "Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
