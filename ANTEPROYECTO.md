# ANTEPROYECTO – GT-TURING

## Sistema de Gestión y Reservas de Circuitos y Vehículos de Competición

**Curso:** 2024/2025  
**Ciclo:** Desarrollo de Aplicaciones Web  
**Estado:** En Desarrollo

---

## AUTOR DEL PROYECTO

**Juan José Tejada Gutiérrez**  
Desarrollador Full Stack  
[Repositorio GitHub](https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65)

---

## TÍTULO DEL PROYECTO

**GT-TURING: Sistema de Gestión y Reservas de Circuitos y Vehículos de Competición**

Una plataforma web para conectar aficionados del automovilismo con circuitos y vehículos de alto rendimiento.

---

## OBJETIVOS DEL PROYECTO

### Objetivo General

Desarrollar una plataforma web completa para la gestión y reserva de circuitos automovilísticos y vehículos de competición, que permita a los usuarios explorar circuitos disponibles, consultar el catálogo de vehículos y realizar reservas de forma intuitiva, con un panel de administración, sistema de chat en tiempo real e internacionalización.

### Objetivos Específicos

- **Autenticación Segura:** Implementar sistema basado en JWT con roles diferenciados (Usuario y Administrador)
- **API REST Documentada:** Diseñar servicios completos para gestión de usuarios, vehículos, circuitos y reservas
- **Interfaz Moderna:** Crear diseño responsive e intuitivo con Next.js y Tailwind CSS
- **Chat en Tiempo Real:** Integrar comunicación instantánea mediante WebSockets (SignalR)
- **Internacionalización:** Implementar soporte para español e inglés
- **Panel de Administración:** Desarrollar gestión completa de contenidos, usuarios y reservas
- **Seguridad:** Garantizar validación de datos en frontend y backend
- **Despliegue en la Nube:** Implementar en AWS con HTTPS

---

## TEMÁTICA Y CONCEPTO

El proyecto está centrado en el mundo del motor y la competición automovilística, ofreciendo una plataforma digital donde los usuarios pueden:

- Reservar circuitos de prestigio
- Alquilar vehículos de alto rendimiento
- Gestionar reservas de forma intuitiva
- Comunicarse en tiempo real con administradores
- Acceder en español e inglés

---

## TECNOLOGÍAS UTILIZADAS

### Frontend

| Tecnología | Descripción | Versión |
|------------|-------------|---------|
| Next.js | Framework de React con App Router | 15.5.4 |
| React | Librería para construcción de interfaces | 19.1.0 |
| TypeScript | Superset tipado de JavaScript | 5 |
| Tailwind CSS | Framework de utilidades CSS | 4 |
| WebSocket | Comunicación en tiempo real | - |
</tr>
<tr>
<td>📦 <strong>Context API</strong></td>
<td>Gestión de estado global (Auth, Language)</td>
<td align="center">-</td>
</tr>
</table>

### ⚙️ **Backend - Servidor y API**

<table>
<tr>
<th width="150px">Tecnología</th>
<th>Descripción</th>
<th width="80px">Versión</th>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/.NET-512BD4?style=flat&logo=dotnet&logoColor=white" /></td>
<td>Framework web de Microsoft</td>
<td align="center">8.0</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/C%23-239120?style=flat&logo=c-sharp&logoColor=white" /></td>
<td>Lenguaje de programación principal</td>
<td align="center">12</td>
</tr>
<tr>
<td>🗄️ <strong>Entity Framework Core</strong></td>
<td>ORM para acceso a datos con migraciones</td>
<td align="center">8.0</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/SQL_Server-CC2927?style=flat&logo=microsoft-sql-server&logoColor=white" /></td>
<td>Sistema de gestión de base de datos</td>
<td align="center">-</td>
</tr>
<tr>
<td>🔐 <strong>JWT</strong></td>
<td>Autenticación sin estado con tokens Bearer</td>
<td align="center">-</td>
</tr>
<tr>
<td>📡 <strong>SignalR</strong></td>
<td>Hub de WebSocket para chat en tiempo real</td>
<td align="center">-</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black" /></td>
<td>Documentación interactiva de API (OpenAPI 3.0)</td>
<td align="center">-</td>
</tr>
</table>

### ☁️ **Infraestructura y Herramientas**

