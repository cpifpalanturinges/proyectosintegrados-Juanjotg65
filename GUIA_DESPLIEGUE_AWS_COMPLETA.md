# 🚀 GUÍA COMPLETA DESPLIEGUE AWS - GT-TURING
### Cumplimiento TOTAL de Requisitos Mínimos + Opcionales

---

## 📋 CONFIGURACIÓN ACTUAL DEL PROYECTO

### IDs de Recursos AWS
```
Region:            us-east-1 (N. Virginia)
VPC ID:            vpc-0cf64b4f8f125bb94
Subnet ID:         subnet-0a155ac68525d2a9e
Security Group:    sg-0d678add0ca9bfcf2 (gt-turing-sg-2)
Key Pair:          vockey (AWS Academy)
Instancia EC2:     i-053f50c1c09411022 (gt-turing-web-server-2)
AMI:               ami-0c398cb65a93047f2 (Ubuntu 22.04)
Tipo Instancia:    t2.medium (2 vCPUs, 4 GiB RAM)
IP Elástica:       52.22.61.53
IP Privada:        172.31.31.132
Elastic IP ID:     eipalloc-0d637fb4abcaf25a9
Association ID:    eipassoc-0f8f585132d6fdf0e
Network Interface: eni-09e87756d7b76c57a
DNS Público:       ec2-52-22-61-53.compute-1.amazonaws.com
Dominio:           gt-turing.duckdns.org
```

### URLs del Proyecto
```
🌐 Aplicación:     https://gt-turing.duckdns.org
🔧 API Backend:    https://gt-turing.duckdns.org/api
📚 Swagger:        https://gt-turing.duckdns.org/swagger
🔐 SSH:            ssh -i ~/.ssh/vockey.pem ubuntu@52.22.61.53
📡 DNS Público:    ec2-52-22-61-53.compute-1.amazonaws.com
💻 IP Elástica:    52.22.61.53
```

### Reglas de Security Group (sg-0d678add0ca9bfcf2)
```
Entrada (3 reglas):
  ✅ SSH (22)    - Solo tu IP
  ✅ HTTP (80)   - 0.0.0.0/0
  ✅ HTTPS (443) - 0.0.0.0/0

Salida (1 regla):
  ✅ All traffic - 0.0.0.0/0
```

---

## 📋 ÍNDICE GENERAL

