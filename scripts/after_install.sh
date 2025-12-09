#!/bin/bash
# After Install Script
# Configuración después de copiar archivos

echo "=== Post-installation configuration ==="

# Establecer permisos finales
echo "Setting final permissions..."
chown -R ubuntu:ubuntu /var/www/gt-turing-backend
chown -R ubuntu:ubuntu /var/www/proyectosintegrados-Juanjotg65/gt-turing
chmod -R 755 /var/www/gt-turing-backend
chmod -R 755 /var/www/proyectosintegrados-Juanjotg65/gt-turing

# Asegurar que la base de datos tenga permisos correctos
if [ -f "/var/www/gt-turing-backend/gt_turing.db" ]; then
    echo "Setting database permissions..."
    chown ubuntu:ubuntu /var/www/gt-turing-backend/gt_turing.db
    chmod 644 /var/www/gt-turing-backend/gt_turing.db
fi

# Instalar/actualizar dependencias de Node.js si es necesario
echo "Checking Node.js dependencies..."
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
if [ -f "package.json" ]; then
    echo "Installing/updating Node.js dependencies..."
    sudo -u ubuntu npm install --production
fi

# Verificar que los archivos críticos existen
echo "Verifying backend deployment..."
if [ ! -f "/var/www/gt-turing-backend/gt-turing-backend.dll" ]; then
    echo "ERROR: Backend DLL not found!"
    exit 1
fi

echo "Verifying frontend deployment..."
if [ ! -d "/var/www/proyectosintegrados-Juanjotg65/gt-turing/.next" ]; then
    echo "ERROR: Frontend .next directory not found!"
    exit 1
fi

echo "=== Post-installation complete ==="
exit 0
