using GestionInventario.Data;
using Microsoft.AspNetCore.Mvc;

namespace GestionInventario.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("articulos/pdf")]
        public IActionResult ExportarArticulosPDF()
        {
            // Aquí usarías iTextSharp o similar para generar PDF
            return Ok("Funcionalidad PDF pendiente");
        }

        [HttpGet("prestamos/excel")]
        public IActionResult ExportarPrestamosExcel()
        {
            // Aquí usarías ClosedXML o EPPlus
            return Ok("Funcionalidad Excel pendiente");
        }
    }

}
