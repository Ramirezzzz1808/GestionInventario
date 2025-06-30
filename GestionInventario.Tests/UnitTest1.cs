// File: PrestamoServiceTests.cs
using GestionInventario.Services;
using Xunit;

public class PrestamoServiceTests
{
    [Fact]
    public void CalcularMulta_ConRetraso()
    {
        var s = new PrestamoService();
        Assert.Equal(9.00m, s.CalcularMulta(3));
    }

    [Fact]
    public void CalcularMulta_SinRetraso()
    {
        var s = new PrestamoService();
        Assert.Equal(0.00m, s.CalcularMulta(0));
    }

    [Fact]
    public void CalcularDiasRetraso_Correcto()
    {
        var s = new PrestamoService();
        var dias = s.CalcularDiasRetraso(new DateTime(2025, 6, 20), new DateTime(2025, 6, 25));
        Assert.Equal(5, dias);
    }

    [Fact]
    public void ValidarFechas_Correcto()
    {
        var s = new PrestamoService();
        Assert.True(s.ValidarFechas(DateTime.Today, DateTime.Today.AddDays(1)));
    }

    [Fact]
    public void ValidarFechas_Incorrecto()
    {
        var s = new PrestamoService();
        Assert.False(s.ValidarFechas(DateTime.Today, DateTime.Today.AddDays(-1)));
    }
}
