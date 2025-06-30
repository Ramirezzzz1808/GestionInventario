namespace GestionInventario.Models
{
    public class Prestamo
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        public int ArticuloId { get; set; }
        public Articulo? Articulo { get; set; }

        public DateTime FechaSolicitud { get; set; }
        public DateTime? FechaEntrega { get; set; }
        public DateTime? FechaDevolucion { get; set; }

        public string Estado { get; set; } // Pendiente, Aprobado, Devuelto, etc.
    }

}
