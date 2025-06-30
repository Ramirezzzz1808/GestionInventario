namespace GestionInventario.Models
{
    public class Articulo
    {
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public string Categoria { get; set; }
        public string Estado { get; set; }
        public string Ubicacion { get; set; }
    }

}
