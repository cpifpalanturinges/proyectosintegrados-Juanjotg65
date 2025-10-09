# GT-TURING 🏎️

**Plataforma de alquiler de coches de competición y drift en circuitos españoles**

**Competition and Drift Car Rental Platform for Spanish Circuits**

---

## 📋 Descripción / Description

**ES:** GT-TURING es una plataforma web completa para el alquiler de coches de competición y drift en los principales circuitos españoles. Ofrece una experiencia de usuario moderna con gestión de reservas, chat en tiempo real, y panel de administración completo.

**EN:** GT-TURING is a comprehensive web platform for renting competition and drift cars at major Spanish circuits. It offers a modern user experience with reservation management, real-time chat, and complete administration panel.

---

## ✨ Características Principales / Main Features

### 🔐 Autenticación y Autorización / Authentication & Authorization
- ✅ Sistema JWT con roles (Visitor, User, Admin)
- ✅ Registro e inicio de sesión seguro
- ✅ Protección de rutas por rol
- ✅ Gestión de sesiones y tokens

### 🏁 Gestión de Circuitos / Circuit Management
- ✅ 8+ circuitos españoles pre-cargados
- ✅ Filtrado por provincia, superficie, longitud
- ✅ CRUD completo para administradores
- ✅ Información detallada de cada circuito

### 🚗 Catálogo de Coches / Car Catalog
- ✅ 15+ coches de competición y drift
- ✅ Filtros por tipo, potencia, precio
- ✅ Estados: Disponible, Alquilado, Mantenimiento
- ✅ Gestión completa desde panel admin

### 📅 Sistema de Reservas / Reservation System
- ✅ Calendario de disponibilidad
- ✅ Cálculo automático de precios
- ✅ Validación de fechas y conflictos
- ✅ Gestión de estados de reserva

### 💬 Chat en Tiempo Real / Real-time Chat
- ✅ SignalR para comunicación instantánea
- ✅ Conversaciones usuario-administrador
- ✅ Historial de mensajes
- ✅ Indicadores de lectura y escritura

### 👥 Gestión de Usuarios / User Management
- ✅ Panel admin para gestión de usuarios
- ✅ Asignación y cambio de roles
- ✅ Bloqueo/desbloqueo de cuentas
- ✅ Estadísticas de usuario

### 📊 API REST Completa / Complete REST API
- ✅ Documentación Swagger/OpenAPI
- ✅ Endpoints para todas las entidades
- ✅ Validación de datos
- ✅ Manejo de errores robusto

---

## 🛠️ Tecnologías / Technologies

### Backend
- **Framework:** ASP.NET Core 8.0
- **ORM:** Entity Framework Core
- **Database:** SQL Server (LocalDB)
- **Authentication:** JWT Bearer Tokens
- **Real-time:** SignalR
- **API Documentation:** Swashbuckle (Swagger)
- **Password Hashing:** BCrypt.Net

### Frontend
- **Framework:** Next.js 15.5
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Library:** React 19
- **State Management:** Context API
- **HTTP Client:** Fetch API / Axios
- **Real-time:** SignalR Client

---

## 📂 Estructura del Proyecto / Project Structure

