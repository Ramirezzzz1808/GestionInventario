using GestionInventario.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace GestionInventario.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Articulo> Articulos { get; set; }
        public DbSet<Prestamo> Prestamos { get; set; }
        public DbSet<Auditoria> Auditorias { get; set; }

    }
}

    
