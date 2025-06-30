namespace GestionInventario.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Contraseña { get; set; }

        // Relaciones
        public int RolId { get; set; }
        public Rol? Rol { get; set; }
        //admin@xwy.com 1234
    }
}
