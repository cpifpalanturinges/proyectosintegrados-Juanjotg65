# 🏎️ GT-TURING - Plataforma de Alquiler de Coches de Competición

![GT-TURING](https://img.shields.io/badge/Version-1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 📝 Descripción

**GT-TURING** es una plataforma web completa para alquiler de coches de competición y drift en circuitos españoles. Permite a los usuarios reservar experiencias de conducción deportiva en los mejores circuitos de España.

### ✨ Características Principales

- 🚗 **Catálogo de vehículos** - Coches de competición, drift e híbridos
- 🏁 **Circuitos españoles** - Barcelona-Catalunya, Jerez, Motorland Aragón, y más
- 📅 **Sistema de reservas** - Reserva online con calendario interactivo
- 👤 **Gestión de usuarios** - Registro, login, perfil de usuario
- 💬 **Chat en tiempo real** - Comunicación con administradores vía WebSocket
- 🎛️ **Panel de administración** - Gestión completa de coches, circuitos y reservas
- 🌍 **Multiidioma** - Español e Inglés
- 📱 **Responsive Design** - Diseño adaptado a todos los dispositivos
- 🔒 **Autenticación JWT** - Sistema seguro de autenticación

## 🛠️ Tecnologías

### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **UI:** React 19.1.0
- **Estilos:** Tailwind CSS 4
- **Lenguaje:** TypeScript 5
- **Estado:** Context API
- **HTTP Client:** Fetch API

### Backend
- **Framework:** .NET 8 (ASP.NET Core)
- **Lenguaje:** C#
- **Base de datos:** SQLite (Entity Framework Core)
- **Autenticación:** JWT (JSON Web Tokens)
- **Chat:** WebSocket (SignalR)
- **API:** RESTful API

## 📁 Estructura del Proyecto

```
proyectosintegrados-Juanjotg65/
├── gt-turing/                          # Frontend Next.js
│   ├── src/
│   │   ├── app/                        # App Router (páginas)
│   │   │   ├── page.tsx                # Home
│   │   │   ├── login/                  # Login
│   │   │   ├── register/               # Registro
│   │   │   ├── cars/                   # Catálogo de coches
│   │   │   ├── circuits/               # Circuitos
│   │   │   ├── reservations/           # Reservas
│   │   │   ├── dashboard/              # Dashboard usuario
│   │   │   ├── admin/                  # Panel admin
│   │   │   ├── chat/                   # Chat en tiempo real
│   │   │   ├── profile/                # Perfil usuario
│   │   │   ├── about/                  # Acerca de
│   │   │   ├── contact/                # Contacto
│   │   │   ├── faq/                    # Preguntas frecuentes
│   │   │   ├── privacy/                # Política de privacidad
│   │   │   └── terms/                  # Términos y condiciones
│   │   ├── components/                 # Componentes reutilizables
│   │   │   ├── Navbar.tsx              # Barra de navegación
│   │   │   ├── Footer.tsx              # Pie de página
│   │   │   ├── Calendar.tsx            # Calendario
│   │   │   ├── TimePicker.tsx          # Selector de hora
│   │   │   ├── DetailsModal.tsx        # Modal de detalles
│   │   │   ├── ConfirmDialog.tsx       # Diálogo de confirmación
│   │   │   └── Toast.tsx               # Notificaciones
│   │   ├── contexts/                   # Context API
│   │   │   ├── AuthContext.tsx         # Contexto de autenticación
│   │   │   └── LanguageContext.tsx     # Contexto de idioma
│   │   ├── lib/                        # Utilidades
│   │   │   ├── api-client.ts           # Cliente API
│   │   │   └── translations.ts         # Traducciones ES/EN
│   │   └── types/                      # Tipos TypeScript
│   │       └── index.ts                # Interfaces y tipos
│   ├── public/                         # Archivos estáticos
│   ├── .env.local                      # Variables de entorno (desarrollo)
│   ├── .env.production                 # Variables de entorno (producción)
│   └── package.json                    # Dependencias frontend
│
├── gt-turing-backend/                  # Backend .NET 8
│   └── gt-turing-backend/
│       ├── Controllers/                # Controladores API
│       │   ├── AuthController.cs       # Autenticación
│       │   ├── UsersController.cs      # Usuarios
│       │   ├── CarsController.cs       # Coches
│       │   ├── CircuitsController.cs   # Circuitos
│       │   ├── ReservationsController.cs # Reservas
│       │   ├── ChatController.cs       # Chat
│       │   └── UploadController.cs     # Subida de archivos
│       ├── Models/                     # Modelos de datos
│       │   ├── User.cs                 # Usuario
│       │   ├── Car.cs                  # Coche
│       │   ├── Circuit.cs              # Circuito
│       │   ├── Reservation.cs          # Reserva
│       │   ├── Conversation.cs         # Conversación
│       │   └── Message.cs              # Mensaje
│       ├── DTO/                        # Data Transfer Objects
│       ├── Data/                       # Contexto de base de datos
│       │   ├── AppDbContext.cs         # Contexto EF Core
│       │   └── DbSeeder.cs             # Datos de prueba
│       ├── Services/                   # Servicios
│       │   ├── AuthService.cs          # Servicio de autenticación
│       │   ├── JwtService.cs           # Servicio JWT
│       │   └── WebSocketChatService.cs # Servicio WebSocket
│       ├── Middleware/                 # Middleware
│       ├── Migrations/                 # Migraciones EF Core
│       ├── wwwroot/images/             # Imágenes subidas
│       ├── appsettings.json            # Configuración desarrollo
│       ├── appsettings.Production.json # Configuración producción
│       └── Program.cs                  # Punto de entrada
│
├── DESARROLLO_LOCAL.md                 # 📖 Guía desarrollo local
├── DESPLIEGUE_AWS.md                   # 📖 Guía despliegue AWS
├── GUIA_DESPLIEGUE_AWS_DETALLADA.md    # 📖 Guía detallada paso a paso
├── CHECKLIST_DESPLIEGUE.md             # ✅ Checklist de despliegue
└── README.md                           # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** 20 o superior
- **.NET SDK** 8.0 o superior
- **Git**

### Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65.git
   cd proyectosintegrados-Juanjotg65
   ```

2. **Configurar el Backend:**
   ```bash
   cd gt-turing-backend/gt-turing-backend
   dotnet restore
   dotnet run
   ```
   El backend estará en: `http://localhost:5021`

3. **Configurar el Frontend (en otra terminal):**
   ```bash
   cd gt-turing
   npm install
   npm run dev
   ```
   El frontend estará en: `http://localhost:3000`

4. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - Swagger API: http://localhost:5021/swagger

### Usuarios de Prueba

#### Administrador
- **Email:** admin@gtturing.com
- **Password:** Admin123!

#### Usuario Normal
- **Email:** user@gtturing.com
- **Password:** User123!

## 📚 Documentación

### Para Desarrollo Local
📖 **[DESARROLLO_LOCAL.md](DESARROLLO_LOCAL.md)** - Guía completa para desarrollar en local

### Para Despliegue en AWS
📖 **[GUIA_DESPLIEGUE_AWS_DETALLADA.md](GUIA_DESPLIEGUE_AWS_DETALLADA.md)** - Guía paso a paso con TODOS los detalles

📖 **[DESPLIEGUE_AWS.md](DESPLIEGUE_AWS.md)** - Resumen del proceso de despliegue

✅ **[CHECKLIST_DESPLIEGUE.md](CHECKLIST_DESPLIEGUE.md)** - Checklist interactivo

## 🔧 Configuración

### Variables de Entorno

#### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5021
```

#### Frontend Producción (`.env.production`)
```bash
NEXT_PUBLIC_API_URL=http://TU_IP_AWS:5021
```

#### Backend (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "Sqlite": "Data Source=gt_turing.db"
  },
  "Jwt": {
    "Key": "GT-TURING-2025-Super-Secret-Key-Min-32-Chars",
    "Issuer": "GT-TURING-API",
    "Audience": "GT-TURING-Frontend"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://localhost:3000"
    ]
  }
}
```

## 🎯 Funcionalidades Detalladas

### Para Usuarios

- ✅ **Registro y Login** - Crear cuenta y acceder
- ✅ **Catálogo de Coches** - Ver coches disponibles con filtros
- ✅ **Catálogo de Circuitos** - Explorar circuitos españoles
- ✅ **Sistema de Reservas** - Reservar coche + circuito + fecha/hora
- ✅ **Dashboard Personal** - Ver estadísticas y reservas activas
- ✅ **Historial de Reservas** - Ver todas las reservas pasadas
- ✅ **Chat con Admin** - Comunicación en tiempo real
- ✅ **Perfil de Usuario** - Gestionar información personal
- ✅ **Cambio de Idioma** - Español ↔ Inglés

### Para Administradores

- ✅ **Panel de Administración** - Vista general con estadísticas
- ✅ **Gestión de Coches** - CRUD completo (crear, leer, actualizar, eliminar)
- ✅ **Gestión de Circuitos** - CRUD completo
- ✅ **Gestión de Reservas** - Ver, aprobar, cancelar reservas
- ✅ **Gestión de Usuarios** - Ver lista de usuarios, cambiar roles
- ✅ **Subida de Imágenes** - Upload de imágenes para coches y circuitos
- ✅ **Chat Multiusuario** - Atender múltiples conversaciones

## 🗄️ Modelo de Datos

### Usuario (User)
- Id, Email, Password (hash), Name, Role, Phone, CreatedAt

### Coche (Car)
- Id, Brand, Model, Year, Category, Power, Price, Available, Image, Description

### Circuito (Circuit)
- Id, Name, Location, Length, Corners, Price, Available, Image, Description

### Reserva (Reservation)
- Id, UserId, CarId, CircuitId, Date, StartTime, EndTime, TotalPrice, Status

### Conversación (Conversation)
- Id, UserId, AdminId, CreatedAt, LastMessageAt, Status

### Mensaje (Message)
- Id, ConversationId, SenderId, Content, SentAt, IsRead

## 🔐 Seguridad

- **JWT Authentication** - Tokens seguros con expiración
- **Password Hashing** - BCrypt para contraseñas
- **CORS Configurado** - Protección contra cross-origin attacks
- **Role-Based Access** - Control de acceso por roles (User/Admin)
- **HTTPS Ready** - Configuración SSL/TLS para producción

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `PUT /api/users/{id}` - Actualizar usuario
- `PUT /api/users/{id}/role` - Cambiar rol (admin)

### Coches
- `GET /api/cars` - Listar coches
- `GET /api/cars/{id}` - Obtener coche
- `POST /api/cars` - Crear coche (admin)
- `PUT /api/cars/{id}` - Actualizar coche (admin)
- `DELETE /api/cars/{id}` - Eliminar coche (admin)

### Circuitos
- `GET /api/circuits` - Listar circuitos
- `GET /api/circuits/{id}` - Obtener circuito
- `POST /api/circuits` - Crear circuito (admin)
- `PUT /api/circuits/{id}` - Actualizar circuito (admin)
- `DELETE /api/circuits/{id}` - Eliminar circuito (admin)

### Reservas
- `GET /api/reservations` - Listar reservas
- `GET /api/reservations/{id}` - Obtener reserva
- `POST /api/reservations` - Crear reserva
- `PUT /api/reservations/{id}` - Actualizar reserva (admin)
- `DELETE /api/reservations/{id}` - Cancelar reserva

### Chat
- `GET /api/chat/conversations` - Listar conversaciones
- `GET /api/chat/conversations/{id}/messages` - Obtener mensajes
- `POST /api/chat/messages` - Enviar mensaje
- `WebSocket /ws/chat` - Conexión WebSocket

Ver documentación completa en: `http://localhost:5021/swagger`

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Móviles** (< 640px)
- 📱 **Tablets** (640px - 1024px)
- 💻 **Desktop** (> 1024px)

Breakpoints Tailwind:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

## 🧪 Testing

### Backend
```bash
cd gt-turing-backend/gt-turing-backend
dotnet test
```

### Frontend
```bash
cd gt-turing
npm run test
```

## 📦 Build para Producción

### Frontend
```bash
cd gt-turing
npm run build
npm start
```

### Backend
```bash
cd gt-turing-backend/gt-turing-backend
dotnet publish -c Release -o ./publish
```

## 🚀 Despliegue

### AWS EC2 (Recomendado)

Sigue la guía detallada paso a paso:
📖 **[GUIA_DESPLIEGUE_AWS_DETALLADA.md](GUIA_DESPLIEGUE_AWS_DETALLADA.md)**

**Resumen del proceso:**
1. Crear instancia EC2 Ubuntu 22.04
2. Configurar Security Groups (puertos 22, 80, 443, 3000, 5021)
3. Asignar IP Elástica
4. Instalar .NET 8 y Node.js 20
5. Clonar el repositorio
6. Configurar variables de entorno
7. Compilar backend y frontend
8. Crear servicios systemd
9. Configurar Nginx como proxy reverso
10. Configurar HTTPS con certificado SSL

**Tiempo estimado:** 1-2 horas

## 🔄 Actualizaciones

Para actualizar el código en producción:

```bash
# SSH al servidor
ssh -i ~/.ssh/gt-turing-key.pem ubuntu@TU_IP_AWS

# Actualizar código
cd /var/www/proyectosintegrados-Juanjotg65
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
```

## 🐛 Troubleshooting

### CORS Error
- Verificar que `appsettings.json` tiene la IP correcta en `AllowedOrigins`
- Reiniciar el backend: `sudo systemctl restart gt-turing-backend`

### Backend no inicia
- Ver logs: `sudo journalctl -u gt-turing-backend -f`
- Verificar puerto: `sudo netstat -tulpn | grep 5021`

### Frontend no carga
- Ver logs: `sudo journalctl -u gt-turing-frontend -f`
- Verificar build: `cd gt-turing && npm run build`

### Base de datos corrupta
```bash
cd gt-turing-backend/gt-turing-backend
rm gt_turing.db
dotnet run  # Se creará automáticamente
```

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un Proyecto Integrado de FP.

## 👨‍💻 Autor

**GT-TURING Team**
- GitHub: [@cpifpalanturinges](https://github.com/cpifpalanturinges)

## 🙏 Agradecimientos

- Next.js Team
- .NET Team
- Tailwind CSS Team
- Toda la comunidad open source

---

⭐ **Si te gusta el proyecto, dale una estrella!** ⭐

---

## 📞 Soporte

¿Tienes problemas? Consulta:
1. [DESARROLLO_LOCAL.md](DESARROLLO_LOCAL.md) - Problemas en desarrollo
2. [GUIA_DESPLIEGUE_AWS_DETALLADA.md](GUIA_DESPLIEGUE_AWS_DETALLADA.md) - Problemas en despliegue
3. Issues en GitHub

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.0.0