```
proyectosintegrados-Juanjotg65/
│
├── gt-turing/                          # Frontend Next.js
│   ├── src/
│   │   ├── app/                        # App Router pages
│   │   ├── components/                 # React components
│   │   ├── contexts/                   # Context providers
│   │   ├── lib/                        # Utilities
│   │   └── styles/                     # Global styles
│   ├── public/                         # Static assets
│   └── package.json
│
├── gt-turing-backend/                  # Backend ASP.NET Core
│   └── gt-turing-backend/
│       ├── Controllers/                # API Controllers
│       │   ├── AuthController.cs
│       │   ├── CarsController.cs
│       │   ├── CircuitsController.cs
│       │   ├── ReservationsController.cs
│       │   ├── ChatController.cs
│       │   └── UsersController.cs
│       ├── Models/                     # Entity models
│       │   ├── User.cs
│       │   ├── Car.cs
│       │   ├── Circuit.cs
│       │   ├── Reservation.cs
│       │   ├── Conversation.cs
│       │   └── Message.cs
│       ├── DTO/                        # Data Transfer Objects
│       ├── Data/                       # DbContext & Seeder
│       │   ├── AppDbContext.cs
│       │   └── DbSeeder.cs
│       ├── Services/                   # Business logic
│       │   ├── AuthService.cs
│       │   └── JwtService.cs
│       ├── Hubs/                       # SignalR Hubs
│       │   └── ChatHub.cs
│       └── Program.cs                  # App configuration
│
└── DATABASE_SCHEMA.md                  # Database documentation
```

---

## 🚀 Instalación y Configuración / Installation & Setup

### Prerrequisitos / Prerequisites

```bash
# .NET 8.0 SDK
https://dotnet.microsoft.com/download/dotnet/8.0

# Node.js 18+ y npm
https://nodejs.org/

# SQL Server LocalDB (incluido con Visual Studio)
https://learn.microsoft.com/sql/database-engine/configure-windows/sql-server-express-localdb
```

### Backend Setup

```bash
# Navegar al directorio del backend
cd gt-turing-backend/gt-turing-backend

# Restaurar paquetes NuGet
dotnet restore

# Aplicar migraciones (opcional, se crea automáticamente)
dotnet ef database update

# Ejecutar el backend
dotnet run

# El servidor estará disponible en:
# https://localhost:7XXX (HTTPS)
# http://localhost:5XXX (HTTP)
# Swagger: https://localhost:7XXX/swagger
```

### Frontend Setup

```bash
# Navegar al directorio del frontend
cd gt-turing

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# El frontend estará disponible en:
# http://localhost:3000
```

---

## 🔑 Credenciales de Prueba / Test Credentials

### Administrador / Administrator
```
Email: admin@gt-turing.com
Password: Admin123!
```

### Usuarios de Prueba / Test Users
```
Email: juan@test.com
Password: Test123!

Email: maria@test.com
Password: Test123!
```

---

## 📡 API Endpoints

### Authentication
```http
POST   /api/auth/login          # Iniciar sesión
POST   /api/auth/register       # Registrarse
GET    /api/auth/me             # Usuario actual
POST   /api/auth/refresh        # Refrescar token
```

### Cars
```http
GET    /api/cars                # Listar coches (con filtros)
GET    /api/cars/{id}           # Obtener coche
POST   /api/cars                # Crear coche (Admin)
PUT    /api/cars/{id}           # Actualizar coche (Admin)
DELETE /api/cars/{id}           # Eliminar coche (Admin)
```

### Circuits
```http
GET    /api/circuits            # Listar circuitos (con filtros)
GET    /api/circuits/{id}       # Obtener circuito
POST   /api/circuits            # Crear circuito (Admin)
PUT    /api/circuits/{id}       # Actualizar circuito (Admin)
DELETE /api/circuits/{id}       # Eliminar circuito (Admin)
```

### Reservations
```http
GET    /api/reservations        # Listar reservas
GET    /api/reservations/{id}   # Obtener reserva
POST   /api/reservations        # Crear reserva
PUT    /api/reservations/{id}   # Actualizar reserva
DELETE /api/reservations/{id}   # Cancelar reserva
```

### Chat
```http
GET    /api/chat/conversations                 # Listar conversaciones
GET    /api/chat/conversations/{id}            # Obtener conversación
POST   /api/chat/conversations                 # Crear conversación
PATCH  /api/chat/conversations/{id}/status     # Actualizar estado (Admin)
GET    /api/chat/messages                      # Listar mensajes
POST   /api/chat/messages                      # Enviar mensaje
PATCH  /api/chat/messages/{id}/read            # Marcar como leído
```

