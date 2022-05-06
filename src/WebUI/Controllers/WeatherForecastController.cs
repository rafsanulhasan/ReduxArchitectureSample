using Microsoft.AspNetCore.Mvc;
using ReduxArchitecture.Application.WeatherForecasts.Queries.GetWeatherForecasts;

namespace ReduxArchitecture.WebUI.Controllers
{
    public class WeatherForecastController : ApiControllerBase
    {
        [HttpGet]
        public async Task<IEnumerable<WeatherForecast>> Get()
        {
            return await Mediator.Send(new GetWeatherForecastsQuery());
        }
    }
}