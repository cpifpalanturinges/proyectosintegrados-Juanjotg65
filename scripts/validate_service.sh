#!/bin/bash
# Validate Service Script
# Verifica que la aplicación esté funcionando correctamente

echo "=== Validating GT-TURING Deployment ==="

# Función para verificar si un servicio responde
check_endpoint() {
    local url=$1
    local name=$2
    local max_attempts=10
    local attempt=1
    
    echo "Checking $name at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
            echo "✓ $name is responding"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts failed, waiting..."
        sleep 3
        ((attempt++))
    done
    
    echo "✗ $name failed to respond after $max_attempts attempts"
    return 1
}

# Verificar backend API
if ! check_endpoint "http://localhost:5021/api/cars" "Backend API"; then
    echo "Backend validation failed"
    exit 1
fi

# Verificar frontend
if ! check_endpoint "http://localhost:3000" "Frontend"; then
    echo "Frontend validation failed"
    exit 1
fi

# Verificar nginx
if ! check_endpoint "http://localhost" "Nginx"; then
    echo "Nginx validation failed"
    exit 1
fi

# Verificar que los procesos estén corriendo
echo "Checking running processes..."

if ! pgrep -f "gt-turing-backend.dll" > /dev/null; then
    echo "✗ Backend process not found"
    exit 1
fi
echo "✓ Backend process running"

if ! pgrep -f "node.*next.*start" > /dev/null; then
    echo "✗ Frontend process not found"
    exit 1
fi
echo "✓ Frontend process running"

if ! pgrep -f "nginx" > /dev/null; then
    echo "✗ Nginx process not found"
    exit 1
fi
echo "✓ Nginx process running"

echo "=== All validations passed successfully ==="
exit 0
