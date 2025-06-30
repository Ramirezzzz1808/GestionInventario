using GestionInventario.Data;
using GestionInventario.Models;
using Microsoft.EntityFrameworkCore;

namespace GestionInventario.Services
{
    public class ArticuloService : IArticuloService
    {
        private readonly ApplicationDbContext _context;

        public ArticuloService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Articulo>> Listar()
        {
            return await _context.Articulos.ToListAsync();
        }

        public async Task<Articulo> Crear(Articulo articulo)
        {
            if (_context.Articulos.Any(a => a.Codigo == articulo.Codigo))
                throw new Exception("Código duplicado");

            _context.Articulos.Add(articulo);
            await _context.SaveChangesAsync();
            return articulo;
        }
    }

}
