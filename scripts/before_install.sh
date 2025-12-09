#!/bin/bash
# Before Install Script
# Preparación antes de la instalación

echo "=== Preparing for GT-TURING deployment ==="

# Crear directorios si no existen
echo "Creating directories..."
mkdir -p /var/www/gt-turing-backend
mkdir -p /var/www/proyectosintegrados-Juanjotg65/gt-turing/.next
mkdir -p /var/www/proyectosintegrados-Juanjotg65/gt-turing/node_modules

# Establecer permisos
echo "Setting permissions..."
chown -R ubuntu:ubuntu /var/www/gt-turing-backend
chown -R ubuntu:ubuntu /var/www/proyectosintegrados-Juanjotg65/gt-turing

# Limpiar archivos antiguos del backend (excepto la base de datos)
echo "Cleaning old backend files..."
cd /var/www/gt-turing-backend
find . -type f ! -name 'gt_turing.db' ! -name '*.db-shm' ! -name '*.db-wal' -delete 2>/dev/null || true

# Limpiar .next anterior del frontend
echo "Cleaning old frontend build..."
rm -rf /var/www/proyectosintegrados-Juanjotg65/gt-turing/.next/* 2>/dev/null || true

echo "=== Preparation complete ==="
exit 0
