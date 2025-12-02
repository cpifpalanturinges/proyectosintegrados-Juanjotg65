# ✅ Checklist de Despliegue - GT-TURING

## Pre-Despliegue

### Configuración Local
- [ ] Código actualizado desde Git (`git pull`)
- [ ] Frontend compila sin errores (`cd gt-turing && npm run build`)
- [ ] Backend compila sin errores (`cd gt-turing-backend/gt-turing-backend && dotnet build`)
- [ ] Tests pasan correctamente (si existen)
- [ ] `.gitignore` excluye archivos `.env*`

### Archivos de Configuración
- [ ] `.env.local` existe con `NEXT_PUBLIC_API_URL=http://localhost:5021`
- [ ] `.env.production` creado (se actualizará con IP de AWS)
- [ ] `.env.example` existe como plantilla
- [ ] `appsettings.json` configurado para desarrollo
- [ ] `appsettings.Production.json` creado (se actualizará con IP de AWS)

## AWS Setup

### Cuenta y Permisos
- [ ] Cuenta AWS creada
- [ ] Método de pago configurado
- [ ] Acceso a consola AWS verificado

### EC2 Instance
- [ ] Security Group creado con puertos:
  - [ ] 22 (SSH)
  - [ ] 80 (HTTP)
  - [ ] 443 (HTTPS)
  - [ ] 3000 (Next.js)
  - [ ] 5021 (API .NET)
- [ ] Instancia EC2 lanzada (t2.medium Ubuntu 22.04)
- [ ] Key Pair (.pem) descargado y guardado
- [ ] Elastic IP asignada a la instancia
- [ ] **IP Elástica obtenida: ________________**

### Conexión SSH
- [ ] Conexión SSH exitosa a la instancia
- [ ] Usuario `ubuntu` verificado

## Configuración del Servidor

### Sistema Base
- [ ] Sistema actualizado (`sudo apt update && sudo apt upgrade -y`)
- [ ] Git instalado
- [ ] Nginx instalado
- [ ] Repositorio clonado en `/var/www/`

### .NET 8
- [ ] .NET 8 SDK instalado
- [ ] Verificado con `dotnet --version`

### Node.js 20
- [ ] Node.js 20 instalado
- [ ] npm verificado con `npm --version`

## Actualizar Configuraciones con IP

### Frontend
- [ ] `.env.production` actualizado:
  ```
  NEXT_PUBLIC_API_URL=http://[TU_IP_AWS]:5021
  ```

### Backend
- [ ] `appsettings.Production.json` actualizado:
  - [ ] IP en `Cors.AllowedOrigins[0]`: `http://[TU_IP_AWS]:3000`
  - [ ] IP en `Cors.AllowedOrigins[1]`: `https://[TU_IP_AWS]`
  - [ ] Clave JWT cambiada a una nueva y segura

## Despliegue Backend

### Compilación
- [ ] Backend compilado: `dotnet publish -c Release -o ./publish`
- [ ] Archivos en carpeta `publish/` verificados

### Servicio systemd
- [ ] Archivo `gt-turing-backend.service` creado en `/etc/systemd/system/`
- [ ] Servicio habilitado: `sudo systemctl enable gt-turing-backend`
- [ ] Servicio iniciado: `sudo systemctl start gt-turing-backend`
- [ ] Estado verificado: `sudo systemctl status gt-turing-backend`
- [ ] Backend responde en `http://[IP]:5021/swagger`

### Base de Datos
- [ ] Archivo `gt_turing.db` creado automáticamente
- [ ] Permisos correctos en la DB
- [ ] Datos de prueba (admin/user) creados

## Despliegue Frontend

### Compilación
- [ ] Dependencias instaladas: `npm install --production`
- [ ] Frontend compilado: `npm run build`
- [ ] Build exitoso sin errores

### Servicio systemd
- [ ] Archivo `gt-turing-frontend.service` creado en `/etc/systemd/system/`
- [ ] Servicio habilitado: `sudo systemctl enable gt-turing-frontend`
- [ ] Servicio iniciado: `sudo systemctl start gt-turing-frontend`
- [ ] Estado verificado: `sudo systemctl status gt-turing-frontend`
- [ ] Frontend responde en `http://[IP]:3000`

## Nginx y HTTPS

### Nginx Básico
- [ ] Configuración Nginx creada en `/etc/nginx/sites-available/gt-turing`
- [ ] Symlink creado en `/etc/nginx/sites-enabled/`
- [ ] Configuración verificada: `sudo nginx -t`
- [ ] Nginx recargado: `sudo systemctl reload nginx`

