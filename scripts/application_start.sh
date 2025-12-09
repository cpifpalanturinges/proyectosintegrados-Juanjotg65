#!/bin/bash
# Application Start Script
# Inicia los servicios después del despliegue

echo "=== Starting GT-TURING Services ==="

# Iniciar nginx primero
echo "Starting nginx..."
systemctl start nginx
systemctl enable nginx

# Esperar a que nginx esté listo
sleep 2

# Iniciar backend
echo "Starting backend service..."
systemctl start gt-turing-backend
systemctl enable gt-turing-backend

# Esperar a que el backend inicie
sleep 5

# Verificar estado del backend
if systemctl is-active --quiet gt-turing-backend; then
    echo "✓ Backend started successfully"
else
    echo "✗ Backend failed to start"
    systemctl status gt-turing-backend
    exit 1
fi

# Iniciar frontend
echo "Starting frontend service..."
systemctl start gt-turing-frontend
systemctl enable gt-turing-frontend

# Esperar a que el frontend inicie
sleep 5

# Verificar estado del frontend
if systemctl is-active --quiet gt-turing-frontend; then
    echo "✓ Frontend started successfully"
else
    echo "✗ Frontend failed to start"
    systemctl status gt-turing-frontend
    exit 1
fi

# Verificar estado de nginx
if systemctl is-active --quiet nginx; then
    echo "✓ Nginx running successfully"
else
    echo "✗ Nginx failed to start"
    exit 1
fi

echo "=== All services started successfully ==="
echo "Backend status:"
systemctl status gt-turing-backend --no-pager
echo ""
echo "Frontend status:"
systemctl status gt-turing-frontend --no-pager
echo ""
echo "Nginx status:"
systemctl status nginx --no-pager

exit 0
