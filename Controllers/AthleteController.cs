using Microsoft.AspNetCore.Mvc;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AthleteController : ControllerBase
{
    private List<Athlete> Athletes = new List<Athlete>();

    private readonly ILogger<AthleteController> _logger;

    public AthleteController(ILogger<AthleteController> logger)
    {
        _logger = logger;

        Athletes = new List<Athlete>() { 
            // new Athlete("Dave Davis", "Sucks at running", "Running", "us", new List<Medal>(){ new Medal("Running", EPlace.Bronze) } ),
            // new Athlete("Davina DeDevine", "Good at running", "Running", "de", new List<Medal>(){ new Medal("Running", EPlace.Gold) } ),
            // new Athlete("Roger D Roper", "Throws like a beast", "Athletics", "de", new List<Medal>(){ new Medal("Shot Put", EPlace.Gold), new Medal("Caber Toss", EPlace.Gold), new Medal("Discus", EPlace.Silver) } ),
            // new Athlete("Patrice El Tato", "Loses steam in the last furlong", "Horsemanship", "ie", new List<Medal>()),
            // new Athlete("Toddward Oddward", "Quite odd", "Fishing, Cards", "ca", new List<Medal>(){ new Medal("Fishing", EPlace.Gold), new Medal("Eating Fish", EPlace.Silver), new Medal("Balatro", EPlace.Bronze) } ),
        };
    }

    [HttpGet]
    public IEnumerable<Athlete> Get()
    {
        return Athletes;
    }
}