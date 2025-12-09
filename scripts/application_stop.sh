#!/bin/bash
# Application Stop Script
# Detiene los servicios antes del despliegue

echo "=== Stopping GT-TURING Services ==="

# Detener backend
if systemctl is-active --quiet gt-turing-backend; then
    echo "Stopping backend service..."
    systemctl stop gt-turing-backend
    echo "Backend stopped."
else
    echo "Backend service not running."
fi

# Detener frontend
if systemctl is-active --quiet gt-turing-frontend; then
    echo "Stopping frontend service..."
    systemctl stop gt-turing-frontend
    echo "Frontend stopped."
else
    echo "Frontend service not running."
fi

# Detener nginx si es necesario
if systemctl is-active --quiet nginx; then
    echo "Stopping nginx..."
    systemctl stop nginx
    echo "Nginx stopped."
fi

echo "=== Services stopped successfully ==="
exit 0
