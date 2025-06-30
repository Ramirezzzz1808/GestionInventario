using ClosedXML.Excel;
using GestionInventario.Data;
using GestionInventario.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionInventario.Controllers
{

        [Route("api/[controller]")]
        [ApiController]
        public class PrestamoController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public PrestamoController(ApplicationDbContext context)
            {
                _context = context;
            }

            // GET: api/Prestamo
            [HttpGet]
            public async Task<ActionResult<IEnumerable<Prestamo>>> GetPrestamos()
            {
                // Incluye la info de Usuario y Articulo para evitar referencias nulas o lazy loading
                return await _context.Prestamos
                    .Include(p => p.Usuario)
                    .Include(p => p.Articulo)
                    .ToListAsync();
            }

            // GET: api/Prestamo/5
            [HttpGet("{id}")]
            public async Task<ActionResult<Prestamo>> GetPrestamo(int id)
            {
                var prestamo = await _context.Prestamos
                    .Include(p => p.Usuario)
                    .Include(p => p.Articulo)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (prestamo == null)
                {
                    return NotFound();
                }

                return prestamo;
            }

        // POST: api/Prestamo
        [HttpPost]
        public async Task<ActionResult<Prestamo>> PostPrestamo([FromBody] Prestamo prestamo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Prestamos.Add(prestamo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPrestamo), new { id = prestamo.Id }, prestamo);
        }



        // PUT: api/Prestamo/5
        [HttpPut("{id}")]
            public async Task<IActionResult> PutPrestamo(int id, Prestamo prestamo)
            {
                if (id != prestamo.Id)
                {
                    return BadRequest("El ID del préstamo no coincide");
                }

                _context.Entry(prestamo).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PrestamoExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }

            // DELETE: api/Prestamo/5
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeletePrestamo(int id)
            {
                var prestamo = await _context.Prestamos.FindAsync(id);
                if (prestamo == null)
                {
                    return NotFound();
                }

                _context.Prestamos.Remove(prestamo);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            private bool PrestamoExists(int id)
            {
                return _context.Prestamos.Any(e => e.Id == id);
            }
        [HttpGet("exportar-excel")]
        public IActionResult ExportarPrestamosExcel()
        {
            var prestamos = _context.Prestamos
                .Include(p => p.Usuario)
                .Include(p => p.Articulo)
                .ToList();

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Préstamos");

            ws.Cell(1, 1).Value = "Usuario";
            ws.Cell(1, 2).Value = "Artículo";
            ws.Cell(1, 3).Value = "Fecha Solicitud";
            ws.Cell(1, 4).Value = "Fecha Entrega";
            ws.Cell(1, 5).Value = "Fecha Devolución";
            ws.Cell(1, 6).Value = "Estado";

            int row = 2;
            foreach (var p in prestamos)
            {
                ws.Cell(row, 1).Value = p.Usuario?.Nombre;
                ws.Cell(row, 2).Value = p.Articulo?.Nombre;
                ws.Cell(row, 3).Value = p.FechaSolicitud.ToString("yyyy-MM-dd");
                ws.Cell(row, 4).Value = p.FechaEntrega?.ToString("yyyy-MM-dd");
                ws.Cell(row, 5).Value = p.FechaDevolucion?.ToString("yyyy-MM-dd");
                ws.Cell(row, 6).Value = p.Estado;
                row++;
            }

            using var ms = new MemoryStream();
            wb.SaveAs(ms);
            return File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Prestamos.xlsx");
        }

    }
}
