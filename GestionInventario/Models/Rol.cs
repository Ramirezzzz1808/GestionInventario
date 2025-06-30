using System.Text.Json.Serialization;

namespace GestionInventario.Models
{
    public class Rol
    {
        public int Id { get; set; }
        public string Nombre { get; set; }

        [JsonIgnore]
        public ICollection<Usuario> Usuarios { get; set; }
    }

}
