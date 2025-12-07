# 🚀 GUÍA PASO A PASO DESPLIEGUE AWS - GT-TURING
### Guía Completa con Capturas y Explicaciones Detalladas

---

## 📋 TABLA DE CONTENIDOS

1. [Preparación Previa](#1-preparación-previa)
2. [Crear Cuenta AWS](#2-crear-cuenta-aws)
3. [Configurar Security Group](#3-configurar-security-group)
4. [Crear Instancia EC2](#4-crear-instancia-ec2)
5. [Asignar IP Elástica](#5-asignar-ip-elástica)
6. [Conectar por SSH](#6-conectar-por-ssh)
7. [Configurar el Servidor](#7-configurar-el-servidor)
8. [Instalar Dependencias](#8-instalar-dependencias)
9. [Clonar el Proyecto](#9-clonar-el-proyecto)
10. [Configurar Variables de Entorno](#10-configurar-variables-de-entorno)
11. [Desplegar Backend .NET](#11-desplegar-backend-net)
12. [Desplegar Frontend Next.js](#12-desplegar-frontend-nextjs)
13. [Configurar Nginx](#13-configurar-nginx)
14. [Configurar HTTPS](#14-configurar-https)
15. [Verificar Funcionamiento](#15-verificar-funcionamiento)
16. [Mantenimiento y Actualizaciones](#16-mantenimiento-y-actualizaciones)

---

## 1. PREPARACIÓN PREVIA

### ✅ Lo que necesitas tener listo:

#### En tu equipo:
- [ ] Windows PowerShell o terminal
- [ ] Navegador web (Chrome, Firefox, Edge)
- [ ] Tarjeta de crédito/débito (para AWS - capa gratuita disponible)

#### Información del proyecto:
- [ ] URL del repositorio: `https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65`
- [ ] Proyecto ya está en GitHub ✅ (acabamos de subirlo)

#### Tiempo estimado:
- ⏱️ **1-2 horas** para el despliegue completo
- ⏱️ **15 minutos** adicionales si es tu primera vez en AWS

---

## 2. CREAR CUENTA AWS

### Paso 2.1: Registro en AWS

1. **Ir a AWS:**
   ```
   https://aws.amazon.com/
   ```

2. **Clic en "Crear una cuenta de AWS"** (arriba derecha)

3. **Completar el formulario:**
   - **Dirección de email:** Tu email personal
   - **Nombre de cuenta AWS:** `gt-turing-deployment` (o el que prefieras)
   - **Contraseña:** Una contraseña segura (guárdala bien)

4. **Información de contacto:**
   - Tipo de cuenta: **Personal**
   - Nombre completo
   - Número de teléfono
   - Dirección completa

5. **Información de pago:**
   - Tarjeta de crédito/débito
   - ⚠️ **IMPORTANTE:** AWS tiene capa gratuita (12 meses)
   - No te cobrarán si te mantienes en los límites gratuitos
   - T2.micro es gratuito 750 horas/mes

6. **Verificación de identidad:**
   - Recibirás una llamada o SMS
   - Introduce el código que te den

7. **Seleccionar plan:**
   - Elige **"Plan de soporte básico"** (gratuito)

8. **Confirmación:**
   - Recibirás un email de confirmación
   - Ya puedes acceder a la consola AWS

### Paso 2.2: Primer inicio de sesión

1. **Ir a la consola:**
   ```
   https://console.aws.amazon.com/
   ```

2. **Iniciar sesión:**
   - Usuario raíz
   - Email que registraste
   - Tu contraseña

3. **Cambiar región:**
   - Arriba derecha, al lado de tu nombre
   - Selecciona: **"Europe (Ireland) eu-west-1"** o **"Europe (Frankfurt) eu-central-1"**
   - ⚠️ Mantén la misma región para todo

---

## 3. CONFIGURAR SECURITY GROUP

### ¿Qué es un Security Group?
Es como el **firewall** de tu servidor. Define qué puertos están abiertos y desde dónde se puede acceder.

### Paso 3.1: Ir a Security Groups

1. En la consola AWS, busca **"EC2"** en el buscador superior
2. Clic en **"EC2"**
3. Menú izquierdo → **"Network & Security"** → **"Security Groups"**
4. Clic en botón naranja **"Create security group"**

### Paso 3.2: Configuración básica

```
Nombre del grupo de seguridad: gt-turing-sg
Descripción: Security group para GT-TURING (frontend, backend, SSH)
VPC: Dejar la predeterminada (vpc-xxxxx | default)
```

### Paso 3.3: Configurar reglas de entrada (Inbound rules)

Clic en **"Add rule"** para cada una de estas:

#### Regla 1: SSH (para conectarte)
```
Type: SSH
Protocol: TCP
Port range: 22
Source: My IP (se autodetecta tu IP)
Description: SSH access from my computer
```

#### Regla 2: HTTP (navegador web)
```
Type: HTTP
Protocol: TCP
Port range: 80
Source: Anywhere-IPv4 (0.0.0.0/0)
Description: HTTP public access
```

#### Regla 3: HTTPS (navegador web seguro)
```
Type: HTTPS
Protocol: TCP
Port range: 443
Source: Anywhere-IPv4 (0.0.0.0/0)
Description: HTTPS public access
```

#### Regla 4: Frontend Next.js
```
Type: Custom TCP
Protocol: TCP
Port range: 3000
Source: Anywhere-IPv4 (0.0.0.0/0)
Description: Next.js Frontend
```

#### Regla 5: Backend API .NET
```
Type: Custom TCP
Protocol: TCP
Port range: 5021
Source: Anywhere-IPv4 (0.0.0.0/0)
Description: .NET Backend API
```

### Paso 3.4: Reglas de salida (Outbound rules)

Dejar la predeterminada:
```
Type: All traffic
Protocol: All
Port range: All
Destination: 0.0.0.0/0
```

### Paso 3.5: Crear

- Clic en **"Create security group"** (abajo derecha)
- ✅ Verás un mensaje de éxito

**✅ COMPLETADO:**
```
ID del Security Group: sg-094797b1d9d356666
Nombre: gt-turing-sg
Estado: Activo
```

---

## 4. CREAR INSTANCIA EC2

### ¿Qué es EC2?
Es tu **servidor virtual en la nube**. Aquí instalaremos el backend y frontend.

### Paso 4.1: Lanzar instancia

1. En EC2, menú izquierdo → **"Instances"** → **"Instances"**
2. Clic en botón naranja **"Launch instances"**

### Paso 4.2: Nombre y etiquetas

```
Name: gt-turing-server
```

### Paso 4.3: Imagen del sistema (AMI)

1. Buscar: **"Ubuntu"**
2. Seleccionar: **"Ubuntu Server 22.04 LTS (HVM), SSD Volume Type"**
3. Arquitectura: **64-bit (x86)**
4. ⚠️ Verificar que diga **"Free tier eligible"**

### Paso 4.4: Tipo de instancia

1. Seleccionar: **t2.medium**
   ```
   t2.medium
   2 vCPUs, 4 GiB Memory
   
   ⚠️ NOTA: t2.micro (gratis) puede ser muy lento para este proyecto
   t2.medium cuesta ~$0.05/hora (~$35/mes si está 24/7)
   
   ALTERNATIVA: Usar t2.micro para pruebas, luego escalar a t2.medium
   ```

### Paso 4.5: Par de claves (Key pair)

Este archivo te permitirá conectarte por SSH.

**✅ CONFIGURACIÓN ACTUAL:**
```
Key pair name: vockey
```

⚠️ **IMPORTANTE:** 
- Si ya tienes el archivo `labsuser.pem` o `vockey.pem` descargado previamente, úsalo
- Si no lo tienes, descárgalo ahora desde AWS Academy
- Guárdalo en: `C:\Users\TU_USUARIO\.ssh\labsuser.pem`
- **No lo pierdas, no se puede recuperar**

### Paso 4.6: Configuración de red

```
VPC: Dejar la predeterminada
Subnet: No preference
Auto-assign public IP: Enable (activado)
Firewall (security groups): Select existing security group
   → Seleccionar: gt-turing-sg (sg-094797b1d9d356666) ✅
```

### Paso 4.7: Configurar almacenamiento

```
Size (GiB): 20 GB (mínimo)
Volume type: gp3 (General Purpose SSD)
Delete on termination: ✅ Yes
```

### Paso 4.8: Detalles avanzados

**Dejar todo por defecto**, no tocar nada aquí.

### Paso 4.9: Resumen y lanzar

1. **Revisar el resumen** en el panel derecho:
   ```
   Number of instances: 1
   Instance type: t2.medium
   ```

2. Clic en **"Launch instance"** (botón naranja)

3. ✅ **INSTANCIA CREADA EXITOSAMENTE:**
   ```
   Instance ID: i-0e8923c30ef84b432
   Nombre: gt-turing-server
   Estado: Iniciando...
   ```

4. Clic en el **ID de la instancia** para ver detalles

### Paso 4.10: Esperar a que esté lista

1. En la lista de instancias, verás tu servidor
2. **Estado actual:**
   - Instance state: `Pending` → espera 1-2 minutos → `Running` ✅
   - Status check: `Initializing` → espera 2-3 minutos → `2/2 checks passed` ✅

3. ✅ **INSTANCIA LISTA:**
   ```
   Instance ID: i-0e8923c30ef84b432
   Instance state: Running
   Status check: 2/2 checks passed
   IP pública temporal: 100.27.217.219 (cambiaremos por IP elástica)
   ```

---

## 5. ASIGNAR IP ELÁSTICA

### ¿Por qué necesito una IP Elástica?
Sin IP elástica, cada vez que reinicies el servidor, **cambiará la IP**.
Con IP elástica, **la IP siempre será la misma**.

### Paso 5.1: Asignar nueva IP

1. Menú izquierdo → **"Network & Security"** → **"Elastic IPs"**
2. Clic en **"Allocate Elastic IP address"**
3. Configuración:
   ```
   Public IPv4 address pool: Amazon's pool of IPv4 addresses
   Network Border Group: Dejar predeterminado
   ```
4. Clic en **"Allocate"**
5. ✅ **IP ELÁSTICA ASIGNADA:**
   ```
   IP: 54.83.171.149
   Allocation ID: eipalloc-0371f917a21aa2079
   ```
6. 📝 **ESTA ES TU IP DEFINITIVA - LA USAREMOS EN TODO**

### Paso 5.2: Asociar a la instancia

1. Con la IP seleccionada, clic en **"Actions"** → **"Associate Elastic IP address"**
2. Configuración:
   ```
   Resource type: Instance
   Instance: i-0e8923c30ef84b432 (gt-turing-server)
   Private IP address: 172.31.20.181
   ```
3. Clic en **"Associate"**
4. ✅ La IP ya está asociada a tu servidor

### Paso 5.3: Verificar

1. Ve a **"Instances"**
2. Selecciona tu instancia
3. Abajo verás:
   ```
   Public IPv4 address: 54.83.171.149 (tu IP elástica) ✅
   ```

---

## 6. CONECTAR POR SSH

### ¿Qué es SSH?
Es la forma de **acceder a la terminal de tu servidor** desde tu ordenador.

### Paso 6.1: Preparar la clave en Windows

1. **Abrir PowerShell como administrador**

2. **Mover la clave a una carpeta segura:**
   ```powershell
   # Crear carpeta .ssh si no existe
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh"
   
   # Mover la clave (ajusta la ruta si está en otro sitio)
   # Si tienes labsuser.pem:
   Move-Item -Path "$env:USERPROFILE\Downloads\labsuser.pem" -Destination "$env:USERPROFILE\.ssh\labsuser.pem" -Force
   ```

3. **Proteger la clave (importante):**
   ```powershell
   # Obtener el archivo
   $keyPath = "$env:USERPROFILE\.ssh\labsuser.pem"
   
   # Quitar herencia
   icacls $keyPath /inheritance:r
   
   # Dar permisos solo a tu usuario
   icacls $keyPath /grant:r "$($env:USERNAME):(R)"
   ```

### Paso 6.2: Conectar por SSH

1. **En PowerShell** (en la misma ventana):

   ```powershell
   # Conectar a tu servidor AWS
   ssh -i "$env:USERPROFILE\.ssh\labsuser.pem" ubuntu@54.83.171.149
   ```

2. **Primera conexión:**
   - Te preguntará: `Are you sure you want to continue connecting (yes/no)?`
   - Escribe: `yes` y Enter

3. ✅ **Verás algo como:**
   ```
   Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 6.2.0-1009-aws x86_64)
   
   ubuntu@ip-172-31-xx-xx:~$
   ```

4. **¡Estás dentro del servidor!** 🎉

### Paso 6.3: Verificar información del servidor

```bash
# Ver información del sistema
uname -a

# Ver espacio en disco
df -h

# Ver memoria
free -h
```

---

## 7. CONFIGURAR EL SERVIDOR

### Paso 7.1: Actualizar el sistema

```bash
# Actualizar lista de paquetes
sudo apt update

# Actualizar paquetes instalados
sudo apt upgrade -y
```

⏱️ **Tiempo:** 3-5 minutos

### Paso 7.2: Instalar herramientas básicas

```bash
# Instalar utilidades esenciales
sudo apt install -y git curl wget unzip software-properties-common
```

### Paso 7.3: Configurar firewall UFW (opcional pero recomendado)

```bash
# Activar UFW
sudo ufw enable

# Permitir SSH (¡importante! Si no lo haces, te bloquearás)
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir puertos de nuestra app
sudo ufw allow 3000/tcp
sudo ufw allow 5021/tcp

# Ver estado
sudo ufw status
```

---

## 8. INSTALAR DEPENDENCIAS

### Paso 8.1: Instalar .NET 8 SDK

```bash
# Agregar repositorio de Microsoft
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Actualizar e instalar .NET
sudo apt update
sudo apt install -y dotnet-sdk-8.0

# Verificar instalación
dotnet --version
# Debería mostrar: 8.0.xxx
```

### Paso 8.2: Instalar Node.js 20

```bash
# Descargar e instalar NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalaciones
node --version
# Debería mostrar: v20.x.x

npm --version
# Debería mostrar: 10.x.x
```

### Paso 8.3: Instalar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar Nginx
sudo systemctl start nginx

# Habilitar para que inicie automáticamente
sudo systemctl enable nginx

# Verificar estado
sudo systemctl status nginx
# Debería mostrar: active (running)

# Probar accediendo a tu IP en el navegador:
# http://54.83.171.149
# Deberías ver la página de bienvenida de Nginx
```

---

## 9. CLONAR EL PROYECTO

### Paso 9.1: Crear directorio y clonar

```bash
# Ir a /var/www
cd /var/www

# Clonar el repositorio
sudo git clone https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65.git

# Dar permisos al usuario ubuntu
sudo chown -R ubuntu:ubuntu proyectosintegrados-Juanjotg65

# Entrar al directorio
cd proyectosintegrados-Juanjotg65

# Ver estructura
ls -la
# Deberías ver: gt-turing/ gt-turing-backend/ DESPLIEGUE_AWS.md etc.
```

---

## 10. CONFIGURAR VARIABLES DE ENTORNO

### Paso 10.1: Actualizar .env.production (Frontend)

```bash
# Ir al directorio del frontend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing

# Editar .env.production
nano .env.production
```

**Contenido del archivo:**
```bash
NEXT_PUBLIC_API_URL=http://54.83.171.149:5021
```

**Guardar:**
- `Ctrl + O` (guardar)
- `Enter` (confirmar)
- `Ctrl + X` (salir)

### Paso 10.2: Verificar .env.production

```bash
cat .env.production
# Debería mostrar la línea con tu IP
```

### Paso 10.3: Actualizar appsettings.Production.json (Backend)

```bash
# Ir al directorio del backend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend

# Editar appsettings.Production.json
nano appsettings.Production.json
```

**Contenido del archivo:**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "Sqlite": "Data Source=/var/www/gt-turing-backend/gt_turing.db"
  },
  "Jwt": {
    "Key": "MI-SUPER-CLAVE-SECRETA-JWT-2025-PRODUCCION-GT-TURING-MIN-32-CARACTERES",
    "Issuer": "GT-TURING-API",
    "Audience": "GT-TURING-Frontend"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://54.83.171.149:3000",
      "https://54.83.171.149",
      "http://localhost:3000"
    ]
  }
}
```

⚠️ **IMPORTANTE:**
- La IP `54.83.171.149` ya está configurada en CORS
- Cambia la clave JWT por una clave aleatoria segura si quieres

**Guardar:**
- `Ctrl + O` → `Enter` → `Ctrl + X`

### Paso 10.4: Verificar configuración

```bash
cat appsettings.Production.json
# Verifica que tenga tu IP en los 3 lugares
```

---

## 11. DESPLEGAR BACKEND .NET

### Paso 11.1: Compilar el backend

```bash
# Asegurarte de estar en el directorio correcto
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend

# Restaurar dependencias
dotnet restore

# Compilar en modo Release
dotnet publish -c Release -o /var/www/gt-turing-backend

# Verificar que se creó la carpeta
ls -la /var/www/gt-turing-backend
# Deberías ver archivos .dll, appsettings.json, etc.
```

⏱️ **Tiempo:** 2-3 minutos

### Paso 11.2: Crear base de datos

```bash
# La base de datos se creará automáticamente al iniciar
# Pero vamos a crear la carpeta primero
sudo mkdir -p /var/www/gt-turing-backend
sudo chown -R ubuntu:ubuntu /var/www/gt-turing-backend
```

### Paso 11.3: Crear servicio systemd para el backend

```bash
# Crear archivo de servicio
sudo nano /etc/systemd/system/gt-turing-backend.service
```

**Contenido del archivo:**
```ini
[Unit]
Description=GT-TURING Backend API (.NET 8)
After=network.target

[Service]
WorkingDirectory=/var/www/gt-turing-backend
ExecStart=/usr/bin/dotnet /var/www/gt-turing-backend/gt-turing-backend.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=gt-turing-backend
User=ubuntu
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
Environment=ASPNETCORE_URLS=http://0.0.0.0:5021

[Install]
WantedBy=multi-user.target
```

**Guardar:**
- `Ctrl + O` → `Enter` → `Ctrl + X`

### Paso 11.4: Iniciar el servicio del backend

```bash
# Recargar systemd para que detecte el nuevo servicio
sudo systemctl daemon-reload

# Habilitar el servicio (para que inicie automáticamente)
sudo systemctl enable gt-turing-backend

# Iniciar el servicio
sudo systemctl start gt-turing-backend

# Verificar estado
sudo systemctl status gt-turing-backend
```

**Deberías ver:**
```
● gt-turing-backend.service - GT-TURING Backend API (.NET 8)
   Loaded: loaded
   Active: active (running)
```

### Paso 11.5: Ver logs del backend

```bash
# Ver logs en tiempo real
sudo journalctl -u gt-turing-backend -f

# Deberías ver algo como:
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: http://0.0.0.0:5021
# info: Microsoft.Hosting.Lifetime[0]
#       Application started. Press Ctrl+C to shut down.
```

**Para salir de los logs:** `Ctrl + C`

### Paso 11.6: Probar el backend

```bash
# Desde el servidor
curl http://localhost:5021/api/cars

# Desde tu navegador (tu ordenador local):
# http://54.83.171.149:5021/swagger
```

✅ **Si ves Swagger UI, el backend está funcionando!**

---

## 12. DESPLEGAR FRONTEND NEXT.JS

### Paso 12.1: Instalar dependencias

```bash
# Ir al directorio del frontend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing

# Instalar dependencias
npm install --production=false

# Esto puede tardar 3-5 minutos
```

### Paso 12.2: Compilar el frontend

```bash
# Compilar para producción
npm run build

# Esto puede tardar 2-4 minutos
# Deberías ver: ✓ Compiled successfully
```

### Paso 12.3: Crear servicio systemd para el frontend

```bash
# Crear archivo de servicio
sudo nano /etc/systemd/system/gt-turing-frontend.service
```

**Contenido del archivo:**
```ini
[Unit]
Description=GT-TURING Frontend (Next.js)
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/proyectosintegrados-Juanjotg65/gt-turing
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

**Guardar:**
- `Ctrl + O` → `Enter` → `Ctrl + X`

### Paso 12.4: Iniciar el servicio del frontend

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar el servicio
sudo systemctl enable gt-turing-frontend

# Iniciar el servicio
sudo systemctl start gt-turing-frontend

# Verificar estado
sudo systemctl status gt-turing-frontend
```

**Deberías ver:**
```
● gt-turing-frontend.service - GT-TURING Frontend (Next.js)
   Loaded: loaded
   Active: active (running)
```

### Paso 12.5: Ver logs del frontend

```bash
# Ver logs
sudo journalctl -u gt-turing-frontend -f

# Deberías ver:
# > gt-turing@0.1.0 start
# > next start
# ▲ Next.js 15.x.x
# - Local:        http://localhost:3000
# ✓ Ready in XXXms
```

**Para salir:** `Ctrl + C`

### Paso 12.6: Probar el frontend

**Desde tu navegador:**
```
http://54.83.171.149:3000
```

✅ **Deberías ver la página de inicio de GT-TURING!**

---

## 13. CONFIGURAR NGINX
# Cambiar el .env.production para incluir /api
echo "NEXT_PUBLIC_API_URL=http://54.83.171.149:5021/api" > /var/www/proyectosintegrados-Juanjotg65/gt-turing/.env.production

# Reconstruir
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
rm -rf .next
npm run build
sudo systemctl restart gt-turing-frontend# Cambiar el .env.production para incluir /api
echo "NEXT_PUBLIC_API_URL=http://54.83.171.149:5021/api" > /var/www/proyectosintegrados-Juanjotg65/gt-turing/.env.production

# Reconstruir
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
rm -rf .next
npm run build
sudo systemctl restart gt-turing-frontend
### ¿Por qué Nginx?
- **Proxy reverso:** Redirige las peticiones a nuestros servicios
- **HTTPS:** Permite usar certificados SSL
- **Caché:** Mejora el rendimiento
- **Balanceo de carga:** Para escalar en el futuro

### Paso 13.1: Crear configuración de Nginx

```bash
# Crear archivo de configuración
sudo nano /etc/nginx/sites-available/gt-turing
```

**Contenido del archivo:**

```nginx
# Redirigir HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name 54.83.171.149;
    
    # Redirigir todo a HTTPS
    return 301 https://$server_name$request_uri;
}

# Servidor HTTPS principal
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name 54.83.171.149;
    
    # Certificados SSL (los crearemos en el siguiente paso)
    ssl_certificate /etc/nginx/ssl/gt-turing.crt;
    ssl_certificate_key /etc/nginx/ssl/gt-turing.key;
    
    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Frontend Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5021/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Swagger (útil para desarrollo)
    location /swagger {
        proxy_pass http://localhost:5021/swagger;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}

# Backend directo en puerto 5021 (opcional, para acceso directo a la API)
server {
    listen 5021;
    listen [::]:5021;
    server_name 54.83.171.149;
    
    location / {
        proxy_pass http://localhost:5021;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Guardar:**
- `Ctrl + O` → `Enter` → `Ctrl + X`

### Paso 13.2: Habilitar el sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/gt-turing /etc/nginx/sites-enabled/

# Eliminar configuración por defecto
sudo rm /etc/nginx/sites-enabled/default
```

### Paso 13.3: Probar configuración (fallará por ahora, es normal)

```bash
# Probar sintaxis
sudo nginx -t

# Verás un error sobre los certificados SSL - es normal
# Los crearemos en el siguiente paso
```

---

## 14. CONFIGURAR HTTPS

### Paso 14.1: Crear directorio para certificados

```bash
# Crear carpeta
sudo mkdir -p /etc/nginx/ssl

# Ir a la carpeta
cd /etc/nginx/ssl
```

### Paso 14.2: Generar certificado autofirmado

⚠️ **NOTA:** Este es un certificado **autofirmado** (self-signed). Los navegadores mostrarán advertencia de seguridad, pero funcionará. Para producción real, usa Let's Encrypt.

```bash
# Generar certificado y clave privada
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/gt-turing.key \
  -out /etc/nginx/ssl/gt-turing.crt
```

**Te pedirá información:**
```
Country Name: ES
State: Madrid (tu comunidad)
Locality Name: Madrid (tu ciudad)
Organization Name: GT-TURING
Organizational Unit Name: Development
Common Name: 54.83.171.149
Email Address: tu@email.com
```

⚠️ **IMPORTANTE en Common Name:** Pon `54.83.171.149`

### Paso 14.3: Verificar certificados

```bash
# Ver archivos creados
ls -la /etc/nginx/ssl/

# Deberías ver:
# gt-turing.crt (certificado)
# gt-turing.key (clave privada)
```

### Paso 14.4: Probar configuración de Nginx

```bash
# Probar sintaxis (ahora debería funcionar)
sudo nginx -t

# Deberías ver:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Paso 14.5: Reiniciar Nginx

```bash
# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar estado
sudo systemctl status nginx

# Debería estar: active (running)
```

---

## 15. VERIFICAR FUNCIONAMIENTO

### Paso 15.1: Acceder al frontend (HTTP)

**En tu navegador:**
```
http://54.83.171.149:3000
```

✅ Debería cargar la página de inicio de GT-TURING

### Paso 15.2: Acceder al frontend (HTTPS a través de Nginx)

**En tu navegador:**
```
https://54.83.171.149
```

⚠️ Verás una advertencia de seguridad (porque es certificado autofirmado):
- **Chrome:** "Tu conexión no es privada" → Clic en "Avanzado" → "Acceder a..."
- **Firefox:** "Advertencia: Riesgo potencial" → "Avanzado" → "Aceptar el riesgo"

✅ Después de aceptar, deberías ver la página de inicio

### Paso 15.3: Probar el backend (Swagger)

**En tu navegador:**
```
http://54.83.171.149:5021/swagger
```

✅ Deberías ver la documentación de Swagger con todos los endpoints

### Paso 15.4: Probar funcionalidades

1. **Registro de usuario:**
   - Ir a `/register`
   - Crear una cuenta nueva
   - ✅ Debería funcionar

2. **Login:**
   - Ir a `/login`
   - Email: `admin@gtturing.com`
   - Password: `Admin123!`
   - ✅ Debería iniciar sesión

3. **Ver coches:**
   - Ir a `/cars`
   - ✅ Debería mostrar lista de coches

4. **Ver circuitos:**
   - Ir a `/circuits`
   - ✅ Debería mostrar lista de circuitos

5. **Dashboard de usuario:**
   - Ir a `/dashboard`
   - ✅ Debería mostrar el dashboard

6. **Admin panel:**
   - Login como admin
   - Ir a `/admin`
   - ✅ Debería mostrar panel de administración

7. **Chat:**
   - Ir a `/chat`
   - Enviar un mensaje
   - ✅ Debería funcionar

8. **Crear reserva:**
   - Ir a `/reservations`
   - Crear una reserva
   - ✅ Debería funcionar

### Paso 15.5: Verificar logs

```bash
# Logs del backend
sudo journalctl -u gt-turing-backend -n 50

# Logs del frontend
sudo journalctl -u gt-turing-frontend -n 50

# Logs de Nginx
sudo tail -n 50 /var/log/nginx/access.log
sudo tail -n 50 /var/log/nginx/error.log
```

### Paso 15.6: Verificar servicios

```bash
# Estado de todos los servicios
sudo systemctl status gt-turing-backend
sudo systemctl status gt-turing-frontend
sudo systemctl status nginx

# Ver procesos
ps aux | grep dotnet
ps aux | grep node
ps aux | grep nginx
```

---

## 16. MANTENIMIENTO Y ACTUALIZACIONES

### Actualizar el código

```bash
# Conectar por SSH
ssh -i "$env:USERPROFILE\.ssh\labsuser.pem" ubuntu@54.83.171.149

# Ir al directorio del proyecto
cd /var/www/proyectosintegrados-Juanjotg65

# Hacer pull de los cambios
git pull origin main

# Actualizar backend
cd gt-turing-backend/gt-turing-backend
dotnet publish -c Release -o /var/www/gt-turing-backend
sudo systemctl restart gt-turing-backend

# Actualizar frontend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
npm install
npm run build
sudo systemctl restart gt-turing-frontend

# Verificar que todo funciona
sudo systemctl status gt-turing-backend
sudo systemctl status gt-turing-frontend
```

### Ver logs en tiempo real

```bash
# Backend
sudo journalctl -u gt-turing-backend -f

# Frontend
sudo journalctl -u gt-turing-frontend -f

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Reiniciar servicios

```bash
# Reiniciar backend
sudo systemctl restart gt-turing-backend

# Reiniciar frontend
sudo systemctl restart gt-turing-frontend

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar todo
sudo systemctl restart gt-turing-backend gt-turing-frontend nginx
```

### Hacer backup de la base de datos

```bash
# Copiar la base de datos
sudo cp /var/www/gt-turing-backend/gt_turing.db /var/www/gt-turing-backend/gt_turing.db.backup

# Descargar a tu ordenador (desde PowerShell local)
scp -i "$env:USERPROFILE\.ssh\labsuser.pem" ubuntu@54.83.171.149:/var/www/gt-turing-backend/gt_turing.db C:\Users\TU_USUARIO\Desktop\gt_turing_backup.db
```

### Monitorizar uso de recursos

```bash
# Ver uso de CPU y memoria
htop
# (si no está instalado: sudo apt install htop)

# Ver espacio en disco
df -h

# Ver uso de memoria
free -h

# Ver procesos que más consumen
top
```

---

## 🎉 ¡FELICIDADES!

Tu aplicación GT-TURING está desplegada en AWS y funcionando!

### URLs finales:

```
Frontend (HTTPS): https://54.83.171.149
Frontend (HTTP):  http://54.83.171.149:3000
Backend API:      http://54.83.171.149:5021
Swagger:          http://54.83.171.149:5021/swagger
```

### Credenciales de prueba:

```
Admin:
Email: admin@gtturing.com
Password: Admin123!

Usuario normal:
Email: user@gtturing.com
Password: User123!
```

---

## 📞 SOLUCIÓN DE PROBLEMAS

### Problema: No puedo conectar por SSH

**Solución:**
```bash
# Verificar que el Security Group permite SSH desde tu IP
# En AWS Console → EC2 → Security Groups → gt-turing-sg
# Inbound rules → SSH debe tener tu IP actual

# Si cambió tu IP, actualiza la regla:
# Edit inbound rules → SSH → Source: My IP
```

### Problema: Backend no inicia

**Solución:**
```bash
# Ver logs detallados
sudo journalctl -u gt-turing-backend -n 100 --no-pager

# Problemas comunes:
# 1. Puerto 5021 en uso
sudo netstat -tulpn | grep 5021
sudo kill -9 <PID>

# 2. Permisos de la base de datos
sudo chown -R ubuntu:ubuntu /var/www/gt-turing-backend

# 3. Reinstalar
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend
dotnet clean
dotnet publish -c Release -o /var/www/gt-turing-backend
sudo systemctl restart gt-turing-backend
```

### Problema: Frontend no inicia

**Solución:**
```bash
# Ver logs
sudo journalctl -u gt-turing-frontend -n 100 --no-pager

# Reinstalar dependencias
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
rm -rf node_modules .next
npm install
npm run build
sudo systemctl restart gt-turing-frontend
```

### Problema: Error CORS

**Solución:**
```bash
# Verificar appsettings.Production.json
cat /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend/appsettings.Production.json

# Debe tener tu IP en AllowedOrigins
# Si no, editar:
nano /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend/appsettings.Production.json

# Reiniciar backend
sudo systemctl restart gt-turing-backend
```

### Problema: 502 Bad Gateway

**Solución:**
```bash
# El backend está caído
sudo systemctl status gt-turing-backend

# Reiniciar
sudo systemctl restart gt-turing-backend

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 📚 RECURSOS ADICIONALES

### Documentación del proyecto:
- `DESARROLLO_LOCAL.md` - Desarrollo en local
- `DESPLIEGUE_AWS.md` - Resumen del despliegue
- `CHECKLIST_DESPLIEGUE.md` - Checklist interactivo

### Documentación oficial:
- [AWS EC2](https://docs.aws.amazon.com/ec2/)
- [Nginx](https://nginx.org/en/docs/)
- [.NET 8](https://learn.microsoft.com/es-es/dotnet/)
- [Next.js](https://nextjs.org/docs)

---

## 17. ACCESO MEDIANTE HTTPS

**En este punto ya tienes HTTPS configurado!** ✅

Si seguiste los pasos 13 y 14, ya creaste:
- ✅ Certificado SSL autofirmado
- ✅ Nginx configurado para HTTPS en puerto 443
- ✅ Redirección automática de HTTP a HTTPS

### Paso 17.1: Verificar que HTTPS funciona

**Desde tu navegador:**

```
https://54.83.171.149
```

⚠️ **IMPORTANTE:** Verás una advertencia de seguridad porque es un certificado autofirmado.

**Cómo aceptar el riesgo:**

**En Chrome:**
1. Verás: "Tu conexión no es privada"
2. Clic en **"Avanzado"**
3. Clic en **"Acceder a 54.83.171.149 (no seguro)"**

**En Firefox:**
1. Verás: "Advertencia: Riesgo potencial de seguridad a continuación"
2. Clic en **"Avanzado"**
3. Clic en **"Aceptar el riesgo y continuar"**

**En Edge:**
1. Verás: "Su conexión no es privada"
2. Clic en **"Avanzadas"**
3. Clic en **"Continuar a 54.83.171.149 (no seguro)"**

✅ **Después de aceptar, ya puedes usar HTTPS normalmente**

### Paso 17.2: Probar todas las funcionalidades con HTTPS

1. **Página de inicio:**
   ```
   https://54.83.171.149
   ```

2. **Login:**
   ```
   https://54.83.171.149/login
   ```
   - Email: `admin@gt-turing.com`
   - Password: `Admin123!`

3. **Ver coches:**
   ```
   https://54.83.171.149/cars
   ```

4. **Ver circuitos:**
   ```
   https://54.83.171.149/circuits
   ```

5. **Dashboard:**
   ```
   https://54.83.171.149/dashboard
   ```

6. **Swagger API:**
   ```
   https://54.83.171.149/swagger
   ```

### Paso 17.3: ¿Por qué aparece la advertencia de seguridad?

El certificado es **autofirmado**, lo que significa:
- ✅ **La conexión SÍ está cifrada** (segura)
- ✅ **Los datos SÍ viajan encriptados**
- ❌ **No está firmado por una Autoridad Certificadora** reconocida (como Let's Encrypt)

**Solución para eliminar la advertencia:**
- Necesitas un **dominio** (gratis o de pago)
- Con dominio, puedes usar **Let's Encrypt** (certificado SSL gratis y válido)
- Ver sección 18 (opcional) para configurar dominio

### Paso 17.4: Guardar la excepción del certificado en tu navegador

**Para no tener que aceptar el riesgo cada vez:**

1. **Acepta el riesgo** una vez (paso 17.1)
2. El navegador guardará la excepción
3. Las próximas veces entrará directamente sin advertencia

---

## 18. CONFIGURAR DOMINIO GRATUITO (OPCIONAL - Para eliminar advertencia SSL)

**⚠️ ESTA SECCIÓN ES COMPLETAMENTE OPCIONAL**

Si quieres eliminar la advertencia de seguridad del navegador, necesitas un dominio. Aquí te explico cómo hacerlo **GRATIS**.

### ¿Qué opciones gratuitas hay?

| Servicio | Tipo | Ejemplo | Validez |
|----------|------|---------|---------|
| **DuckDNS** | Subdominio | `gt-turing.duckdns.org` | Gratis siempre |
| **No-IP** | Subdominio | `gt-turing.hopto.org` | Gratis siempre |
| **Freenom** | Dominio completo | `gt-turing.tk` | 1 año gratis |

**Recomendación:** Usa **DuckDNS** - es el más sencillo y confiable.

---

### OPCIÓN A: DUCKDNS (Recomendado - 100% Gratis)

### Paso 18.1: Registrarse en DuckDNS

1. **Ir a DuckDNS:**
   ```
   https://www.duckdns.org/
   ```

2. **Iniciar sesión con:**
   - Google
   - GitHub
   - Reddit
   - Twitter
   - (Elige el que prefieras)

3. **Ya estás dentro!** 🎉

### Paso 18.2: Crear tu subdominio

1. **En la caja "sub domain", escribe:**
   ```
   gt-turing
   ```

2. **Resultado:** Tu dominio será `gt-turing.duckdns.org`

3. **En "current ip", poner tu IP de AWS:**
   ```
   54.83.171.149
   ```

4. **Clic en "add domain"**

5. ✅ **Subdominio creado!**

### Paso 18.3: Verificar que el dominio funciona

**Desde PowerShell en tu ordenador:**

```powershell
nslookup gt-turing.duckdns.org

# Debería mostrar:
# Address: 54.83.171.149
```

**Desde el navegador:**
```
http://gt-turing.duckdns.org:3000
```

✅ Debería cargar tu aplicación

### Paso 18.4: Actualizar configuración de Nginx

**Conectar al servidor AWS:**

```bash
ssh -i "$env:USERPROFILE\.ssh\labsuser.pem" ubuntu@54.83.171.149
```

**Editar Nginx:**

```bash
sudo nano /etc/nginx/sites-available/gt-turing
```

**Reemplazar TODO el contenido con esto:**

```nginx
# Redirigir HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name gt-turing.duckdns.org 54.83.171.149;
    
    # Redirigir todo a HTTPS
    return 301 https://gt-turing.duckdns.org$request_uri;
}

# Servidor HTTPS principal
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name gt-turing.duckdns.org;
    
    # Certificados SSL (Let's Encrypt - los crearemos en el siguiente paso)
    ssl_certificate /etc/letsencrypt/live/gt-turing.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gt-turing.duckdns.org/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    # Seguridad adicional
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logs
    access_log /var/log/nginx/gt-turing-access.log;
    error_log /var/log/nginx/gt-turing-error.log;
    
    # Frontend Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5021/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket para Chat (SignalR)
    location /ws/ {
        proxy_pass http://localhost:5021/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket timeouts largos
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }
    
    # Swagger
    location /swagger {
        proxy_pass http://localhost:5021/swagger;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Archivos estáticos de Next.js
    location /_next/static/ {
        proxy_pass http://localhost:3000/_next/static/;
        add_header Cache-Control "public, max-age=3600, immutable";
    }
    
    # Favicon
    location = /favicon.ico {
        proxy_pass http://localhost:3000/favicon.ico;
        access_log off;
        log_not_found off;
    }
}
```

**Guardar:** `Ctrl + O` → `Enter` → `Ctrl + X`

### Paso 18.5: Instalar Certbot (para SSL gratis de Let's Encrypt)

```bash
# Instalar Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Verificar instalación
certbot --version
```

### Paso 18.6: Generar certificado SSL GRATUITO y VÁLIDO

⚠️ **IMPORTANTE:** Si `certbot` falla con error DNS SERVFAIL, usa primero el certificado autofirmado (Paso 18.6.1) y reintenta Let's Encrypt más tarde (Paso 18.6.2).

#### Paso 18.6.1: Configuración temporal con certificado autofirmado

```bash
# Actualizar Nginx para usar certificado autofirmado temporalmente
sudo tee /etc/nginx/sites-available/gt-turing > /dev/null <<'EOF'
# Redirigir HTTP a HTTPS (excepto Let's Encrypt)
server {
    listen 80;
    listen [::]:80;
    server_name gt-turing.duckdns.org 54.83.171.149;
    
    # Permitir validación de Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirigir todo lo demás a HTTPS
    location / {
        return 301 https://gt-turing.duckdns.org$request_uri;
    }
}

# Servidor HTTPS principal
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name gt-turing.duckdns.org;
    
    # Certificados SSL temporales (autofirmado)
    ssl_certificate /etc/nginx/ssl/gt-turing.crt;
    ssl_certificate_key /etc/nginx/ssl/gt-turing.key;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Logs
    access_log /var/log/nginx/gt-turing-access.log;
    error_log /var/log/nginx/gt-turing-error.log;
    
    # Frontend Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5021/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Swagger
    location /swagger {
        proxy_pass http://localhost:5021/swagger;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

**Ahora puedes acceder a:**
```
https://gt-turing.duckdns.org
```

⚠️ Verás advertencia de seguridad (certificado autofirmado) - acéptala temporalmente.

#### Paso 18.6.2: Obtener certificado Let's Encrypt válido (después de 30 minutos)

**Espera 30-60 minutos** para que el DNS se propague completamente a todos los servidores.

Luego ejecuta:

```bash
# Generar certificado SSL con Let's Encrypt
sudo certbot --nginx -d gt-turing.duckdns.org

# Durante el proceso:
# 1. Email: Introduce tu email (para avisos de renovación)
# 2. Términos: (A)gree
# 3. Compartir email con EFF: (Y)es o (N)o (da igual)
```

**Certbot hará AUTOMÁTICAMENTE:**
- ✅ Verificar que `gt-turing.duckdns.org` apunta a tu servidor
- ✅ Generar certificado SSL válido (gratis)
- ✅ Actualizar Nginx con el certificado (reemplazará el autofirmado)
- ✅ Configurar renovación automática cada 90 días

⏱️ **Tiempo:** 30-60 segundos

**Si certbot sigue fallando**, usa el método standalone:

```bash
# Detener nginx temporalmente
sudo systemctl stop nginx

# Método standalone (más confiable)
sudo certbot certonly --standalone -d gt-turing.duckdns.org

# Actualizar Nginx manualmente para usar los certificados
sudo nano /etc/nginx/sites-available/gt-turing
# Cambiar las líneas de certificados a:
# ssl_certificate /etc/letsencrypt/live/gt-turing.duckdns.org/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/gt-turing.duckdns.org/privkey.pem;

# Reiniciar nginx
sudo systemctl start nginx
```

### Paso 18.7: Verificar certificado SSL

```bash
# Ver certificados instalados
sudo certbot certificates

# Deberías ver:
# Certificate Name: gt-turing.duckdns.org
#   Domains: gt-turing.duckdns.org
#   Expiry Date: [3 meses desde hoy]
#   Certificate Path: /etc/letsencrypt/live/gt-turing.duckdns.org/fullchain.pem
```

✅ **Certificado válido creado!**

### Paso 18.8: Actualizar variables de entorno del backend

```bash
# Editar appsettings.Production.json
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend
nano appsettings.Production.json
```

**Actualizar la sección CORS (líneas 17-23):**

```json
  "Cors": {
    "AllowedOrigins": [
      "https://gt-turing.duckdns.org",
      "http://54.83.171.149:3000",
      "http://localhost:3000"
    ]
  }
```

**Guardar:** `Ctrl + O` → `Enter` → `Ctrl + X`

### Paso 18.9: Actualizar variables de entorno del frontend

```bash
# Editar .env.production
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
nano .env.production
```

**Cambiar por:**

```bash
NEXT_PUBLIC_API_URL=https://gt-turing.duckdns.org/api
```

**Guardar:** `Ctrl + O` → `Enter` → `Ctrl + X`

### Paso 18.10: Reconstruir y reiniciar todo

```bash
# Reconstruir frontend con la nueva URL
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
rm -rf .next
npm run build

# Reiniciar todos los servicios
sudo systemctl restart gt-turing-backend
sudo systemctl restart gt-turing-frontend
sudo systemctl restart nginx

# Verificar que todo funciona
sudo systemctl status gt-turing-backend
sudo systemctl status gt-turing-frontend
sudo systemctl status nginx
```

### Paso 18.11: ¡PROBAR TU APLICACIÓN CON SSL VÁLIDO!

**Abre tu navegador y accede a:**

```
https://gt-turing.duckdns.org
```

✅ **¡SIN ADVERTENCIAS DE SEGURIDAD!** 🎉

**Verás el candado 🔒 verde en la barra de direcciones**

**Probar todas las funcionalidades:**

1. **Login:**
   ```
   https://gt-turing.duckdns.org/login
   ```
   - Email: `admin@gt-turing.com`
   - Password: `Admin123!`

2. **Ver coches:**
   ```
   https://gt-turing.duckdns.org/cars
   ```

3. **Ver circuitos:**
   ```
   https://gt-turing.duckdns.org/circuits
   ```

4. **Dashboard:**
   ```
   https://gt-turing.duckdns.org/dashboard
   ```

5. **Swagger API:**
   ```
   https://gt-turing.duckdns.org/swagger
   ```

### Paso 18.12: Verificar renovación automática del certificado

Let's Encrypt genera certificados válidos por **90 días**. Certbot configuró la renovación automática.

```bash
# Verificar que está configurado
sudo systemctl status certbot.timer

# Debería estar: active (running)

# Probar renovación (no renueva realmente, solo prueba)
sudo certbot renew --dry-run

# Si todo OK: "Congratulations, all simulated renewals succeeded"
```

✅ **El certificado se renovará automáticamente cada 90 días**

### Paso 18.13: Verificar la calidad del SSL

Visita esta web para evaluar tu SSL:

```
https://www.ssllabs.com/ssltest/analyze.html?d=gt-turing.duckdns.org
```

**Deberías obtener calificación A o A+** ✅

---

### RESUMEN - Paso 18 completado:

✅ **Dominio gratuito:** `gt-turing.duckdns.org`  
✅ **SSL válido:** Let's Encrypt (renovación automática)  
✅ **Sin advertencias:** Certificado reconocido por todos los navegadores  
✅ **100% Gratis:** DuckDNS y Let's Encrypt son gratuitos siempre  

**URLs finales:**

```
🌐 Aplicación:  https://gt-turing.duckdns.org
🔧 API:         https://gt-turing.duckdns.org/api
📚 Swagger:     https://gt-turing.duckdns.org/swagger
💬 WebSocket:   wss://gt-turing.duckdns.org/ws
```

---

## 18. OPTIMIZACIONES DE PRODUCCIÓN

### Paso 18.1: Configurar caché de Nginx

```bash
# Editar configuración principal de Nginx
sudo nano /etc/nginx/nginx.conf
```

**Agregar dentro del bloque `http {}`:**
```nginx
# Cache para archivos estáticos
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=static_cache:10m max_size=100m inactive=60m use_temp_path=off;

# Compresión Gzip
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

**Guardar y reiniciar:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Paso 18.2: Configurar límites de rate limiting

**Para proteger contra ataques DDoS:**

```bash
sudo nano /etc/nginx/sites-available/gt-turing
```

**Agregar al inicio del archivo:**
```nginx
# Limitar peticiones por IP
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=200r/m;
```

**Dentro de `location /api/`:**
```nginx
limit_req zone=api_limit burst=20 nodelay;
```

### Paso 18.3: Configurar logs rotación

```bash
# Crear configuración de logrotate
sudo nano /etc/logrotate.d/gt-turing
```

```
/var/log/nginx/gt-turing-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

### Paso 18.4: Monitoreo con scripts automáticos

**Crear script de health check:**

```bash
nano ~/health-check.sh
```

```bash
#!/bin/bash

# Health check para GT-TURING
echo "=== GT-TURING Health Check ==="
date

# Backend
if curl -s http://localhost:5021/api/cars > /dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: FAIL"
    sudo systemctl restart gt-turing-backend
fi

# Frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: FAIL"
    sudo systemctl restart gt-turing-frontend
fi

# Nginx
if curl -s http://localhost > /dev/null; then
    echo "✅ Nginx: OK"
else
    echo "❌ Nginx: FAIL"
    sudo systemctl restart nginx
fi

# Espacio en disco
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️ Disco al ${DISK_USAGE}%"
else
    echo "✅ Disco: ${DISK_USAGE}%"
fi

# Memoria
MEM_USAGE=$(free | awk 'NR==2 {printf "%.0f", $3*100/$2}')
if [ $MEM_USAGE -gt 90 ]; then
    echo "⚠️ Memoria al ${MEM_USAGE}%"
else
    echo "✅ Memoria: ${MEM_USAGE}%"
fi
```

**Hacer ejecutable:**
```bash
chmod +x ~/health-check.sh
```

**Programar ejecución cada 5 minutos:**
```bash
crontab -e
```

**Agregar:**
```
*/5 * * * * /home/ubuntu/health-check.sh >> /home/ubuntu/health-check.log 2>&1
```

### Paso 18.5: Backup automático de base de datos

```bash
nano ~/backup-db.sh
```

```bash
#!/bin/bash

# Directorio de backups
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Fecha actual
DATE=$(date +%Y%m%d_%H%M%S)

# Hacer backup
cp /var/www/gt-turing-backend/gt_turing.db $BACKUP_DIR/gt_turing_$DATE.db

# Comprimir
gzip $BACKUP_DIR/gt_turing_$DATE.db

# Eliminar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "gt_turing_*.db.gz" -mtime +7 -delete

echo "Backup completado: gt_turing_$DATE.db.gz"
```

**Hacer ejecutable:**
```bash
chmod +x ~/backup-db.sh
```

**Programar backup diario a las 3 AM:**
```bash
crontab -e
```

**Agregar:**
```
0 3 * * * /home/ubuntu/backup-db.sh >> /home/ubuntu/backup.log 2>&1
```

---

## 19. SEGURIDAD ADICIONAL

### Paso 19.1: Configurar Fail2Ban

**Protege contra intentos de login SSH:**

```bash
# Instalar Fail2Ban
sudo apt install -y fail2ban

# Copiar configuración
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar configuración
sudo nano /etc/fail2ban/jail.local
```

**Configuración recomendada:**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/*error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/*error.log
maxretry = 10
```

**Iniciar Fail2Ban:**
```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Ver estado
sudo fail2ban-client status
```

### Paso 19.2: Deshabilitar login root por SSH

```bash
# Editar configuración SSH
sudo nano /etc/ssh/sshd_config
```

**Cambiar:**
```
PermitRootLogin no
PasswordAuthentication no
```

**Reiniciar SSH:**
```bash
sudo systemctl restart sshd
```

### Paso 19.3: Configurar AWS Security Group avanzado

En la consola de AWS EC2 → Security Groups:

**Reglas recomendadas:**
```
SSH (22):        Solo desde tu IP específica
HTTP (80):       Anywhere (redirige a HTTPS)
HTTPS (443):     Anywhere
Puerto 3000:     ELIMINAR (usar solo Nginx)
Puerto 5021:     ELIMINAR (usar solo Nginx)
```

---

## 🎯 CHECKLIST FINAL

### ✅ Verificación completa del despliegue:

- [ ] **Instancia EC2 funcionando**
  - Estado: Running
  - IP Elástica asignada: 54.83.171.149

- [ ] **Dominio configurado** (si aplica)
  - DNS apuntando a la IP
  - Propagación completada

- [ ] **Certificado SSL válido**
  - HTTPS funcionando sin advertencias
  - Renovación automática configurada

- [ ] **Backend funcionando**
  - Servicio activo: `sudo systemctl status gt-turing-backend`
  - API respondiendo: `curl http://localhost:5021/api/cars`
  - Swagger accesible: https://gt-turing.com/swagger

- [ ] **Frontend funcionando**
  - Servicio activo: `sudo systemctl status gt-turing-frontend`
  - Página cargando: https://gt-turing.com
  - Sin errores en consola del navegador

- [ ] **Nginx configurado**
  - Proxy reverso funcionando
  - Redirecciones correctas (HTTP→HTTPS, www→sin www)
  - WebSocket para chat funcionando

- [ ] **Base de datos**
  - SQLite creada y seedeada
  - Datos de prueba disponibles
  - Backups automáticos configurados

- [ ] **Seguridad**
  - Security Group configurado
  - Firewall UFW activo
  - Fail2Ban configurado
  - SSH protegido (solo clave, no password)

- [ ] **Monitoreo**
  - Health check ejecutándose
  - Logs rotando correctamente
  - Alertas configuradas (opcional)

- [ ] **Funcionalidades probadas**
  - [ ] Registro de usuario
  - [ ] Login (admin y usuario normal)
  - [ ] Ver coches
  - [ ] Ver circuitos
  - [ ] Crear reserva
  - [ ] Dashboard
  - [ ] Panel de admin
  - [ ] Chat en tiempo real

---

## 📊 URLs FINALES

### Con dominio personalizado:
```
🌐 Frontend:          https://gt-turing.com
📱 Frontend (www):    https://www.gt-turing.com (redirige a sin www)
🔧 API:               https://gt-turing.com/api
📚 Swagger:           https://gt-turing.com/swagger
💬 WebSocket Chat:    wss://gt-turing.com/ws
```

### Sin dominio (solo IP):
```
🌐 Frontend:          http://54.83.171.149:3000
🔧 API:               http://54.83.171.149:5021/api
📚 Swagger:           http://54.83.171.149:5021/swagger
```

### Acceso SSH:
```bash
ssh -i ~/.ssh/labsuser.pem ubuntu@54.83.171.149
```

---

## 🆘 COMANDOS ÚTILES DE REFERENCIA RÁPIDA

### Servicios:
```bash
# Ver estado de todos los servicios
sudo systemctl status gt-turing-backend gt-turing-frontend nginx

# Reiniciar todo
sudo systemctl restart gt-turing-backend gt-turing-frontend nginx

# Ver logs en tiempo real
sudo journalctl -u gt-turing-backend -f
sudo journalctl -u gt-turing-frontend -f
sudo tail -f /var/log/nginx/error.log
```

### Base de datos:
```bash
# Ver tablas
sqlite3 /var/www/gt-turing-backend/gt_turing.db ".tables"

# Ver usuarios
sqlite3 /var/www/gt-turing-backend/gt_turing.db "SELECT * FROM Users;"

# Backup manual
cp /var/www/gt-turing-backend/gt_turing.db ~/backup_$(date +%Y%m%d).db
```

### Actualizar código:
```bash
# Pull cambios
cd /var/www/proyectosintegrados-Juanjotg65
git pull origin main

# Backend
cd gt-turing-backend/gt-turing-backend
dotnet publish -c Release -o /var/www/gt-turing-backend
sudo systemctl restart gt-turing-backend

# Frontend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
npm install
npm run build
sudo systemctl restart gt-turing-frontend
```

### Nginx:
```bash
# Probar configuración
sudo nginx -t

# Recargar sin downtime
sudo systemctl reload nginx

# Ver sitios activos
ls -la /etc/nginx/sites-enabled/
```

### Certificados SSL:
```bash
# Ver certificados
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Probar renovación
sudo certbot renew --dry-run
```

### Monitoreo:
```bash
# Uso de recursos
htop

# Espacio en disco
df -h

# Memoria
free -h

# Procesos de la app
ps aux | grep -E 'dotnet|node|nginx'

# Conexiones activas
sudo netstat -tulpn | grep -E '3000|5021|80|443'
```

---

## 🎓 PRÓXIMOS PASOS RECOMENDADOS

### Para mejorar el proyecto:

1. **CDN (CloudFront):**
   - Configurar AWS CloudFront para servir assets estáticos
   - Mejorar velocidad de carga global

2. **Base de datos externa:**
   - Migrar de SQLite a PostgreSQL en AWS RDS
   - Mayor rendimiento y escalabilidad

3. **CI/CD:**
   - GitHub Actions para deploy automático
   - Tests automáticos antes de desplegar

4. **Monitoreo avanzado:**
   - AWS CloudWatch para métricas
   - Alertas por email/SMS

5. **Auto-scaling:**
   - Load Balancer con múltiples instancias
   - Escalar automáticamente según tráfico

6. **Docker:**
   - Containerizar la aplicación
   - Facilitar deployments

7. **Staging environment:**
   - Crear un entorno de pruebas separado
   - Probar antes de producción

---

**Autor:** GT-TURING Team  
**Fecha:** Diciembre 2025  
**Versión:** 2.0  
**Última actualización:** Configuración completa con dominio y SSL