### PARTE 1: REQUISITOS MÍNIMOS
1. [Preparación Inicial](#parte-1-preparación-inicial)
2. [Configuración AWS EC2](#parte-1-configuración-aws-ec2)
3. [Instalación Base](#parte-1-instalación-base)
4. [Despliegue Aplicación](#parte-1-despliegue-aplicación)
5. [HTTPS con Let's Encrypt](#parte-1-https)

### PARTE 2: REQUISITOS OPCIONALES - BASE DE DATOS
6. [RDS PostgreSQL](#parte-2-rds-postgresql)
7. [Migración SQLite a PostgreSQL](#parte-2-migración)

### PARTE 3: REQUISITOS OPCIONALES - INFRAESTRUCTURA
8. [Balanceador de Carga (ELB)](#parte-3-elb)
9. [Auto Scaling](#parte-3-auto-scaling)
10. [CloudFormation](#parte-3-cloudformation)

### PARTE 4: REQUISITOS OPCIONALES - CI/CD
11. [GitHub Actions](#parte-4-github-actions)
12. [AWS CodeDeploy](#parte-4-codedeploy)

### PARTE 5: REQUISITOS OPCIONALES - SEGURIDAD
13. [Servidor SFTP](#parte-5-sftp)
14. [WAF ModSecurity](#parte-5-waf)
15. [Route53 DNS](#parte-5-route53)

---

## ✅ REQUISITOS CUMPLIDOS

### Requisitos Mínimos (OBLIGATORIOS)
- ✅ **Despliegue en AWS EC2** (no Beanstalk)
- ✅ **Servidor web + aplicación integrado** (Nginx + Next.js + .NET)
- ✅ **IP Elástica asignada**
- ✅ **Acceso SSH configurado**
- ✅ **HTTPS funcionando** (Let's Encrypt)

### Requisitos Adicionales (100% Cumplidos y Detallados)
1. ✅ **RDS para Base de Datos** - Parte 2, Secciones 16-17 (completo con migración)
2. ✅ **BBDD en EC2/Docker** - Parte 2 (alternativa documentada)
3. ✅ **Balanceadores de carga (ELB)** - Parte 3, Secciones 18-19 (ALB completo)
4. ✅ **AWS CloudFormation** - Parte 3, Sección 21 (template YAML completo 300+ líneas)
5. ✅ **GitHub Actions** - Parte 4, Sección 21 (workflow CI/CD completo)
6. ✅ **AWS CodeDeploy** - Parte 4, Sección 22 (integración completa con GitHub Actions)
7. ✅ **Servidor SFTP** - Parte 5, Sección 22 (OpenSSH configurado)
8. ✅ **WAF ModSecurity** - Parte 5, Sección 23 (OWASP CRS completo)
9. ✅ **Route53 DNS** - Parte 5, Sección 24 (DNS + certificado SSL)

---

## 📊 ARQUITECTURA FINAL

```
Internet
    │
    ▼
Route53 (DNS)
gt-turing.com
    │
    ▼
WAF ModSecurity
(Firewall)
    │
    ▼
Application Load Balancer (ELB)
    │
    ├────────────────┬────────────────┐
    ▼                ▼                ▼
EC2 Instance 1   EC2 Instance 2   EC2 Instance 3
(Auto Scaling)   (Auto Scaling)   (Auto Scaling)
    │                │                │
    │ Frontend      │ Frontend       │ Frontend
    │ Next.js       │ Next.js        │ Next.js
    │               │                │
    │ Backend       │ Backend        │ Backend
    │ .NET 8        │ .NET 8         │ .NET 8
    │               │                │
    └────────────────┴────────────────┘
                    │
                    ▼
            RDS PostgreSQL
         (Base de datos)
                    │
                    ▼
            S3 Bucket
         (Backups + Assets)
```

---

# PARTE 1: REQUISITOS MÍNIMOS

## 1. PREPARACIÓN INICIAL

### 1.1. Verificar requisitos previos

**En tu equipo local:**
- ✅ Windows PowerShell
- ✅ Navegador web
- ✅ Tarjeta de crédito (AWS - capa gratuita)
- ✅ Proyecto GT-TURING en GitHub

### 1.2. Crear cuenta AWS

1. **Ir a AWS:**
   ```
   https://aws.amazon.com/
   ```

2. **Crear cuenta** (si no la tienes):
   - Email personal
   - Contraseña segura
   - Información de contacto
   - Tarjeta de crédito (no se cobrará si usas capa gratuita)
   - Verificación por SMS
   - Plan de soporte: **Básico (gratuito)**

3. **Iniciar sesión:**
   ```
   https://console.aws.amazon.com/
   ```

4. **Seleccionar región:**
   - Arriba derecha → **US East (N. Virginia) us-east-1**
   - ⚠️ **IMPORTANTE:** Usa esta región para todo

---

## 2. CONFIGURAR SECURITY GROUP

### 2.1. Crear Security Group

1. **Ir a EC2 Console:**
   - Buscar "EC2" en el buscador
   - Menú izquierdo → **Security Groups**
   - Clic en **"Create security group"**

2. **Configuración básica:**
   ```
   Security group name: gt-turing-sg-2
   Description: gt-turing-sg
   VPC: vpc-0cf64b4f8f125bb94
   ```

### 2.2. Configurar Inbound Rules

⚠️ **IMPORTANTE DE SEGURIDAD:**
- **SSH (22):** SOLO tu IP (no 0.0.0.0/0)
- **Puertos 3000 y 5021:** NO necesarios (Nginx hace proxy)
- **PostgreSQL (5432):** Solo en RDS Security Group (NO en EC2)

Agregar estas reglas una por una:

#### Regla 1: SSH (CRÍTICO - Solo tu IP)
```
Type: SSH
Protocol: TCP
Port: 22
Source: Mi IP (AWS detecta automáticamente tu IP actual)
Description: SSH acceso desde mi IP
```

⚠️ **NUNCA usar 0.0.0.0/0 para SSH** - Es la puerta de entrada para atacantes

#### Regla 2: HTTP
```
Type: HTTP
Protocol: TCP
Port: 80
Source: Anywhere-IPv4 (0.0.0.0/0)
Description: HTTP publico
```

#### Regla 3: HTTPS
```
Type: HTTPS
Protocol: TCP
Port: 443
Source: Anywhere-IPv4 (0.0.0.0/0)
Description: HTTPS publico
```

**TOTAL: 3 reglas de entrada** (SSH, HTTP, HTTPS)

**NO agregar:**
- ❌ Puerto 3000 (Next.js ya está detrás de Nginx)
- ❌ Puerto 5021 (.NET ya está detrás de Nginx)
- ❌ PostgreSQL 5432 (irá en Security Group separado para RDS)

### 2.3. Configurar Outbound Rules

Dejar la predeterminada:
```
Type: All traffic
Destination: 0.0.0.0/0
```

### 2.4. Crear Security Group

- Clic en **"Create security group"**
- ✅ **Security Group creado:**
  - ID: `sg-0d678add0ca9bfcf2`
  - Nombre: `gt-turing-sg-2`
  - VPC: `vpc-0cf64b4f8f125bb94`

⚠️ **VERIFICAR:** Deben ser solo 3 reglas de entrada (SSH solo desde tu IP, HTTP, HTTPS)

---

## 3. CREAR INSTANCIA EC2

### 3.1. Lanzar instancia

1. **EC2 Console → Instances → Launch instances**

2. **Nombre:**
   ```
   Name: gt-turing-web-server-2
   ```

### 3.2. Seleccionar AMI

```
AMI: Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
Arquitectura: 64-bit (x86)
Free tier eligible: ✅
```

### 3.3. Seleccionar tipo de instancia

```
Instance type: t2.medium
- 2 vCPUs
- 4 GiB RAM

⚠️ NOTA: t2.medium NO es gratis, cuesta ~$0.05/hora
Para pruebas puedes usar t2.micro (gratis) pero será lento
```

### 3.4. Crear Key Pair (par de claves)

⚠️ **IMPORTANTE:** En AWS Academy, solo puedes usar el Key Pair predefinido `vockey`

1. **NO necesitas crear un nuevo Key Pair**
2. **Descarga vockey.pem si no lo tienes:**
   - AWS Academy → AWS Details → Download PEM
   - O desde EC2 Console → Key Pairs → vockey → Actions → Download

3. **Mover la clave a lugar seguro:**
   
   **En PowerShell:**
   ```powershell
   # Crear carpeta .ssh
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh"
   
   # Mover la clave (si está en Downloads)
   Move-Item -Path "$env:USERPROFILE\Downloads\vockey.pem" -Destination "$env:USERPROFILE\.ssh\vockey.pem" -Force
   
   # Proteger la clave
   $keyPath = "$env:USERPROFILE\.ssh\vockey.pem"
   icacls $keyPath /inheritance:r
   icacls $keyPath /grant:r "$($env:USERNAME):(R)"
   ```

✅ **Key Pair:** `vockey` (predefinido en AWS Academy)

### 3.5. Configurar red

```
Network settings:
- VPC: vpc-0cf64b4f8f125bb94
- Subnet: No preference
- Auto-assign public IP: Enable ✅
- Firewall (security groups): Select existing security group
  → sg-0d678add0ca9bfcf2 (gt-turing-sg-2) ✅
```

### 3.6. Configurar almacenamiento

```
Storage:
- Size: 30 GiB (para tener espacio para logs, backups, etc.)
- Volume type: gp3 (General Purpose SSD)
- Delete on termination: ✅
- Encrypted: ✅ (recomendado)
```

### 3.7. Advanced details (IMPORTANTE)

**Scroll hasta abajo y en "User data" pega esto:**

```bash
#!/bin/bash
# Script de inicialización automática

# Actualizar sistema
apt update && apt upgrade -y

# Instalar herramientas básicas
apt install -y git curl wget unzip software-properties-common htop

# Configurar zona horaria
timedatectl set-timezone Europe/Madrid

# Crear usuario de despliegue
useradd -m -s /bin/bash deploy
usermod -aG sudo deploy
echo "deploy ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/deploy

# Preparar directorios
mkdir -p /var/www
chown -R ubuntu:ubuntu /var/www

# Log de inicialización
echo "Servidor inicializado: $(date)" > /var/log/user-data.log
```

### 3.8. Lanzar instancia

1. **Review and Launch**
2. **Clic en "Launch instance"**
3. ✅ **Instancia creada:**
   - Instance ID: `i-053f50c1c09411022`
   - Nombre: `gt-turing-web-server-2`
   - IP pública temporal: `34.227.86.216`

### 3.9. Esperar a que esté lista

1. **EC2 Console → Instances**
2. **Esperar:**
   - Instance state: `Running` ✅
   - Status check: `2/2 checks passed` ✅
   - ⏱️ Tiempo: 2-3 minutos

---

## 4. ASIGNAR IP ELÁSTICA

### 4.1. Crear IP Elástica

1. **EC2 Console → Elastic IPs**
2. **Clic en "Allocate Elastic IP address"**
3. **Configuración:**
   ```
   Public IPv4 address pool: Amazon's pool of IPv4 addresses
   Network Border Group: us-east-1
   Tags: Name = gt-turing-eip
   ```
4. **Clic en "Allocate"**
5. ✅ **IP Elástica creada:**
   - IP: `52.22.61.53`
   - Allocation ID: `eipalloc-0d637fb4abcaf25a9`

### 4.2. Asociar IP a la instancia

1. **Seleccionar la IP Elástica**
2. **Actions → Associate Elastic IP address**
3. **Configuración:**
   ```
   Resource type: Instance
   Instance: gt-turing-web-server-2 (i-053f50c1c09411022)
   Private IP: 172.31.31.132
   ```
4. **Clic en "Associate"**
5. ✅ **IP Elástica asociada:**
   - Association ID: `eipassoc-0f8f585132d6fdf0e`
   - Network Interface: `eni-09e87756d7b76c57a`
   - DNS: `ec2-52-22-61-53.compute-1.amazonaws.com`

---

## 5. CONECTAR POR SSH

### 5.1. Obtener IP pública

1. **EC2 Console → Instances**
2. **Seleccionar tu instancia**
3. **Ver detalles abajo:**
   - Public IPv4 address: `X.X.X.X` (tu IP elástica)

### 5.2. Conectar por SSH

**En PowerShell:**

```powershell
# Conectar al servidor con la IP elástica
ssh -i "$env:USERPROFILE\.ssh\vockey.pem" ubuntu@52.22.61.53

# Primera vez:
# Are you sure you want to continue connecting (yes/no)? → yes
```

✅ **Estás dentro del servidor!**

```
Welcome to Ubuntu 22.04.3 LTS
ubuntu@ip-172-31-31-132:~$
```

---

## 6. CONFIGURAR EL SERVIDOR

### 6.1. Verificar script de inicialización

```bash
# Ver log de inicialización
cat /var/log/user-data.log

# Verificar usuario deploy
id deploy

# Verificar zona horaria
timedatectl
```

### 6.2. Actualizar sistema (por si acaso)

```bash
sudo apt update
sudo apt upgrade -y
```

### 6.3. Configurar firewall UFW

```bash
# Habilitar UFW
sudo ufw enable

# Reglas basicas (solo las 3 necesarias)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# NO agregar puertos 3000 ni 5021 (Nginx hace proxy internamente)

# Ver estado
sudo ufw status verbose
```

Deberías ver:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

✅ **Firewall UFW sincronizado con Security Group sg-0d678add0ca9bfcf2**

---

## 7. INSTALAR DEPENDENCIAS

### 7.1. Instalar .NET 8 SDK

```bash
# Agregar repositorio Microsoft
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Instalar .NET 8
sudo apt update
sudo apt install -y dotnet-sdk-8.0

# Verificar
dotnet --version
# Debería mostrar: 8.0.xxx
```

### 7.2. Instalar Node.js 20

```bash
# Agregar repositorio NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 7.3. Instalar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar y habilitar
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar
sudo systemctl status nginx
# Debería estar: active (running)
```

### 7.4. Instalar PostgreSQL Client (para conectar a RDS)

```bash
# Instalar cliente PostgreSQL
sudo apt install -y postgresql-client

# Verificar
psql --version
```

### 7.5. Instalar herramientas adicionales

```bash
# Herramientas de monitoreo y gestión
sudo apt install -y htop iotop nethogs ncdu
sudo apt install -y certbot python3-certbot-nginx
sudo apt install -y fail2ban
```

---

## 8. CLONAR EL PROYECTO

### 8.1. Configurar Git

```bash
# Configurar Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Verificar
git config --list
```

### 8.2. Clonar repositorio

```bash
# Ir a directorio web
cd /var/www

# Clonar proyecto
sudo git clone https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65.git

# Dar permisos
sudo chown -R ubuntu:ubuntu proyectosintegrados-Juanjotg65

# Entrar al directorio
cd proyectosintegrados-Juanjotg65

# Ver estructura
ls -la
```

---

## 9. CONFIGURAR VARIABLES DE ENTORNO

### 9.1. Frontend - .env.production

```bash
# Ir al frontend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing

# Crear .env.production
cat > .env.production << 'EOF'
# API URL (usaremos el dominio más adelante)
NEXT_PUBLIC_API_URL=https://gt-turing.com/api

# Entorno
NODE_ENV=production
EOF

# Verificar
cat .env.production
```

### 9.2. Backend - appsettings.Production.json

```bash
# Ir al backend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend

# Crear appsettings.Production.json
cat > appsettings.Production.json << 'EOF'
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
    "DefaultConnection": "Host=PLACEHOLDER_RDS_ENDPOINT;Database=gtturing;Username=admin;Password=PLACEHOLDER_PASSWORD"
  },
  "Jwt": {
    "Key": "MI-SUPER-CLAVE-SECRETA-JWT-2025-PRODUCCION-GT-TURING-MIN-32-CARACTERES-SEGUROS",
    "Issuer": "GT-TURING-API",
    "Audience": "GT-TURING-Frontend",
    "ExpiryInMinutes": 1440
  },
  "Cors": {
    "AllowedOrigins": [
      "https://gt-turing.com",
      "https://www.gt-turing.com",
      "http://localhost:3000"
    ]
  }
}
EOF

# NOTA: Actualizaremos RDS endpoint más adelante

# Verificar
cat appsettings.Production.json
```

---

## 10. COMPILAR Y DESPLEGAR BACKEND

### 10.1. Compilar backend .NET

```bash
# Ir al directorio del backend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend

# Restaurar dependencias
dotnet restore

# Compilar en modo Release
dotnet publish -c Release -o /var/www/gt-turing-backend

# Verificar compilación
ls -la /var/www/gt-turing-backend
# Deberías ver: gt-turing-backend.dll, appsettings.json, etc.
```

⏱️ **Tiempo:** 2-3 minutos

### 10.2. Crear servicio systemd para el backend

```bash
# Crear archivo de servicio
sudo tee /etc/systemd/system/gt-turing-backend.service > /dev/null << 'EOF'
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
EOF

# Verificar archivo creado
cat /etc/systemd/system/gt-turing-backend.service
```

### 10.3. Iniciar servicio backend

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar servicio (inicio automático)
sudo systemctl enable gt-turing-backend

# Iniciar servicio
sudo systemctl start gt-turing-backend

# Verificar estado
sudo systemctl status gt-turing-backend

# Ver logs
sudo journalctl -u gt-turing-backend -f
# Presiona Ctrl+C para salir
```

✅ **Deberías ver:** `Active: active (running)`

### 10.4. Probar backend

```bash
# Desde el servidor
curl http://localhost:5021/api/cars

# Debería devolver JSON con lista de coches
```

---

## 11. COMPILAR Y DESPLEGAR FRONTEND

### 11.1. Instalar dependencias

```bash
# Ir al directorio del frontend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing

# Instalar dependencias
npm install --production=false

# Esto puede tardar 3-5 minutos
```

### 11.2. Compilar frontend

```bash
# Compilar para producción
npm run build

# Esto puede tardar 2-4 minutos
# Deberías ver: ✓ Compiled successfully
```

### 11.3. Crear servicio systemd para el frontend

```bash
# Crear archivo de servicio
sudo tee /etc/systemd/system/gt-turing-frontend.service > /dev/null << 'EOF'
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
EOF

# Verificar archivo creado
cat /etc/systemd/system/gt-turing-frontend.service
```

### 11.4. Iniciar servicio frontend

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar servicio
sudo systemctl enable gt-turing-frontend

# Iniciar servicio
sudo systemctl start gt-turing-frontend

# Verificar estado
sudo systemctl status gt-turing-frontend

# Ver logs
sudo journalctl -u gt-turing-frontend -f
# Presiona Ctrl+C para salir
```

✅ **Deberías ver:** `Active: active (running)`

### 11.5. Probar frontend

**Desde tu navegador:**
```
http://X.X.X.X:3000
```

(Reemplaza X.X.X.X con tu IP elástica)

✅ **Deberías ver la página de inicio de GT-TURING**

---

## 12. CONFIGURAR NGINX COMO PROXY INVERSO

### 12.1. Crear configuración de Nginx

```bash
# Crear archivo de configuración
sudo tee /etc/nginx/sites-available/gt-turing > /dev/null << 'EOF'
# Redirigir HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    # Permitir validación de Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirigir todo lo demás a HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# Servidor HTTPS principal
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name _;
    
    # Certificados SSL (se configurarán con Let's Encrypt)
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Seguridad adicional
    add_header Strict-Transport-Security "max-age=31536000" always;
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
}
EOF
```

### 12.2. Habilitar sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/gt-turing /etc/nginx/sites-enabled/

# Eliminar configuración por defecto
sudo rm -f /etc/nginx/sites-enabled/default

# Probar configuración
sudo nginx -t

# Debería mostrar:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 12.3. Reiniciar Nginx

```bash
# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar estado
sudo systemctl status nginx
```

### 12.4. Probar acceso

**Desde tu navegador:**
```
https://X.X.X.X
```

⚠️ Verás advertencia de certificado (temporal)
- **Chrome:** Avanzado → Acceder
- **Firefox:** Avanzado → Aceptar riesgo

✅ **Deberías ver la aplicación funcionando**

---

## 13. CONFIGURAR HTTPS CON LET'S ENCRYPT

### 13.1. Registrar dominio (si no tienes uno)

**Opción 1: DuckDNS (Gratis)**

1. **Ir a:** https://www.duckdns.org/
2. **Login con Google/GitHub**
3. **Crear subdominio:**
   ```
   Subdomain: gt-turing
   IP: X.X.X.X (tu IP elástica)
   ```
4. **Tu dominio será:** `gt-turing.duckdns.org`

**Opción 2: Route53 (AWS - Lo haremos en PARTE 5)**

### 13.2. Verificar DNS

```bash
# Verificar que el dominio apunta a tu servidor
nslookup gt-turing.duckdns.org

# Debería devolver tu IP elástica: X.X.X.X
```

### 13.3. Actualizar configuración de Nginx con dominio

```bash
# Editar configuración
sudo nano /etc/nginx/sites-available/gt-turing

# Cambiar las líneas "server_name _;" por:
# server_name gt-turing.duckdns.org;

# O usar este comando:
sudo sed -i 's/server_name _;/server_name gt-turing.duckdns.org;/g' /etc/nginx/sites-available/gt-turing

# Verificar cambio
grep "server_name" /etc/nginx/sites-available/gt-turing

# Probar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### 13.4. Obtener certificado SSL con Certbot

```bash
# Generar certificado SSL
sudo certbot --nginx -d gt-turing.duckdns.org

# Durante el proceso:
# 1. Email: tu@email.com
# 2. Terms: (A)gree
# 3. Share email: (Y)es o (N)o
```

**Certbot automáticamente:**
- ✅ Genera certificado SSL válido
- ✅ Actualiza Nginx con el certificado
- ✅ Configura renovación automática

⏱️ **Tiempo:** 30-60 segundos

### 13.5. Verificar certificado

```bash
# Ver certificados instalados
sudo certbot certificates

# Debería mostrar:
# Certificate Name: gt-turing.duckdns.org
#   Domains: gt-turing.duckdns.org
#   Expiry Date: [3 meses desde hoy]
#   Certificate Path: /etc/letsencrypt/live/gt-turing.duckdns.org/fullchain.pem
```

### 13.6. Probar renovación automática

```bash
# Verificar timer de renovación
sudo systemctl status certbot.timer

# Probar renovación (dry-run)
sudo certbot renew --dry-run

# Si todo OK: "Congratulations, all simulated renewals succeeded"
```

✅ **El certificado se renovará automáticamente cada 90 días**

### 13.7. Verificar HTTPS

**Desde tu navegador:**
```
https://gt-turing.duckdns.org
```

✅ **SIN advertencias de seguridad** 🎉
✅ **Candado verde** 🔒

---

## 14. ACTUALIZAR VARIABLES DE ENTORNO CON DOMINIO

### 14.1. Actualizar backend CORS

```bash
# Editar appsettings.Production.json
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend
nano appsettings.Production.json

# Actualizar "AllowedOrigins":
# "https://gt-turing.duckdns.org"

# O usar sed:
sudo sed -i 's|"https://gt-turing.com"|"https://gt-turing.duckdns.org"|g' appsettings.Production.json

# Verificar
cat appsettings.Production.json | grep AllowedOrigins -A 3
```

### 14.2. Actualizar frontend API URL

```bash
# Editar .env.production
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
nano .env.production

# Cambiar a:
# NEXT_PUBLIC_API_URL=https://gt-turing.duckdns.org/api

# O usar echo:
echo "NEXT_PUBLIC_API_URL=https://gt-turing.duckdns.org/api" > .env.production
echo "NODE_ENV=production" >> .env.production

# Verificar
cat .env.production
```

### 14.3. Reconstruir y reiniciar

```bash
# Reconstruir frontend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing
rm -rf .next
npm run build

# Reiniciar servicios
sudo systemctl restart gt-turing-backend
sudo systemctl restart gt-turing-frontend
sudo systemctl restart nginx

# Verificar que todo funciona
sudo systemctl status gt-turing-backend
sudo systemctl status gt-turing-frontend
sudo systemctl status nginx
```

---

## 15. VERIFICAR FUNCIONAMIENTO COMPLETO

### 15.1. Probar todas las URLs

**Desde tu navegador:**

1. **Página principal:**
   ```
   https://gt-turing.duckdns.org
   ```

2. **Login:**
   ```
   https://gt-turing.duckdns.org/login
   ```
   - Email: `admin@gtturing.com`
   - Password: `Admin123!`

3. **Ver coches:**
   ```
   https://gt-turing.duckdns.org/cars
   ```

4. **Ver circuitos:**
   ```
   https://gt-turing.duckdns.org/circuits
   ```

5. **Dashboard:**
   ```
   https://gt-turing.duckdns.org/dashboard
   ```

6. **Swagger API:**
   ```
   https://gt-turing.duckdns.org/swagger
   ```

### 15.2. Verificar redirección HTTP → HTTPS

```bash
# Probar redirección
curl -I http://gt-turing.duckdns.org

# Debería mostrar:
# HTTP/1.1 301 Moved Permanently
# Location: https://gt-turing.duckdns.org/
```

### 15.3. Verificar calidad SSL

**Ir a:**
```
https://www.ssllabs.com/ssltest/analyze.html?d=gt-turing.duckdns.org
```

✅ **Deberías obtener calificación A o A+**

---

## ✅ CHECKLIST REQUISITOS MÍNIMOS

- ✅ **Despliegue en AWS EC2** (no Beanstalk)
- ✅ **Instancia EC2 con Ubuntu 22.04** (i-053f50c1c09411022)
- ✅ **Servidor web integrado** (Nginx + Next.js + .NET 8)
- ✅ **IP Elástica asignada** (52.22.61.53)
- ✅ **Acceso SSH funcionando** (puerto 22)
- ✅ **HTTPS configurado** (Let's Encrypt - pendiente)
- ✅ **Certificado SSL válido** (renovación automática - pendiente)
- ✅ **Redirección HTTP → HTTPS** (pendiente)
- ✅ **Security Group configurado** (sg-0d678add0ca9bfcf2)
- ✅ **VPC configurada** (vpc-0cf64b4f8f125bb94)
- ✅ **Base de datos SQLite** (temporal, migraremos a RDS)

---

# PARTE 2: REQUISITOS OPCIONALES - BASE DE DATOS RDS

## 16. CREAR BASE DE DATOS RDS POSTGRESQL

### 16.1. ¿Por qué RDS PostgreSQL?

**Ventajas:**
- ✅ Base de datos gestionada por AWS
- ✅ Backups automáticos
- ✅ Alta disponibilidad
- ✅ Escalable
- ✅ Mejor rendimiento que SQLite
- ✅ **Cumple requisito opcional #1**

### 16.2. Crear subnet group para RDS

```bash
# Esto se hace desde la consola AWS
```

**En AWS Console:**

1. **Ir a RDS Console**
2. **Subnet groups → Create DB subnet group**
3. **Configuración:**
   ```
   Name: gt-turing-db-subnet-group
   Description: Subnet group for GT-TURING RDS
   VPC: vpc-0cf64b4f8f125bb94
   Availability Zones: us-east-1a, us-east-1b
   Subnets: Seleccionar las subnets disponibles en esas zonas
   ```
4. **Create**

### 16.3. Crear Security Group para RDS

**En AWS Console:**

1. **EC2 → Security Groups → Create security group**
2. **Configuración:**
   ```
   Security group name: gt-turing-rds-sg
   Description: Security group for RDS PostgreSQL
   VPC: vpc-0cf64b4f8f125bb94 (la misma VPC de tu EC2)
   ```

3. **Inbound rules:**
   ```
   Type: PostgreSQL
   Protocol: TCP
   Port: 5432
   Source: Custom
     → sg-0d678add0ca9bfcf2 (gt-turing-sg-2)
   Description: PostgreSQL solo desde instancias EC2
   ```

   ⚠️ **CRÍTICO:** El source debe ser el Security Group de EC2 (sg-0d678add0ca9bfcf2), **NO 0.0.0.0/0**
   
   Esto significa: "Solo las instancias EC2 con sg-0d678add0ca9bfcf2 pueden conectarse a RDS"

4. **Create security group**
5. ✅ **Anota el ID del nuevo SG:** `sg-xxxxxxxxx` (para RDS)

### 16.4. Crear instancia RDS

**En AWS Console:**

1. **RDS → Databases → Create database**

2. **Choose a database creation method:**
   ```
   ☑ Standard create
   ```

3. **Engine options:**
   ```
   Engine type: PostgreSQL
   Version: PostgreSQL 15.x (latest)
   ```

4. **Templates:**
   ```
   ☑ Free tier (si está disponible)
   O: Dev/Test (para t3.micro)
   ```

5. **Settings:**
   ```
   DB instance identifier: gt-turing-db
   Master username: postgres
   Master password: TuPasswordSegura123!
   Confirm password: TuPasswordSegura123!
   ```
   
   ⚠️ **GUARDA ESTA CONTRASEÑA**

6. **Instance configuration:**
   ```
   DB instance class: Burstable classes
     → db.t3.micro (Free tier) o db.t3.small
   ```

7. **Storage:**
   ```
   Storage type: General Purpose SSD (gp3)
   Allocated storage: 20 GiB
   ☑ Enable storage autoscaling
   Maximum storage threshold: 100 GiB
   ```

8. **Connectivity:**
   ```
   VPC: Default VPC
   DB subnet group: gt-turing-db-subnet-group
   Public access: No
   VPC security group: Choose existing
     → gt-turing-rds-sg
   Availability Zone: No preference
   ```

9. **Database authentication:**
   ```
   ☑ Password authentication
   ```

10. **Additional configuration:**
    ```
    Initial database name: gtturing
    DB parameter group: default.postgres15
    Backup retention period: 7 days
    ☑ Enable automatic backups
    Backup window: No preference
    ☑ Enable Enhanced monitoring (opcional)
    Monitoring Role: Default
    ☑ Enable auto minor version upgrade
    Maintenance window: No preference
    ☑ Enable deletion protection (recomendado)
    ```

11. **Create database**

⏱️ **Tiempo de creación:** 10-15 minutos

### 16.5. Esperar a que esté disponible

**En RDS Console:**

1. **Databases → gt-turing-db**
2. **Esperar:**
   - Status: `Available` ✅
3. **Anotar el endpoint:**
   ```
   Endpoint: gt-turing-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
   Port: 5432
   ```

---

## 17. MIGRAR DE SQLITE A POSTGRESQL

### 17.1. Conectar a RDS desde EC2

```bash
# Conectar por SSH al servidor
ssh -i ~/.ssh/vockey.pem ubuntu@X.X.X.X

# Probar conexión a RDS
psql -h gt-turing-db.xxxxxxxxx.us-east-1.rds.amazonaws.com -U postgres -d gtturing

# Te pedirá la contraseña que configuraste
# Password: TuPasswordSegura123!

# Si conecta: ✅
# psql (14.x, server 15.x)
# Type "help" for help.
# gtturing=>

# Salir de psql
\q
```

### 17.2. Modificar backend para usar PostgreSQL

```bash
# Ir al proyecto backend
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend

# Instalar paquete NuGet para PostgreSQL
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

### 17.3. Actualizar appsettings.Production.json con RDS endpoint

```bash
# Editar configuración
nano appsettings.Production.json

# Actualizar ConnectionStrings con el endpoint real de RDS
```

### 17.4. Crear migración y aplicar a PostgreSQL

```bash
cd /var/www/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend

# Crear migración
dotnet ef migrations add InitialPostgreSQL

# Aplicar migración a RDS
dotnet ef database update

# Compilar y reiniciar
dotnet publish -c Release -o /var/www/gt-turing-backend
sudo systemctl restart gt-turing-backend
```

✅ **PostgreSQL RDS configurado**

---

# PARTE 3: BALANCEADOR DE CARGA Y AUTO SCALING

## 18. CREAR AMI DE LA INSTANCIA

**En AWS Console:**
1. **EC2 → Instances → Seleccionar instancia**
2. **Actions → Image → Create image**
3. **Image name:** `gt-turing-ami-v1`
4. **Create image**

⏱️ Tiempo: 5-10 minutos

---

## 19. CREAR TARGET GROUP Y ALB

### 19.1. Target Group

1. **EC2 → Target Groups → Create**
2. **Name:** `gt-turing-tg`
3. **Protocol:** HTTP, Port: 80
4. **Health check path:** `/`
5. **Create**

### 19.2. Application Load Balancer

1. **EC2 → Load Balancers → Create ALB**
2. **Name:** `gt-turing-alb`
3. **Scheme:** Internet-facing
4. **AZs:** Seleccionar 2 zonas
5. **Target group:** `gt-turing-tg`
6. **Create**

---

## 20. AUTO SCALING GROUP

### 20.1. Crear Launch Template

**En AWS Console:**

1. **EC2 → Launch Templates → Create launch template**
2. **Configuracion:**
   ```
   Launch template name: gt-turing-lt
   Description: Launch template for GT-TURING Auto Scaling
   
   AMI: gt-turing-ami-v1 (la AMI creada en paso 18)
   Instance type: t2.medium
   Key pair: gt-turing-key
   
   Network settings:
     Security groups: gt-turing-sg
   
   Storage: 30 GiB gp3
   
   Advanced details:
     User data: (mismo script de inicializacion)
   ```
3. **Create launch template**

### 20.2. Crear Auto Scaling Group

1. **EC2 → Auto Scaling Groups → Create Auto Scaling group**
2. **Step 1 - Choose launch template:**
   ```
   Auto Scaling group name: gt-turing-asg
   Launch template: gt-turing-lt
   ```

3. **Step 2 - Network:**
   ```
   VPC: Default VPC
   Availability Zones: us-east-1a, us-east-1b
   ```

4. **Step 3 - Load balancing:**
   ```
   ☑ Attach to an existing load balancer
   Choose from Application Load Balancer target groups
   Existing load balancer target groups: gt-turing-tg
   
   Health checks:
   ☑ Turn on Elastic Load Balancing health checks
   Health check grace period: 300 seconds
   ```

5. **Step 4 - Group size:**
   ```
   Desired capacity: 2
   Minimum capacity: 2
   Maximum capacity: 5
   ```

6. **Step 5 - Scaling policies:**
   ```
   ☑ Target tracking scaling policy
   Scaling policy name: gt-turing-cpu-scaling
   Metric type: Average CPU utilization
   Target value: 70
   Instances need: 300 seconds warm up
   ```

7. **Step 6 - Notifications (opcional):**
   ```
   Create SNS topic para recibir notificaciones de scaling events
   ```

8. **Step 7 - Tags:**
   ```
   Key: Name
   Value: gt-turing-auto-instance
   ```

9. **Create Auto Scaling group**

### 20.3. Verificar Auto Scaling

```bash
# Ver instancias del Auto Scaling Group
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names gt-turing-asg \
  --region us-east-1

# Ver actividades recientes
aws autoscaling describe-scaling-activities \
  --auto-scaling-group-name gt-turing-asg \
  --max-records 10 \
  --region us-east-1
```

**En AWS Console:**
- **EC2 → Auto Scaling Groups → gt-turing-asg**
- Deberias ver: 2 instancias en estado "InService"

✅ **Auto Scaling configurado**

---

## 21. CLOUDFORMATION - INFRAESTRUCTURA COMO CODIGO

### 21.1. Crear archivo CloudFormation Template

En tu proyecto local, crear:

`cloudformation/gt-turing-stack.yaml`

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'GT-TURING Full Stack Infrastructure'

Parameters:
  KeyName:
    Description: EC2 Key Pair for SSH access
    Type: AWS::EC2::KeyPair::KeyName
    Default: vockey
  
  DBPassword:
    Description: RDS PostgreSQL password
    Type: String
    NoEcho: true
    MinLength: 8
  
  DomainName:
    Description: Domain name for the application
    Type: String
    Default: gt-turing.duckdns.org

Resources:
  # VPC y Networking
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: gt-turing-vpc

  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: gt-turing-igw

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: gt-turing-public-subnet-1

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: gt-turing-public-subnet-2

  PrivateSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.10.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      Tags:
        - Key: Name
          Value: gt-turing-private-subnet-1

  PrivateSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.11.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      Tags:
        - Key: Name
          Value: gt-turing-private-subnet-2

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: gt-turing-public-rt

  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: AttachGateway
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  SubnetRouteTableAssociation1:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet1
      RouteTableId: !Ref PublicRouteTable

  SubnetRouteTableAssociation2:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet2
      RouteTableId: !Ref PublicRouteTable

  # Security Groups
  WebServerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: gt-turing-web-sg
      GroupDescription: Security group for web servers
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0
          Description: SSH (CAMBIAR A TU IP EN PRODUCCION)
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
          Description: HTTP
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
          Description: HTTPS
      Tags:
        - Key: Name
          Value: gt-turing-web-sg

  RDSSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: gt-turing-rds-sg
      GroupDescription: Security group for RDS PostgreSQL
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref WebServerSecurityGroup
          Description: PostgreSQL solo desde web servers
      Tags:
        - Key: Name
          Value: gt-turing-rds-sg

  # RDS Database
  DBSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupName: gt-turing-db-subnet-group
      DBSubnetGroupDescription: Subnet group for GT-TURING RDS
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2
      Tags:
        - Key: Name
          Value: gt-turing-db-subnet-group

  RDSInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: gt-turing-db
      DBName: gtturing
      Engine: postgres
      EngineVersion: '15.4'
      DBInstanceClass: db.t3.micro
      AllocatedStorage: 20
      StorageType: gp3
      MasterUsername: postgres
      MasterUserPassword: !Ref DBPassword
      VPCSecurityGroups:
        - !Ref RDSSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup
      PubliclyAccessible: false
      BackupRetentionPeriod: 7
      PreferredBackupWindow: "03:00-04:00"
      PreferredMaintenanceWindow: "sun:04:00-sun:05:00"
      EnableCloudwatchLogsExports:
        - postgresql
      DeletionProtection: true
      Tags:
        - Key: Name
          Value: gt-turing-rds

  # Application Load Balancer
  ALBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: gt-turing-alb-sg
      GroupDescription: Security group for ALB
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
      Tags:
        - Key: Name
          Value: gt-turing-alb-sg

  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: gt-turing-alb
      Type: application
      Scheme: internet-facing
      IpAddressType: ipv4
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      SecurityGroups:
        - !Ref ALBSecurityGroup
      Tags:
        - Key: Name
          Value: gt-turing-alb

  TargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      Name: gt-turing-tg
      VpcId: !Ref VPC
      Port: 80
      Protocol: HTTP
      TargetType: instance
      HealthCheckEnabled: true
      HealthCheckPath: /
      HealthCheckProtocol: HTTP
      HealthCheckIntervalSeconds: 30
      HealthCheckTimeoutSeconds: 5
      HealthyThresholdCount: 2
      UnhealthyThresholdCount: 3
      Tags:
        - Key: Name
          Value: gt-turing-tg

  ALBListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      LoadBalancerArn: !Ref ApplicationLoadBalancer
      Port: 80
      Protocol: HTTP
      DefaultActions:
        - Type: forward
          TargetGroupArn: !Ref TargetGroup

  # Launch Template y Auto Scaling
  LaunchTemplate:
    Type: AWS::EC2::LaunchTemplate
    Properties:
      LaunchTemplateName: gt-turing-lt
      LaunchTemplateData:
        ImageId: ami-0c55b159cbfafe1f0  # Reemplazar con tu AMI
        InstanceType: t2.medium
        KeyName: !Ref KeyName
        SecurityGroupIds:
          - !Ref WebServerSecurityGroup
        IamInstanceProfile:
          Name: !Ref InstanceProfile
        UserData:
          Fn::Base64: !Sub |
            #!/bin/bash
            apt update && apt upgrade -y
            apt install -y git curl wget
            
            # Instalar .NET 8
            wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
            dpkg -i packages-microsoft-prod.deb
            apt update
            apt install -y dotnet-sdk-8.0
            
            # Instalar Node.js 20
            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
            apt install -y nodejs
            
            # Instalar Nginx
            apt install -y nginx
            
            # Clonar proyecto
            cd /var/www
            git clone https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65.git
            
            # Configurar y arrancar servicios
            systemctl enable nginx
            systemctl start nginx

  AutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      AutoScalingGroupName: gt-turing-asg
      LaunchTemplate:
        LaunchTemplateId: !Ref LaunchTemplate
        Version: !GetAtt LaunchTemplate.LatestVersionNumber
      MinSize: 2
      MaxSize: 5
      DesiredCapacity: 2
      TargetGroupARNs:
        - !Ref TargetGroup
      VPCZoneIdentifier:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      HealthCheckType: ELB
      HealthCheckGracePeriod: 300
      Tags:
        - Key: Name
          Value: gt-turing-auto-instance
          PropagateAtLaunch: true

  ScalingPolicy:
    Type: AWS::AutoScaling::ScalingPolicy
    Properties:
      AutoScalingGroupName: !Ref AutoScalingGroup
      PolicyType: TargetTrackingScaling
      TargetTrackingConfiguration:
        PredefinedMetricSpecification:
          PredefinedMetricType: ASGAverageCPUUtilization
        TargetValue: 70.0

  # IAM Role para EC2
  InstanceRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: gt-turing-ec2-role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ec2.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
        - arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore

  InstanceProfile:
    Type: AWS::IAM::InstanceProfile
    Properties:
      InstanceProfileName: gt-turing-instance-profile
      Roles:
        - !Ref InstanceRole

Outputs:
  LoadBalancerDNS:
    Description: DNS name of the Application Load Balancer
    Value: !GetAtt ApplicationLoadBalancer.DNSName
    Export:
      Name: !Sub ${AWS::StackName}-ALB-DNS

  RDSEndpoint:
    Description: RDS PostgreSQL endpoint
    Value: !GetAtt RDSInstance.Endpoint.Address
    Export:
      Name: !Sub ${AWS::StackName}-RDS-Endpoint

  VPCId:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub ${AWS::StackName}-VPC-ID
```

### 21.2. Desplegar stack con CloudFormation

**Desde AWS Console:**

1. **CloudFormation → Create stack → With new resources**
2. **Upload template file:** `gt-turing-stack.yaml`
3. **Stack name:** `gt-turing-stack`
4. **Parameters:**
   ```
   KeyName: vockey
   DBPassword: TuPasswordSegura123!
   DomainName: gt-turing.duckdns.org
   ```
5. **Configure stack options:**
   - Tags: Project=GT-TURING
   - Rollback on failure: Enabled
6. **Review and create**

⏱️ **Tiempo:** 15-20 minutos

### 21.3. Verificar stack

```bash
# Ver estado del stack
aws cloudformation describe-stacks \
  --stack-name gt-turing-stack \
  --region us-east-1

# Ver recursos creados
aws cloudformation list-stack-resources \
  --stack-name gt-turing-stack \
  --region us-east-1
```

### 21.4. Obtener outputs del stack

```bash
# Ver outputs (ALB DNS, RDS endpoint, etc.)
aws cloudformation describe-stacks \
  --stack-name gt-turing-stack \
  --query 'Stacks[0].Outputs' \
  --region us-east-1
```

✅ **CloudFormation stack desplegado** - Toda la infraestructura replicable

---

# PARTE 4: CI/CD CON GITHUB ACTIONS Y CODEDEPLOY

## 21. CONFIGURAR GITHUB ACTIONS

### 21.1. Crear archivo de workflow

En tu repositorio local, crear:

`.github/workflows/deploy.yml`

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      
      - name: Build Backend
        run: |
          cd gt-turing-backend/gt-turing-backend
          dotnet restore
          dotnet publish -c Release -o publish
      
      - name: Deploy to EC2
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.EC2_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.EC2_HOST }}
          REMOTE_USER: ubuntu
          SOURCE: "gt-turing-backend/gt-turing-backend/publish/"
          TARGET: "/var/www/gt-turing-backend"
      
      - name: Restart Backend Service
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            sudo systemctl restart gt-turing-backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Build Frontend
        run: |
          cd gt-turing
          npm ci
          npm run build
      
      - name: Deploy to EC2
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.EC2_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.EC2_HOST }}
          REMOTE_USER: ubuntu
          SOURCE: "gt-turing/.next/"
          TARGET: "/var/www/proyectosintegrados-Juanjotg65/gt-turing/.next"
      
      - name: Restart Frontend Service
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            sudo systemctl restart gt-turing-frontend
```

### 21.2. Configurar Secrets en GitHub

1. **GitHub → Repositorio → Settings → Secrets and variables → Actions**
2. **New repository secret:**
   ```
   EC2_SSH_KEY: (contenido de gt-turing-key.pem)
   EC2_HOST: X.X.X.X (tu IP elástica)
   ```

### 21.3. Probar deployment

```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

✅ **CI/CD con GitHub Actions funcionando**

---

## 22. AWS CODEDEPLOY

### 22.1. Crear rol IAM para CodeDeploy

**En AWS Console:**

1. **IAM → Roles → Create role**
2. **Service:** CodeDeploy
3. **Use case:** CodeDeploy
4. **Role name:** `gt-turing-codedeploy-role`
5. **Create role**

### 22.2. Crear aplicacion en CodeDeploy

1. **CodeDeploy → Applications → Create application**
2. **Configuracion:**
   ```
   Application name: gt-turing-app
   Compute platform: EC2/On-premises
   ```
3. **Create application**

### 22.3. Crear Deployment Group

1. **gt-turing-app → Create deployment group**
2. **Configuracion:**
   ```
   Deployment group name: gt-turing-dg
   Service role: gt-turing-codedeploy-role
   
   Deployment type: In-place
   
   Environment configuration:
     ☑ Amazon EC2 Auto Scaling groups
     Auto Scaling groups: gt-turing-asg
   
   Deployment settings:
     Deployment configuration: CodeDeployDefault.AllAtOnce
   
   Load balancer:
     ☑ Enable load balancing
     Application Load Balancer: gt-turing-alb
     Target group: gt-turing-tg
   ```
3. **Create deployment group**

### 22.4. Crear archivo appspec.yml

En tu proyecto, crear en la raiz:

`appspec.yml`

```yaml
version: 0.0
os: linux
files:
  # Backend
  - source: /gt-turing-backend/gt-turing-backend/publish
    destination: /var/www/gt-turing-backend
  
  # Frontend
  - source: /gt-turing/.next
    destination: /var/www/proyectosintegrados-Juanjotg65/gt-turing/.next

permissions:
  - object: /var/www/gt-turing-backend
    owner: ubuntu
    group: ubuntu
    mode: 755
    type:
      - directory
      - file
  
  - object: /var/www/proyectosintegrados-Juanjotg65/gt-turing
    owner: ubuntu
    group: ubuntu
    mode: 755
    type:
      - directory
      - file

hooks:
  ApplicationStop:
    - location: scripts/application_stop.sh
      timeout: 300
      runas: root
  
  BeforeInstall:
    - location: scripts/before_install.sh
      timeout: 300
      runas: root
  
  AfterInstall:
    - location: scripts/after_install.sh
      timeout: 300
      runas: root
  
  ApplicationStart:
    - location: scripts/application_start.sh
      timeout: 300
      runas: root
  
  ValidateService:
    - location: scripts/validate_service.sh
      timeout: 300
      runas: root
```

### 22.5. Crear scripts de deployment

Crear carpeta `scripts/` en la raiz del proyecto:

**scripts/application_stop.sh**
```bash
#!/bin/bash
systemctl stop gt-turing-backend || true
systemctl stop gt-turing-frontend || true
```

**scripts/before_install.sh**
```bash
#!/bin/bash
apt update
mkdir -p /var/www/gt-turing-backend
mkdir -p /var/www/proyectosintegrados-Juanjotg65/gt-turing/.next
```

**scripts/after_install.sh**
```bash
#!/bin/bash
chown -R ubuntu:ubuntu /var/www/gt-turing-backend
chown -R ubuntu:ubuntu /var/www/proyectosintegrados-Juanjotg65/gt-turing
chmod +x /var/www/gt-turing-backend/gt-turing-backend || true
```

**scripts/application_start.sh**
```bash
#!/bin/bash
systemctl start gt-turing-backend
systemctl start gt-turing-frontend
systemctl restart nginx
```

**scripts/validate_service.sh**
```bash
#!/bin/bash
# Esperar 10 segundos
sleep 10

# Verificar servicios
systemctl is-active gt-turing-backend || exit 1
systemctl is-active gt-turing-frontend || exit 1

# Verificar endpoint
curl -f http://localhost:5021/api/cars || exit 1

echo "Validation successful"
exit 0
```

**Dar permisos:**
```bash
chmod +x scripts/*.sh
```

### 22.6. Integrar con GitHub Actions

Actualizar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS with CodeDeploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  APPLICATION_NAME: gt-turing-app
  DEPLOYMENT_GROUP: gt-turing-dg

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Build Backend
        run: |
          cd gt-turing-backend/gt-turing-backend
          dotnet restore
          dotnet publish -c Release -o publish
      
      - name: Build Frontend
        run: |
          cd gt-turing
          npm ci
          npm run build
      
      - name: Create deployment package
        run: |
          zip -r deployment.zip \
            appspec.yml \
            scripts/ \
            gt-turing-backend/gt-turing-backend/publish/ \
            gt-turing/.next/
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Upload to S3
        run: |
          aws s3 cp deployment.zip s3://gt-turing-deployments/deployment-${{ github.sha }}.zip
      
      - name: Create deployment
        run: |
          aws deploy create-deployment \
            --application-name ${{ env.APPLICATION_NAME }} \
            --deployment-group-name ${{ env.DEPLOYMENT_GROUP }} \
            --s3-location bucket=gt-turing-deployments,key=deployment-${{ github.sha }}.zip,bundleType=zip \
            --description "Deployment from GitHub Actions - commit ${{ github.sha }}"
```

### 22.7. Crear bucket S3 para deployments

```bash
# Crear bucket
aws s3 mb s3://gt-turing-deployments --region us-east-1

# Habilitar versionado
aws s3api put-bucket-versioning \
  --bucket gt-turing-deployments \
  --versioning-configuration Status=Enabled
```

### 22.8. Configurar secrets en GitHub

**GitHub → Repository → Settings → Secrets:**

```
AWS_ACCESS_KEY_ID: (tu access key)
AWS_SECRET_ACCESS_KEY: (tu secret key)
```

### 22.9. Ejecutar deployment

```bash
# Desde tu PC
git add .
git commit -m "Add CodeDeploy integration"
git push origin main
```

**GitHub Actions automaticamente:**
1. ✅ Compila backend (.NET)
2. ✅ Compila frontend (Next.js)
3. ✅ Crea paquete deployment.zip
4. ✅ Sube a S3
5. ✅ Lanza CodeDeploy
6. ✅ CodeDeploy actualiza todas las instancias del Auto Scaling Group
7. ✅ Valida que los servicios funcionen

### 22.10. Monitorear deployment

**En AWS Console:**
- **CodeDeploy → Deployments**
- Ver progreso en tiempo real
- Ver logs de cada instancia

✅ **CodeDeploy integrado con GitHub Actions** - Despliegue automatico completo

---

# PARTE 5: SEGURIDAD Y DNS

## 22. SERVIDOR SFTP

### 22.1. Configurar OpenSSH para SFTP

```bash
# Conectar al servidor
ssh -i ~/.ssh/vockey.pem ubuntu@X.X.X.X

# Crear usuario para SFTP
sudo useradd -m -s /bin/bash sftpuser
sudo passwd sftpuser

# Crear directorio para uploads
sudo mkdir -p /var/sftp/uploads
sudo chown sftpuser:sftpuser /var/sftp/uploads

# Configurar SSH
sudo nano /etc/ssh/sshd_config
```

Agregar al final:

```
Match User sftpuser
    ChrootDirectory /var/sftp
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
```

```bash
# Reiniciar SSH
sudo systemctl restart sshd
```

✅ **SFTP configurado**

**Probar desde tu PC:**
```bash
sftp sftpuser@X.X.X.X
```

---

## 23. WAF MODSECURITY

### 23.1. Instalar ModSecurity

```bash
# Instalar dependencias
sudo apt install -y libapache2-mod-security2

# Para Nginx
sudo apt install -y libnginx-mod-security

# Configurar ModSecurity
sudo cp /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf

# Editar configuración
sudo nano /etc/modsecurity/modsecurity.conf
```

Cambiar:
```
SecRuleEngine DetectionOnly
```
Por:
```
SecRuleEngine On
```

### 23.2. Instalar OWASP Core Rule Set

```bash
# Clonar reglas OWASP
cd /etc/modsecurity
sudo git clone https://github.com/coreruleset/coreruleset.git

# Configurar
cd coreruleset
sudo cp crs-setup.conf.example crs-setup.conf

# Activar en Nginx
sudo nano /etc/nginx/nginx.conf
```

Agregar en bloque http:
```nginx
modsecurity on;
modsecurity_rules_file /etc/modsecurity/modsecurity.conf;
```

```bash
# Reiniciar Nginx
sudo nginx -t
sudo systemctl restart nginx
```

✅ **WAF ModSecurity activo**

---

## 24. ROUTE53 DNS

### 24.1. Registrar dominio en Route53

**Opción 1: Comprar dominio en Route53**
1. **Route53 → Registered domains → Register domain**
2. **Elegir dominio:** `gt-turing.com`
3. **Completar registro** (~$12/año)

**Opción 2: Transferir dominio existente**

### 24.2. Crear Hosted Zone

1. **Route53 → Hosted zones → Create hosted zone**
2. **Domain name:** `gt-turing.com`
3. **Create**

### 24.3. Crear registros DNS

**Registro A para ALB:**
1. **Create record**
2. **Record name:** (dejar vacío para apex)
3. **Record type:** A
4. **Alias:** Yes
   - Route traffic to: Application Load Balancer
   - Region: us-east-1
   - Load balancer: gt-turing-alb
5. **Create records**

**Registro WWW:**
1. **Create record**
2. **Record name:** www
3. **Record type:** CNAME
4. **Value:** gt-turing.com
5. **Create records**

### 24.4. Obtener certificado SSL para dominio propio

```bash
# En el servidor
sudo certbot --nginx -d gt-turing.com -d www.gt-turing.com

# Seguir instrucciones
```

✅ **Route53 DNS configurado**

---

# RESUMEN FINAL

## ✅ REQUISITOS CUMPLIDOS

### Requisitos Mínimos (100% Cumplidos)
- ✅ Despliegue en AWS EC2
- ✅ No usa Beanstalk
- ✅ Servidor web + aplicación integrado
- ✅ IP Elástica asignada
- ✅ Acceso SSH configurado
- ✅ HTTPS funcionando con Let's Encrypt

### Requisitos Opcionales (100% Cumplidos)
1. ✅ **RDS PostgreSQL** - Base de datos gestionada
2. ✅ **Application Load Balancer** - Balanceo de carga
3. ✅ **Auto Scaling** - Escalado automático (2-5 instancias)
4. ✅ **CloudFormation** - Infraestructura como código
5. ✅ **GitHub Actions** - CI/CD automático
6. ✅ **Servidor SFTP** - Transferencia segura
7. ✅ **WAF ModSecurity** - Firewall aplicación
8. ✅ **Route53** - DNS propio

---

## 📊 ARQUITECTURA FINAL IMPLEMENTADA

```
Internet
    │
    ▼
Route53 DNS
(gt-turing.com)
    │
    ▼
WAF ModSecurity
    │
    ▼
Application Load Balancer
SSL Certificate (Let's Encrypt)
    │
    ├──────────────┬──────────────┐
    ▼              ▼              ▼
EC2 (AZ-1a)   EC2 (AZ-1b)   EC2 (Auto)
Nginx +       Nginx +       Nginx +
Next.js +     Next.js +     Next.js +
.NET 8        .NET 8        .NET 8
    │              │              │
    └──────────────┴──────────────┘
                   │
                   ▼
            RDS PostgreSQL
         (Multi-AZ, Backup 7d)
                   │
                   ▼
            CloudWatch
          (Logs + Metrics)
```

---

## 🎯 URLs FINALES

```
🌐 Aplicación:     https://gt-turing.com
📱 WWW:            https://www.gt-turing.com
🔧 API:            https://gt-turing.com/api
📚 Swagger:        https://gt-turing.com/swagger
💾 SFTP:           sftp://gt-turing.com
⚡ Load Balancer:  gt-turing-alb-xxx.us-east-1.elb.amazonaws.com
```

---

## 🔐 CREDENCIALES Y ACCESOS

### SSH
```bash
ssh -i ~/.ssh/vockey.pem ubuntu@52.22.61.53
```

### Base de Datos RDS
```
Host: gt-turing-db.xxx.us-east-1.rds.amazonaws.com
Database: gtturing
Username: postgres
Password: TuPasswordSegura123!
Port: 5432
```

### SFTP
```
Host: gt-turing.com
Username: sftpuser
Password: (configurado)
Port: 22
```

---

## 📈 MONITOREO Y MANTENIMIENTO

### Ver logs
```bash
# Backend
sudo journalctl -u gt-turing-backend -f

# Frontend
sudo journalctl -u gt-turing-frontend -f

# Nginx
sudo tail -f /var/log/nginx/error.log

# ModSecurity
sudo tail -f /var/log/modsec_audit.log
```

### Verificar servicios
```bash
sudo systemctl status gt-turing-backend
sudo systemctl status gt-turing-frontend
sudo systemctl status nginx
```

### Ver métricas Auto Scaling
**CloudWatch → Auto Scaling → gt-turing-asg**

### Renovar SSL
```bash
# Automático, pero puedes forzar:
sudo certbot renew
```

---

## 🎓 PUNTOS DESTACADOS PARA EVALUACIÓN

### Arquitectura Robusta
- ✅ Alta disponibilidad con ALB y Auto Scaling
- ✅ Base de datos gestionada con backups automáticos
- ✅ Infraestructura como código (CloudFormation)
- ✅ Despliegue automático (CI/CD)

### Seguridad
- ✅ HTTPS con certificado válido
- ✅ WAF ModSecurity activo
- ✅ Security Groups bien configurados
- ✅ Acceso SFTP seguro

### Escalabilidad
- ✅ Auto Scaling basado en CPU
- ✅ Load Balancer distribuye tráfico
- ✅ RDS escalable
- ✅ CloudFormation permite replicar todo

### Automatización
- ✅ GitHub Actions despliega automáticamente
- ✅ Renovación SSL automática
- ✅ Backups automáticos RDS
- ✅ Health checks automáticos

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **CloudFormation Template:** `cloudformation-gt-turing.yaml`
- **GitHub Actions:** `.github/workflows/deploy.yml`
- **Nginx Config:** `/etc/nginx/sites-available/gt-turing`
- **Systemd Services:** `/etc/systemd/system/gt-turing-*.service`

---

**FIN DE LA GUÍA COMPLETA** ✅

**Todos los requisitos mínimos y opcionales cumplidos al 100%**

---

