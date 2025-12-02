# 🔧 Guía de Desarrollo Local - GT-TURING

## Requisitos
- Node.js 20 o superior
- .NET 8 SDK
- Git

## Configuración Inicial

### 1. Clonar el Repositorio
```bash
git clone <tu-repo>
cd proyectosintegrados-Juanjotg65
```

### 2. Configurar Frontend

```bash
cd gt-turing
npm install
```

**Verificar archivo `.env.local`:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5021
```

### 3. Configurar Backend

```bash
cd gt-turing-backend/gt-turing-backend
dotnet restore
```

**Verificar archivo `appsettings.json`** - Ya configurado correctamente:
- Base de datos SQLite: `gt_turing.db`
- CORS para localhost:3000
- JWT configurado

## Ejecutar en Desarrollo

### Terminal 1 - Backend (.NET)
```bash
cd gt-turing-backend/gt-turing-backend
dotnet run
```
**Resultado esperado:**
- Backend corriendo en `http://localhost:5021`
- Swagger disponible en `http://localhost:5021/swagger`

### Terminal 2 - Frontend (Next.js)
```bash
cd gt-turing
npm run dev
```
**Resultado esperado:**
- Frontend corriendo en `http://localhost:3000`

## Verificar Funcionamiento

### 1. Abrir el navegador
```
http://localhost:3000
```

### 2. Probar funcionalidades
- [ ] Página de inicio carga correctamente
- [ ] Login/Register funcionan
- [ ] Ver coches disponibles
- [ ] Ver circuitos
- [ ] Chat funciona (requiere login)
- [ ] Crear reserva (requiere login)

### 3. Verificar API
```
http://localhost:5021/swagger
```

## Solución de Problemas

### Frontend no conecta con Backend

**Error:** `Failed to fetch` o `Network Error`

**Solución:**
1. Verificar que el backend esté corriendo en puerto 5021
2. Verificar `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5021
   ```
3. Reiniciar el servidor Next.js: Ctrl+C y `npm run dev`

### CORS Error

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solución:**
1. Verificar `appsettings.json` tiene:
   ```json
   "Cors": {
     "AllowedOrigins": [
       "http://localhost:3000",
       "https://localhost:3000"
     ]
   }
   ```
2. Reiniciar el backend: Ctrl+C y `dotnet run`

### Puerto 5021 ya en uso

**Solución Windows:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :5021

# Matar el proceso (reemplaza PID)
taskkill /PID <número_del_proceso> /F
```

### Base de datos no se crea

**Solución:**
```bash
cd gt-turing-backend/gt-turing-backend
# Eliminar la DB existente
del gt_turing.db
# Volver a ejecutar
dotnet run
# La DB se creará automáticamente con datos de ejemplo
```

## Compilar para Producción

### Frontend
```bash
cd gt-turing
npm run build
npm start  # Probar build de producción localmente
```

### Backend
```bash
cd gt-turing-backend/gt-turing-backend
dotnet publish -c Release -o ./publish
```

## Estructura de URLs

### Desarrollo Local
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5021
- **Swagger:** http://localhost:5021/swagger

### Producción (después de desplegar)
- **Frontend:** http://TU_IP_AWS:3000
- **Backend API:** http://TU_IP_AWS:5021
- **Con HTTPS:** https://TU_IP_AWS

## Comandos Útiles

### Frontend
```bash
npm run dev          # Modo desarrollo
npm run build        # Compilar producción
npm start            # Ejecutar build de producción
npm run lint         # Verificar código
```

### Backend
```bash
dotnet run                        # Ejecutar en desarrollo
dotnet build                      # Compilar
dotnet publish -c Release         # Compilar para producción
dotnet ef migrations add <nombre> # Crear migración (si usas EF)
```

## Variables de Entorno

### `.env.local` (Frontend - Local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5021
```

### `.env.production` (Frontend - AWS)
```bash
NEXT_PUBLIC_API_URL=http://TU_IP_AWS:5021
```

### `appsettings.json` (Backend - Local)
- SQLite: `gt_turing.db`
- CORS: localhost:3000

### `appsettings.Production.json` (Backend - AWS)
- SQLite: `/var/www/gt-turing-backend/gt_turing.db`
- CORS: IP de AWS

## Tips de Desarrollo

### Hot Reload
- **Frontend:** Cambios se reflejan automáticamente
- **Backend:** Necesitas reiniciar con Ctrl+C y `dotnet run`

### Ver logs
- **Frontend:** En la consola donde ejecutas `npm run dev`
- **Backend:** En la consola donde ejecutas `dotnet run`

### Debugging
- **Frontend:** Usar DevTools del navegador (F12)
- **Backend:** Visual Studio Code con extensión C# o Visual Studio

## Usuarios de Prueba

Después de ejecutar el backend por primera vez, se crean usuarios de prueba:

### Usuario Admin
- **Email:** admin@gtturing.com
- **Password:** Admin123!

### Usuario Normal
- **Email:** user@gtturing.com
- **Password:** User123!

## Próximos Pasos

1. ✅ Verificar que todo funciona en local
2. ✅ Hacer commit de tus cambios
3. ✅ Seguir la guía `DESPLIEGUE_AWS.md` para producción
