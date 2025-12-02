# Script para resetear la base de datos GT-TURING
Write-Host "=== Reseteando Base de Datos GT-TURING ===" -ForegroundColor Cyan

# Detener procesos del backend
Write-Host "`nDeteniendo procesos del backend..." -ForegroundColor Yellow
Get-Process -Name "gt-turing-backend" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "Procesos detenidos." -ForegroundColor Green

# Cambiar al directorio del proyecto backend
Set-Location "c:\Users\Juanjo\Desktop\proyectosintegrados-Juanjotg65\gt-turing-backend\gt-turing-backend"

# Borrar la base de datos si existe
$dbPath = "gt_turing.db"
if (Test-Path $dbPath) {
    Write-Host "`nBorrando base de datos existente..." -ForegroundColor Yellow
    Remove-Item $dbPath -Force
    Write-Host "Base de datos borrada." -ForegroundColor Green
} else {
    Write-Host "`nNo se encontró base de datos anterior." -ForegroundColor Gray
}

# Borrar archivos de migración antiguos si existen
$migrationsPath = "Migrations"
if (Test-Path $migrationsPath) {
    Write-Host "`nBorrando migraciones antiguas..." -ForegroundColor Yellow
    Remove-Item $migrationsPath -Recurse -Force
    Write-Host "Migraciones borradas." -ForegroundColor Green
}

# Crear nueva migración
Write-Host "`nCreando nueva migración..." -ForegroundColor Cyan
dotnet ef migrations add InitialCreate

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nError al crear migración. Abortando..." -ForegroundColor Red
    exit 1
}

# Aplicar migración
Write-Host "`nAplicando migración y creando base de datos..." -ForegroundColor Cyan
dotnet ef database update

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nError al aplicar migración. Abortando..." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Base de datos reseteada exitosamente ===" -ForegroundColor Green
Write-Host "La base de datos se poblará automáticamente al iniciar la aplicación." -ForegroundColor Gray
Write-Host "`nPuedes iniciar el backend con: dotnet run" -ForegroundColor Cyan
