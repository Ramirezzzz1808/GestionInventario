using GestionInventario.Models;

namespace GestionInventario.Services
{
    public interface IArticuloService
    {
        Task<List<Articulo>> Listar();
        Task<Articulo> Crear(Articulo articulo);
    }
}
