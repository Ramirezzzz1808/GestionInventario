// File: Services/PrestamoService.cs
namespace GestionInventario.Services
{
    public class PrestamoService
    {
        public decimal CalcularMulta(int diasRetraso)
        {
            const decimal tarifaPorDia = 3.00m;
            return diasRetraso > 0 ? diasRetraso * tarifaPorDia : 0;
        }

        public int CalcularDiasRetraso(DateTime entrega, DateTime devolucion)
        {
            return (devolucion > entrega) ? (devolucion - entrega).Days : 0;
        }

        public bool ValidarFechas(DateTime entrega, DateTime devolucion)
        {
            return devolucion >= entrega;
        }
    }
}
