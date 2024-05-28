using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedalController : ControllerBase
{
    private readonly ILogger<MedalController> _logger;
    private readonly IMapper _mapper;
    private DraftingContext _context;

    public MedalController(ILogger<MedalController> logger, IMapper mapper, DraftingContext draftingContext)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
    }

    [HttpGet]
    public IActionResult GetAllMedals()
    {
        var medals = _context.Medals.Include(i => i.Athlete).ToList();

        var response = new List<GetMedalResponse>();

        foreach (var medal in medals)
        {
            var medalResponse = new GetMedalResponse(medal);

            medalResponse.Athlete = _mapper.Map<AthleteData>(medal.Athlete);

            response.Add(medalResponse);
        }

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetMedal(Guid id)
    {
        var medal = _context.Medals.Include(i => i.Athlete).FirstOrDefault(x => x.Id == id);

        if (medal == null)
            return NotFound();

        var response = new GetMedalResponse(medal);

        response.Athlete = _mapper.Map<AthleteData>(medal.Athlete);

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> AddMedalAsync([FromBody] AddMedalRequest request)
    {
        var medal = this._mapper.Map<Medal>(request);
        var athlete = _context.Athletes.FirstOrDefault(x => x.Id == request.AthleteId);
        
        if (athlete == null)
            return NotFound();
        
        medal.Id = Guid.NewGuid();
        medal.Athlete = athlete;        

        _context.Add(medal);
        await _context.SaveChangesAsync();

        return Ok(new AddMedalResponse(medal));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateMedalAsync([FromBody] UpdateMedalRequest request)
    {
        var medal = this._mapper.Map<Medal>(request);

        _context.Update(medal);
        await _context.SaveChangesAsync();

        return Ok(medal);
    }

    [HttpPut("event")]
    public async Task<IActionResult> UpdateMedalEventAsync([FromBody] UpdateMedalEventRequest request)
    {
        var medal = _context.Medals.FirstOrDefault(x => x.Id == request.Id);
        
        if (medal == null)
            return NotFound();

        medal.Event = request.Event;

        _context.Update(medal);
        await _context.SaveChangesAsync();

        return Ok(medal);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedalAsync([FromRoute] Guid id)
    {
        var medal = this._context.Medals.FirstOrDefault(x => x.Id == id);

        if (medal == null)
            return NotFound();

        _context.Remove(medal);
        await _context.SaveChangesAsync();

        return Ok();
    }

}