### Certificado SSL
- [ ] Certificado autofirmado creado
- [ ] Configuración HTTPS en Nginx
- [ ] Redirección HTTP → HTTPS configurada
- [ ] HTTPS funciona en `https://[IP]`

## Verificación Final

### Conectividad
- [ ] Frontend accesible: `http://[IP]:3000`
- [ ] Backend API accesible: `http://[IP]:5021/swagger`
- [ ] HTTPS accesible: `https://[IP]`

### Funcionalidades
- [ ] Página de inicio carga correctamente
- [ ] Ver coches disponibles
- [ ] Ver circuitos
- [ ] Login funciona
- [ ] Register funciona
- [ ] Dashboard de usuario accesible
- [ ] Admin panel funciona (login como admin)
- [ ] Chat funciona (WebSocket)
- [ ] Crear reserva funciona

### Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] Imágenes cargan correctamente
- [ ] Sin errores 404 en consola
- [ ] Sin errores CORS

## Monitoreo

### Logs
- [ ] Ver logs backend: `sudo journalctl -u gt-turing-backend -f`
- [ ] Ver logs frontend: `sudo journalctl -u gt-turing-frontend -f`
- [ ] Ver logs Nginx: `sudo tail -f /var/log/nginx/error.log`

### Estado de Servicios
```bash
# Verificar todos los servicios
sudo systemctl status gt-turing-backend
sudo systemctl status gt-turing-frontend
sudo systemctl status nginx
```

## Post-Despliegue

### Seguridad
- [ ] Cambiar clave JWT en `appsettings.Production.json`
- [ ] Cambiar contraseñas de usuarios de prueba
- [ ] Revisar reglas del Security Group
- [ ] Considerar configurar firewall UFW adicional

### Respaldo
- [ ] Hacer snapshot de la instancia EC2
- [ ] Respaldar archivo `gt_turing.db`
- [ ] Documentar configuraciones específicas

### Dominio (Opcional)
- [ ] Comprar dominio
- [ ] Configurar DNS apuntando a IP Elástica
- [ ] Actualizar Nginx con nombre de dominio
- [ ] Actualizar CORS con nombre de dominio
- [ ] Obtener certificado SSL real (Let's Encrypt)

## Actualizaciones Futuras

### Proceso de Actualización
1. [ ] SSH a la instancia
2. [ ] Navegar a `/var/www/proyectosintegrados-Juanjotg65`
3. [ ] Hacer `git pull`
4. [ ] Backend: `cd gt-turing-backend/gt-turing-backend && dotnet publish -c Release -o ./publish`
5. [ ] Frontend: `cd gt-turing && npm install && npm run build`
6. [ ] Reiniciar servicios:
   ```bash
   sudo systemctl restart gt-turing-backend
   sudo systemctl restart gt-turing-frontend
   ```
7. [ ] Verificar funcionamiento

## Contactos y Referencias

### Documentación
- [ ] `DESARROLLO_LOCAL.md` - Guía desarrollo local
- [ ] `DESPLIEGUE_AWS.md` - Guía completa de despliegue
- [ ] `README.md` - Información general del proyecto

### Credenciales Importantes
```
AWS EC2 IP: ________________
SSH Key: ________________
Ubicación Key: ________________

Backend URL: http://[IP]:5021
Frontend URL: http://[IP]:3000
HTTPS URL: https://[IP]

Admin Email: admin@gtturing.com
Admin Password: [Cambiar después del despliegue]
```

## Problemas Comunes

### Backend no inicia
- Verificar logs: `sudo journalctl -u gt-turing-backend -f`
- Verificar puerto: `sudo netstat -tulpn | grep 5021`
- Verificar permisos DB: `ls -la /var/www/gt-turing-backend/`

### Frontend no inicia
- Verificar logs: `sudo journalctl -u gt-turing-frontend -f`
- Verificar puerto: `sudo netstat -tulpn | grep 3000`
- Verificar build: `cd /var/www/proyectosintegrados-Juanjotg65/gt-turing && ls -la .next`

### CORS Error
- Verificar `appsettings.Production.json` tiene IP correcta
- Reiniciar backend: `sudo systemctl restart gt-turing-backend`
- Ver logs de backend

### 502 Bad Gateway (Nginx)
- Backend caído: `sudo systemctl restart gt-turing-backend`
- Verificar configuración Nginx: `sudo nginx -t`
- Ver logs: `sudo tail -f /var/log/nginx/error.log`

---

**Fecha de Despliegue:** ________________  
**Desplegado por:** ________________  
**Versión:** ________________
