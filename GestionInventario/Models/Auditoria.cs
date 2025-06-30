namespace GestionInventario.Models
{
    public class Auditoria
    {
        public int Id { get; set; }
        public string Accion { get; set; } // e.g., "Login", "Aprobar préstamo"
        public DateTime Fecha { get; set; }
        public string Usuario { get; set; } // nombre o email del usuario que ejecutó la acción
        public string Detalles { get; set; } // info adicional
    }

}