<table>
<tr>
<th width="150px">Herramienta</th>
<th>Propósito</th>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white" /></td>
<td>Despliegue en EC2 con IP elástica, HTTPS/SSL, RDS (opcional)</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white" /> / <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white" /></td>
<td>Control de versiones y repositorio privado con permisos al profesorado</td>
</tr>
<tr>
<td>💻 <strong>VS Code / Visual Studio 2022</strong></td>
<td>Entornos de desarrollo integrados</td>
</tr>
<tr>
<td>🔒 <strong>Nginx / Apache</strong></td>
<td>Reverse proxy para HTTPS y distribución de tráfico</td>
</tr>
</table>



---
| Context API | Gestión de estado global | - |

### Backend

| Tecnología | Descripción | Versión |
|------------|-------------|---------|
| C# / .NET | Framework de desarrollo backend | 8.0 |
| ASP.NET Core | API RESTful | 8.0 |
| Entity Framework Core | ORM para acceso a datos | 8.0 |
| SignalR | WebSockets para chat en tiempo real | 8.0 |
| JWT | Autenticación basada en tokens | - |
| SQLite | Base de datos durante desarrollo | - |

### Herramientas

- Git/GitHub para control de versiones
- Visual Studio Code
- Postman para pruebas de API
- Figma para diseño de interfaces

---

## ESQUEMA E/R DE LA BASE DE DATOS

### Entidades Principales

**USERS**
- Id (PK)
- FirstName
- LastName  
- Email (UNIQUE)
- Phone
- PasswordHash
- Role (User/Admin)
- IsBlocked
- CreatedAt
- UpdatedAt

**CARS**
- Id (PK)
- Brand
- Model
- Year
- Type (Racing/Drift/Hybrid)
- Power
- PricePerDay
- Status (Available/Rented/Maintenance)
- Description
- ImageUrl
- CreatedAt
- UpdatedAt

**CIRCUITS**
- Id (PK)
- Name
- Location
- Province
- LengthMeters
- WidthMeters
- SurfaceType (Asphalt/Concrete/Mixed)
- ElevationChange
- NumberOfCorners
- IsAvailable
- Description
- ImageUrl
- CreatedAt
- UpdatedAt

**RESERVATIONS**
- Id (PK)
- UserId (FK)
- CarId (FK)
- CircuitId (FK)
- StartDate
- EndDate
- PickupTime
- ReturnTime
- TotalPrice
- Status (Pending/Confirmed/Cancelled/Completed)
- CreatedAt
- UpdatedAt

**CONVERSATIONS**
- Id (PK)
- UserId (FK)
- AdminId (FK, nullable)
- Subject
- Status (Open/InProgress/Resolved/Closed)
- CreatedAt
- UpdatedAt

**MESSAGES**
- Id (PK)
- ConversationId (FK)
- SenderId (FK)
- Content
- SentAt
- IsRead
- AttachmentUrl

### Relaciones

- Users 1:N Reservations
- Users 1:N Conversations
- Users 1:N Messages
- Cars 1:N Reservations
- Circuits 1:N Reservations
- Conversations 1:N Messages

---

## FUNCIONALIDADES PRINCIPALES

### Área Pública

- Registro e inicio de sesión
- Catálogo de coches con filtros
- Catálogo de circuitos con filtros
- Sistema de reservas paso a paso
- Cambio de idioma (ES/EN)

### Área de Usuario

- Dashboard personal
- Historial de reservas
- Chat con administradores
- Gestión de perfil

### Área de Administración

- Gestión de usuarios (crear, editar, bloquear, cambiar rol)
- Gestión de coches (CRUD completo)
- Gestión de circuitos (CRUD completo)
- Gestión de reservas (aprobar, cancelar, completar)
- Gestión de conversaciones del chat
- Estadísticas del sistema

---

## JUSTIFICACIÓN DE TECNOLOGÍAS

### Backend: C# / .NET

Se ha elegido C# con ASP.NET Core por las siguientes razones:

- Rendimiento superior y tipado fuerte
- Entity Framework Core facilita el trabajo con bases de datos
- SignalR integrado para WebSockets
- Experiencia previa en el entorno de desarrollo
- Ecosistema robusto y bien documentado

### Frontend: Next.js

- Framework moderno de React con renderizado del lado del servidor
- Excelente rendimiento y SEO
- Enrutamiento integrado
- TypeScript para mayor seguridad en el desarrollo
- Tailwind CSS permite desarrollo rápido con diseño personalizado

---

## PLANIFICACIÓN Y BITÁCORA

### Fases del Proyecto

1. **Análisis y Diseño** (Semanas 1-2)
   - Diseño de base de datos
   - Diseño de interfaces en Figma
   - Definición de API REST