### Users (Admin Only)
```http
GET    /api/users               # Listar usuarios
GET    /api/users/{id}          # Obtener usuario
PUT    /api/users/{id}          # Actualizar usuario
PATCH  /api/users/{id}/role     # Cambiar rol
PATCH  /api/users/{id}/block    # Bloquear/desbloquear
DELETE /api/users/{id}          # Eliminar usuario
GET    /api/users/{id}/stats    # Estadísticas de usuario
```

### SignalR Hub
```
WS  /hubs/chat                  # Chat en tiempo real
```

---

## 🗄️ Modelo de Datos / Data Model

### Entidades Principales / Main Entities

- **User** - Usuarios del sistema
- **Car** - Coches de competición y drift
- **Circuit** - Circuitos españoles
- **Reservation** - Reservas de coches
- **Conversation** - Conversaciones de chat
- **Message** - Mensajes del chat

Ver `DATABASE_SCHEMA.md` para el diagrama completo E/R.

---

## 🎨 Diseño / Design

### Paleta de Colores / Color Palette
- **Blanco/White:** #FFFFFF (fondo principal)
- **Azul/Blue:** #0066CC, #004C99 (primario)
- **Negro/Black:** #000000, #1a1a1a (texto, contraste)

### Tipografía / Typography
- **Títulos:** Inter, sans-serif
- **Cuerpo:** Inter, sans-serif
- **Monoespaciada:** JetBrains Mono

---

## 🔒 Seguridad / Security

✅ Autenticación JWT con expiración de 24h
✅ Hashing de contraseñas con BCrypt
✅ Validación de datos en cliente y servidor
✅ Protección CSRF mediante tokens
✅ CORS configurado para frontend específico
✅ HTTPS en producción
✅ Roles y permisos granulares

---

## 📦 Despliegue / Deployment

### Desarrollo / Development
```bash
# Backend
cd gt-turing-backend/gt-turing-backend
dotnet run

# Frontend
cd gt-turing
npm run dev
```

### Producción / Production

#### Backend (AWS EC2)
```bash
# Publicar aplicación
dotnet publish -c Release -o ./publish

# Copiar a servidor
scp -r ./publish/* ec2-user@your-server:/var/www/gt-turing-api

# Configurar como servicio systemd
sudo systemctl start gt-turing-api
sudo systemctl enable gt-turing-api
```

#### Frontend (Vercel/AWS)
```bash
# Build de producción
npm run build

# Deploy a Vercel
vercel --prod

# O deploy manual
npm run start
```

---

## 🧪 Testing

```bash
# Backend tests
cd gt-turing-backend/gt-turing-backend.Tests
dotnet test

# Frontend tests
cd gt-turing
npm run test
```

---

## 📚 Documentación Adicional / Additional Documentation

- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Esquema completo de base de datos
- [Swagger UI](https://localhost:7XXX/swagger) - Documentación interactiva de API
- [Normativa TFG.pdf](Normativa%20TFG.pdf) - Requisitos del proyecto

---

## 🤝 Contribución / Contributing

Este proyecto es parte de un TFG (Trabajo de Fin de Grado). Para contribuciones:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia / License

Este proyecto es académico y está desarrollado para fines educativos.

---

## 👨‍💻 Autor / Author

**Proyecto GT-TURING**
- Repositorio: cpifpalanturinges/proyectosintegrados-Juanjotg65
- Email: contact@gt-turing.com

---

## 🙏 Agradecimientos / Acknowledgments

- Circuitos españoles por inspiración
- Comunidad de motorsport
- Profesores y tutores del proyecto

---

## 📞 Soporte / Support

Para preguntas o soporte:
- 📧 Email: admin@gt-turing.com
- 💬 Chat en la plataforma (usuarios registrados)
- 🐛 Issues: GitHub repository

---

**¡Disfruta de GT-TURING! 🏁**
