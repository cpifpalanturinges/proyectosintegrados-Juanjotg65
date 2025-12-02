# 🚀 Guía de Despliegue en AWS - GT-TURING

## Índice
1. [Configuración Previa al Despliegue](#configuración-previa-al-despliegue)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración Inicial de AWS](#configuración-inicial-de-aws)
4. [Creación de Instancia EC2](#creación-de-instancia-ec2)
5. [Configuración del Servidor](#configuración-del-servidor)
6. [Despliegue del Backend (.NET)](#despliegue-del-backend-net)
7. [Despliegue del Frontend (Next.js)](#despliegue-del-frontend-nextjs)
8. [Configuración de HTTPS](#configuración-de-https)
9. [Configuración de Base de Datos](#configuración-de-base-de-datos)
10. [Verificación Final](#verificación-final)

---

## 1. Configuración Previa al Despliegue

### ⚠️ IMPORTANTE: Actualizar antes de desplegar

Una vez obtengas tu **IP Elástica de AWS**, debes actualizar los siguientes archivos:

#### Frontend (gt-turing/)
1. **Archivo: `.env.production`**
   ```bash
   # Reemplaza PRODUCTION_IP con tu IP de AWS
   NEXT_PUBLIC_API_URL=http://TU_IP_AWS:5021
   ```

#### Backend (gt-turing-backend/gt-turing-backend/)
1. **Archivo: `appsettings.Production.json`**
   ```json
   {
     "Cors": {
       "AllowedOrigins": [
         "http://TU_IP_AWS:3000",      // ← Cambiar aquí
         "https://TU_IP_AWS",           // ← Cambiar aquí
         "http://localhost:3000"
       ]
     },
     "Jwt": {
       "Key": "CAMBIAR-ESTA-CLAVE-SECRETA-POR-UNA-MAS-SEGURA-MIN-32-CHARS"  // ← Cambiar clave JWT
     }
   }
   ```

### ✅ Checklist de Configuración

- [ ] Archivo `.env.production` actualizado con IP de AWS
- [ ] Archivo `appsettings.Production.json` actualizado con IP de AWS
- [ ] Clave JWT cambiada en producción (appsettings.Production.json)
- [ ] `.gitignore` verifica que excluye `.env*` (ya configurado)
- [ ] Código local compilado sin errores (`npm run build` en gt-turing/)
- [ ] Backend compilado sin errores (`dotnet build` en gt-turing-backend/)

---

## 2. Requisitos Previos

### Cuenta de AWS
- [ ] Cuenta de AWS creada (https://aws.amazon.com/)
- [ ] Método de pago configurado
- [ ] Acceso a la consola de AWS

### En tu equipo local
- [ ] Git instalado
- [ ] Acceso al repositorio del proyecto
- [ ] Cliente SSH (PuTTY en Windows o terminal)

---

## 2. Configuración Inicial de AWS

### 2.1 Crear un usuario IAM (Opcional pero recomendado)
```
1. Ve a IAM en la consola de AWS
2. Usuarios → Añadir usuario
3. Nombre: gt-turing-admin
4. Tipo de acceso: Consola y programático
5. Permisos: Administrador (para simplificar, en producción usar permisos específicos)
6. Guardar las credenciales de acceso
```

---

## 3. Creación de Instancia EC2

### 3.1 Crear Security Group (Grupo de Seguridad)
```
1. Ve a EC2 → Security Groups → Create security group
2. Nombre: gt-turing-sg
3. Descripción: Security group for GT-TURING application

Reglas de entrada (Inbound rules):
- SSH:      Puerto 22     | Origen: Mi IP (tu IP actual)
- HTTP:     Puerto 80     | Origen: 0.0.0.0/0 (Anywhere)
- HTTPS:    Puerto 443    | Origen: 0.0.0.0/0 (Anywhere)
- Custom:   Puerto 3000   | Origen: 0.0.0.0/0 (Frontend Next.js)
- Custom:   Puerto 5021   | Origen: 0.0.0.0/0 (Backend .NET API)

4. Click en "Create security group"
```

### 3.2 Crear Par de Claves (Key Pair)
```
1. Ve a EC2 → Key Pairs → Create key pair
2. Nombre: gt-turing-key
3. Tipo: RSA
4. Formato: .pem (para OpenSSH) o .ppk (para PuTTY)
5. Click en "Create key pair"
6. GUARDAR EL ARCHIVO .pem/.ppk - no se puede descargar de nuevo
```

### 3.3 Lanzar Instancia EC2
```
1. Ve a EC2 → Instances → Launch instances

Configuración:
- Nombre: GT-TURING-Server
- AMI: Ubuntu Server 22.04 LTS (Free tier eligible)
- Tipo de instancia: t2.medium (o t2.large si hay presupuesto)
  * t2.micro es muy limitado para .NET + Next.js
- Par de claves: gt-turing-key (el que creaste)
- Network settings:
  * VPC: default
  * Subnet: default
  * Auto-assign public IP: Enable
  * Security group: gt-turing-sg (el que creaste)
- Configure storage: 20 GB gp3 (mínimo)
- Number of instances: 1

2. Click en "Launch instance"
3. Esperar a que el estado sea "Running"
```

### 3.4 Asignar IP Elástica
```
1. Ve a EC2 → Elastic IPs → Allocate Elastic IP address
2. Click en "Allocate"
3. Selecciona la IP elástica creada
4. Actions → Associate Elastic IP address
5. Selecciona:
   - Resource type: Instance
   - Instance: GT-TURING-Server
6. Click en "Associate"
7. ANOTA LA IP ELÁSTICA (ej: 54.123.45.67)
```

---

## 4. Configuración del Servidor

### 4.1 Conectar por SSH

**Opción A: Desde PowerShell (Windows)**
```powershell
# Cambiar permisos del archivo .pem (si es necesario)
icacls "C:\ruta\a\gt-turing-key.pem" /inheritance:r
icacls "C:\ruta\a\gt-turing-key.pem" /grant:r "%username%:R"

# Conectar
ssh -i "C:\ruta\a\gt-turing-key.pem" ubuntu@TU_IP_ELASTICA
```

**Opción B: Desde PuTTY (Windows)**
```
1. Abrir PuTTY
2. Host Name: ubuntu@TU_IP_ELASTICA
3. Connection → SSH → Auth → Private key: seleccionar .ppk
4. Click en "Open"
```

### 4.2 Actualizar el Sistema
```bash
# Una vez conectado por SSH, ejecutar:
sudo apt update
sudo apt upgrade -y
```

### 4.3 Instalar Dependencias Básicas
```bash
# Git
sudo apt install git -y

# Nginx (servidor web/proxy reverso)
sudo apt install nginx -y

# Certbot (para SSL/HTTPS)
sudo apt install certbot python3-certbot-nginx -y

# Node.js 20.x (para Next.js)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verificar instalación
node --version  # Debe mostrar v20.x.x
npm --version

# .NET 8 SDK
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
sudo apt update
sudo apt install dotnet-sdk-8.0 -y

# Verificar instalación
dotnet --version  # Debe mostrar 8.0.x
```

---

## 5. Despliegue del Backend (.NET)

### 5.1 Clonar el Repositorio
```bash
cd /home/ubuntu
git clone https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65.git
cd proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend
```

### 5.2 Configurar appsettings.json
```bash
# Editar configuración de producción
sudo nano appsettings.json
```

Actualizar:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=/home/ubuntu/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend/gt_turing.db"
  },
  "Jwt": {
    "Key": "CAMBIAR_ESTA_CLAVE_POR_UNA_SEGURA_DE_AL_MENOS_32_CARACTERES",
    "Issuer": "GT-TURING",
    "Audience": "GT-TURING-Users",
    "ExpiryMinutes": 1440
  },
  "AllowedHosts": "*",
  "Urls": "http://0.0.0.0:5021"
}
```

Guardar con `Ctrl+O`, `Enter`, `Ctrl+X`

### 5.3 Compilar y Publicar
```bash
dotnet restore
dotnet publish -c Release -o /home/ubuntu/gt-turing-backend-publish
```

### 5.4 Crear Servicio Systemd para el Backend
```bash
sudo nano /etc/systemd/system/gt-turing-backend.service
```

Contenido:
```ini
[Unit]
Description=GT-TURING Backend API (.NET 8)
After=network.target

[Service]
WorkingDirectory=/home/ubuntu/gt-turing-backend-publish
ExecStart=/usr/bin/dotnet /home/ubuntu/gt-turing-backend-publish/gt-turing-backend.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=gt-turing-backend
User=ubuntu
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

Activar y iniciar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable gt-turing-backend
sudo systemctl start gt-turing-backend
sudo systemctl status gt-turing-backend

# Ver logs si hay problemas
sudo journalctl -u gt-turing-backend -f
```

---

## 6. Despliegue del Frontend (Next.js)

### 6.1 Preparar el proyecto
```bash
cd /home/ubuntu/proyectosintegrados-Juanjotg65/gt-turing
```

### 6.2 Crear archivo .env.production
```bash
nano .env.production
```

Contenido:
```env
NEXT_PUBLIC_API_URL=http://TU_IP_ELASTICA:5021
```

### 6.3 Instalar dependencias y compilar
```bash
npm install
npm run build
```

### 6.4 Crear Servicio Systemd para el Frontend
```bash
sudo nano /etc/systemd/system/gt-turing-frontend.service
```

Contenido:
```ini
[Unit]
Description=GT-TURING Frontend (Next.js)
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/proyectosintegrados-Juanjotg65/gt-turing
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Activar y iniciar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable gt-turing-frontend
sudo systemctl start gt-turing-frontend
sudo systemctl status gt-turing-frontend

# Ver logs si hay problemas
sudo journalctl -u gt-turing-frontend -f
```

---

## 7. Configuración de HTTPS

### 7.1 Configurar Nginx como Proxy Reverso
```bash
sudo nano /etc/nginx/sites-available/gt-turing
```

Contenido (sin dominio, solo IP):
```nginx
server {
    listen 80;
    server_name TU_IP_ELASTICA;

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
}
```

Activar configuración:
```bash
sudo ln -s /etc/nginx/sites-available/gt-turing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7.2 SSL con Certificado Autofirmado (Temporal)
```bash
# Generar certificado autofirmado
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/gt-turing.key \
  -out /etc/nginx/ssl/gt-turing.crt

# Durante la creación, puedes poner:
# Country: ES
# State: Andalucia
# City: Sevilla
# Organization: GT-TURING
# Common Name: TU_IP_ELASTICA
```

Actualizar configuración de Nginx para HTTPS:
```bash
sudo nano /etc/nginx/sites-available/gt-turing
```

Añadir servidor HTTPS:
```nginx
server {
    listen 443 ssl;
    server_name TU_IP_ELASTICA;

    ssl_certificate /etc/nginx/ssl/gt-turing.crt;
    ssl_certificate_key /etc/nginx/ssl/gt-turing.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

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
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name TU_IP_ELASTICA;
    return 301 https://$server_name$request_uri;
}
```

Reiniciar Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 8. Configuración de Base de Datos

### 8.1 Ejecutar Migraciones
```bash
cd /home/ubuntu/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend
dotnet ef database update

# O si ya existe la DB, solo asegurarse de que tenga datos
sudo systemctl restart gt-turing-backend
```

---

## 9. Verificación Final

### 9.1 Verificar Servicios
```bash
# Backend
curl http://localhost:5021/api/cars
sudo systemctl status gt-turing-backend

# Frontend
curl http://localhost:3000
sudo systemctl status gt-turing-frontend

# Nginx
sudo systemctl status nginx
```

### 9.2 Acceder desde el Navegador
```
HTTP:  http://TU_IP_ELASTICA
HTTPS: https://TU_IP_ELASTICA (aparecerá advertencia por certificado autofirmado)
```

### 9.3 Probar la Aplicación
1. Abrir https://TU_IP_ELASTICA
2. Aceptar el riesgo del certificado autofirmado
3. Registrar un usuario
4. Hacer login
5. Verificar que todo funciona

---

## 🔍 Comandos Útiles de Troubleshooting

```bash
# Ver logs del backend
sudo journalctl -u gt-turing-backend -f

# Ver logs del frontend
sudo journalctl -u gt-turing-frontend -f

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Reiniciar servicios
sudo systemctl restart gt-turing-backend
sudo systemctl restart gt-turing-frontend
sudo systemctl restart nginx

# Ver puertos en uso
sudo netstat -tulpn | grep LISTEN

# Ver uso de recursos
htop  # (instalar con: sudo apt install htop)
```

---

## 📝 Notas Importantes

1. **Certificado SSL**: El certificado autofirmado es temporal. Para producción, se necesitaría un dominio y Let's Encrypt.

2. **Firewall**: AWS Security Groups actúan como firewall. No hace falta configurar ufw.

3. **Actualizaciones**: Para actualizar el código:
```bash
cd /home/ubuntu/proyectosintegrados-Juanjotg65
git pull
cd gt-turing
npm run build
sudo systemctl restart gt-turing-frontend
cd ../gt-turing-backend/gt-turing-backend
dotnet publish -c Release -o /home/ubuntu/gt-turing-backend-publish
sudo systemctl restart gt-turing-backend
```

4. **Backups**: Hacer backup regular de:
   - Base de datos: `/home/ubuntu/proyectosintegrados-Juanjotg65/gt-turing-backend/gt-turing-backend/gt_turing.db`
   - Código: Ya está en GitHub

---

## ✅ Checklist Final

- [ ] Instancia EC2 creada y running
- [ ] IP elástica asignada
- [ ] Conexión SSH funcionando
- [ ] .NET 8 instalado
- [ ] Node.js 20 instalado
- [ ] Nginx instalado
- [ ] Backend desplegado y corriendo (puerto 5021)
- [ ] Frontend desplegado y corriendo (puerto 3000)
- [ ] HTTPS configurado
- [ ] Aplicación accesible desde navegador
- [ ] Login/Register funcionando
- [ ] API respondiendo correctamente

---

## 🚀 ¡Despliegue Completado!

Tu aplicación GT-TURING ahora está desplegada en AWS cumpliendo todos los requisitos de la normativa:
- ✅ Instancia EC2
- ✅ IP elástica
- ✅ Acceso SSH
- ✅ HTTPS funcionando
- ✅ Servidor web (Nginx)
- ✅ Backend (.NET) y Frontend (Next.js) integrados