2. **Desarrollo Backend** (Semanas 3-5)
   - Configuración de proyecto .NET
   - Implementación de modelos y migraciones
   - Desarrollo de controladores y servicios
   - Sistema de autenticación JWT
   - Chat con SignalR

3. **Desarrollo Frontend** (Semanas 6-8)
   - Configuración de Next.js
   - Implementación de páginas y componentes
   - Integración con API
   - Internacionalización
   - Sistema de routing y protección de rutas

4. **Integración y Pruebas** (Semana 9)
   - Pruebas end-to-end
   - Corrección de errores
   - Optimización de rendimiento

5. **Despliegue** (Semana 10)
   - Configuración de AWS
   - Despliegue de backend
   - Despliegue de frontend
   - Configuración de dominio y HTTPS

### Bitácora de Tareas

| Fecha | Tarea | Estado |
|-------|-------|--------|
| 15/11/2024 | Creación de repositorio y estructura inicial | Completado |
| 18/11/2024 | Diseño de base de datos | Completado |
| 20/11/2024 | Configuración proyecto backend | Completado |
| 22/11/2024 | Implementación modelos y migraciones | Completado |
| 25/11/2024 | Sistema de autenticación | Completado |
| 27/11/2024 | Controllers CRUD básicos | Completado |
| 29/11/2024 | Configuración proyecto frontend | Completado |
| 01/12/2024 | Implementación de páginas principales | En progreso |
| 03/12/2024 | Sistema de chat con SignalR | Pendiente |

---

## BIBLIOGRAFÍA Y RECURSOS

- [Documentación oficial de .NET](https://docs.microsoft.com/dotnet/)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [SignalR Documentation](https://docs.microsoft.com/aspnet/core/signalr)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)
- [JWT Authentication](https://jwt.io/introduction)
- [MDN Web Docs](https://developer.mozilla.org/)
- Stack Overflow para resolución de problemas específicos

<td>N:1 con Conversations, Users</td>
</tr>
</table>

### 🔗 Relaciones Principales

- ✅ **1:N** entre Users y Reservations
- ✅ **1:N** entre Circuits y Reservations  
- ✅ **1:N** entre Cars y Reservations
- ✅ **1:N** entre Conversations y Messages
- ✅ **Primary Keys**: Id autoincremental en todas las tablas
- ✅ **Foreign Keys**: Relaciones con ON DELETE CASCADE/RESTRICT
- ✅ **Unique Constraints**: Email en Users
- ✅ **Indexes**: Optimización en emails, fechas y estados


---

## 📘 **ENLACES Y DOCUMENTACIÓN**

<div align="center">

### 🔗 **Repositorio del Proyecto**

[![GitHub](https://img.shields.io/badge/GitHub-proyectosintegrados--Juanjotg65-181717?style=for-the-badge&logo=github)](https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65)

---

<table>
<tr>
<td align="center" width="33%">
<strong>📂 Repositorio</strong><br/>
<a href="https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65">Ver código fuente</a>
</td>
<td align="center" width="33%">
<strong>📖 README</strong><br/>
Documentación completa
</td>
<td align="center" width="33%">
<strong>📋 Anteproyecto</strong><br/>
Este documento
</td>
</tr>
</table>

</div>

---

<div align="center">

## ✨ **CARACTERÍSTICAS DESTACADAS**

🔐 **Autenticación JWT** | 🌐 **API REST Documentada** | 💬 **Chat en Tiempo Real**  
🌍 **Multiidioma (ES/EN)** | 📱 **Responsive Design** | ⚡ **WebSockets Nativos**  
🏎️ **Gestión de Reservas** | 🎨 **UI Moderna** | ☁️ **Desplegable en AWS**

---

### 📊 **ESTADO DEL PROYECTO**

```
✅ Backend API REST completo
✅ Frontend Next.js funcional
✅ Autenticación JWT
✅ Chat en tiempo real
✅ Internacionalización ES/EN
✅ Base de datos con seeders
✅ Documentación Swagger
🔄 Testing y optimización
📋 Despliegue en AWS (planificado)
```

---

### 📅 **INFORMACIÓN DEL DOCUMENTO**

**Proyecto Integrado - Ciclo Formativo DAW**  
**Curso Académico:** 2024/2025  
**Centro:** CPIFP Alan Turing  
**Fecha:** Enero 2025  
**Versión:** 1.0

---

*📄 El enlace al presente documento está incluido en el README.md del repositorio*

---

<sub>Generado para el Anteproyecto del Proyecto Integrado | Desarrollo de Aplicaciones Web</sub>

</div>
