using GestionInventario.Data;
using GestionInventario.Models;
using iTextSharp.text.pdf;
using iTextSharp.text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

using Microsoft.EntityFrameworkCore;

namespace GestionInventario.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    public class ArticulosController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public ArticulosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetArticulos()
        {
            return Ok(await _context.Articulos.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Crear(Articulo articulo)
        {
            if (_context.Articulos.Any(a => a.Codigo == articulo.Codigo))
                return BadRequest("Ya existe un artículo con ese código.");

            _context.Articulos.Add(articulo);
            await _context.SaveChangesAsync();
            return Ok(articulo);
        }
        // DELETE: api/articulos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticulo(int id)
        {
            var articulo = await _context.Articulos.FindAsync(id);
            if (articulo == null)
            {
                return NotFound();
            }

            _context.Articulos.Remove(articulo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("exportar-pdf")]
        public IActionResult ExportarArticulosPDF()
        {
            var articulos = _context.Articulos.ToList();

            using var ms = new MemoryStream();
            var document = new iTextSharp.text.Document();
            var writer = PdfWriter.GetInstance(document, ms);
            document.Open();

            document.Add(new Paragraph("Reporte de Artículos"));
            var table = new PdfPTable(5);
            table.AddCell("Código");
            table.AddCell("Nombre");
            table.AddCell("Categoría");
            table.AddCell("Estado");
            table.AddCell("Ubicación");

            foreach (var art in articulos)
            {
                table.AddCell(art.Codigo);
                table.AddCell(art.Nombre);
                table.AddCell(art.Categoria);
                table.AddCell(art.Estado);
                table.AddCell(art.Ubicacion);
            }

            document.Add(table);
            document.Close();

            return File(ms.ToArray(), "application/pdf", "Articulos.pdf");
        }


    }
}