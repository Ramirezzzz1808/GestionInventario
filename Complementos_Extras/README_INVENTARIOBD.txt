SISTEMA DE GESTIÓN DE INVENTARIO - XWY

Este sistema permite gestionar artículos, préstamos y usuarios dentro de una organización, con control de acceso por roles (Administrador, Operador). Desarrollado en ASP.NET Core Web API con Entity Framework Core y frontend HTML/JS en wwwroot.

------------------------------------------------------------
INSTRUCCIONES DE DESPLIEGUE

PRERREQUISITOS:
- .NET 7 SDK
- SQL Server
- Visual Studio 2022 o superior (recomendado)

PASOS:

1. Clonar el repositorio:
   git clone https://github.com/usuario/sistema-inventario-xwy.git

2. Configurar la base de datos:
   En appsettings.json, establece tu cadena de conexión:
   "ConnectionStrings": {
     "DefaultConnection": "Server=.;Database=InventarioXWY;Trusted_Connection=True;TrustServerCertificate=True"
   }

   Ejecutar migraciones:
   dotnet ef database update

3. Ejecutar el proyecto:
   dotnet run

   Abre el navegador en:
   https://localhost:7003

------------------------------------------------------------
ARQUITECTURA DEL SISTEMA

CAPAS:

- Models: Entidades del dominio (Usuario, Articulo, Prestamo, Rol)
- Data: ApplicationDbContext, configuración EF Core
- Repositories: Patrón Repository para acceso a datos
- UnitOfWork: Coordina transacciones entre repositorios
- Controllers: Controladores RESTful
- wwwroot: Frontend HTML, JS, CSS

------------------------------------------------------------
PATRONES USADOS

Repository:
Interfaz genérica para CRUD:

public interface IRepository<T> where T : class {
    Task<IEnumerable<T>> GetAll();
    Task<T> GetById(int id);
    Task Add(T entity);
    void Update(T entity);
    void Delete(T entity);
}

Unit of Work:
Coordina múltiples repositorios y gestiona el SaveChanges:

public interface IUnitOfWork {
    IRepository<Articulo> Articulos { get; }
    IRepository<Usuario> Usuarios { get; }
    IRepository<Prestamo> Prestamos { get; }
    Task<int> CompleteAsync();
}

------------------------------------------------------------
EJEMPLOS DE LLAMADAS A LA API (USAR SWAGGER)

URL de Swagger UI:
https://localhost:7003/swagger

Ejemplos de endpoints:

GET /api/articulos
Retorna todos los artículos

POST /api/prestamos
{
  "usuarioId": 1,
  "articuloId": 2,
  "fechaPrestamo": "2025-06-30",
  "estado": "Prestado"
}

PUT /api/articulos/5
Modifica artículo con ID 5

DELETE /api/prestamos/3
Elimina préstamo con ID 3

------------------------------------------------------------
ROLES Y ACCESO

Administrador:
- Gestión completa (usuarios, artículos, préstamos, reportes)

Operador:
- Solicitud de préstamos

------------------------------------------------------------
ESTRUCTURA DE ARCHIVOS

GestionInventario/
├── Controllers/
├── Data/
│   └── ApplicationDbContext.cs
├── Models/
│   ├── Usuario.cs
│   ├── Articulo.cs
│   └── Prestamo.cs
├── Repositories/
│   ├── IRepository.cs
│   └── UnitOfWork.cs
├── wwwroot/
│   ├── index.html
│   ├── scripts.js
│   └── estilos.css
└── Program.cs

------------------------------------------------------------
PRUEBAS

- Pruebas unitarias de lógica de negocio (al menos 5)
- Pruebas de integración con base de datos en memoria (al menos 3)
- Autenticación sin JWT (por implementar)

------------------------------------------------------------
TECNOLOGÍAS USADAS

- ASP.NET Core 7 Web API
- Entity Framework Core
- SQL Server
- HTML, CSS, JavaScript
- Swagger
