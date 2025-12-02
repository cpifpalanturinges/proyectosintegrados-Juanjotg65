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

**Autor:** GT-TURING Team  
**Fecha:** Diciembre 2025  
**Versión:** 1.0
