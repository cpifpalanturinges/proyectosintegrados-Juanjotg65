# Script para limpiar y reiniciar el frontend de GT-TURING

Write-Host "🧹 Limpiando archivos de Next.js..." -ForegroundColor Cyan

# Detener cualquier proceso de Node.js que pueda estar bloqueando archivos
Write-Host "Deteniendo procesos de Node.js..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Esperar un momento para que se liberen los archivos
Start-Sleep -Seconds 2

# Eliminar la carpeta .next si existe
if (Test-Path ".next") {
    Write-Host "Eliminando carpeta .next..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Eliminar node_modules/.cache si existe
if (Test-Path "node_modules/.cache") {
    Write-Host "Limpiando cache de node_modules..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "✅ Limpieza completada" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Iniciando Next.js en modo desarrollo..." -ForegroundColor Cyan
Write-Host ""

# Iniciar Next.js
npm run dev
