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
            new Athlete("Dave", "Sucks at running", "Running", "US", new List<Medal>(){ new Medal("Running", EPlace.Bronze) } ),
            new Athlete("Davina", "Good at running", "Running", "GER", new List<Medal>(){ new Medal("Running", EPlace.Gold) } ),
            new Athlete("Roger", "Throws like a beast", "Athletics", "GER", new List<Medal>(){ new Medal("Shot Put", EPlace.Gold), new Medal("Caber Toss", EPlace.Gold), new Medal("Discus", EPlace.Silver) } ),
            new Athlete("Patrice", "Loses steam in the last furlong", "Horsemanship", "IRE", new List<Medal>()),
            new Athlete("Todd", "Quite odd", "Fishing, Cards", "CAN", new List<Medal>(){ new Medal("Fishing", EPlace.Gold), new Medal("Eating Fish", EPlace.Silver), new Medal("Balatro", EPlace.Bronze) } ),
        };
    }

    [HttpGet]
    public IEnumerable<Athlete> Get()
    {
        return Athletes;
    }
}