using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AthleteController : ControllerBase
{
    private readonly ILogger<AthleteController> _logger;
    private readonly IMapper _mapper;
    private readonly DraftingContext _context;
    private readonly IWebSocketService _webSocketService;

    public AthleteController(ILogger<AthleteController> logger, IMapper mapper, DraftingContext draftingContext, IWebSocketService webSocketService)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
        _webSocketService = webSocketService;
    }

    [HttpGet]
    public IActionResult GetAllAthletes()
    {
        var athletes = _context.Athletes.Include(i => i.Draft).Include(i => i.Medals).ToList();

        var response = new List<GetAthleteResponse>();

        foreach (var athlete in athletes)
        {
            var athleteResponse = new GetAthleteResponse(athlete);

            athleteResponse.Draft = _mapper.Map<DraftData>(athlete.Draft);

            foreach (var medal in athlete.Medals)
            {
                athleteResponse.Medals.Add(_mapper.Map<MedalData>(medal));
            }
            
            response.Add(athleteResponse);   
        }

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetAthlete(Guid id)
    {
        var athlete = _context.Athletes.Include(i => i.Draft).Include(i => i.Medals).FirstOrDefault(x => x.Id == id);

        if (athlete == null)
            return NotFound();

        var response = new GetAthleteResponse(athlete);

        response.Draft = _mapper.Map<DraftData>(athlete.Draft);

        foreach (var medal in athlete.Medals)
        {
            response.Medals.Add(_mapper.Map<MedalData>(medal));
        }  

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAthleteAsync([FromBody] UpdateAthleteRequest request)
    {
        var athlete = this._mapper.Map<Athlete>(request);

        _context.Update(athlete);
        await _context.SaveChangesAsync();

        return Ok(athlete);
    }

    [HttpPut("assign")]
    public async Task<IActionResult> AssignAthleteToUserAsync([FromBody] AssignAthleteRequest request)
    {
        var athlete = _context.Athletes
            .Include(x => x.Draft)
            .ThenInclude(x => x.Users)
            .FirstOrDefault(f => f.Id == request.Id);

        var user = _context.Users.FirstOrDefault(f => f.Id == request.UserId);

        if (athlete == null || user == null)
            return NotFound();

        athlete.User = user;
        athlete.UserId = user.Id;

        _context.Update(athlete);
        await _context.SaveChangesAsync();

        var userIds = athlete.Draft.Users.Where(x => x.Id != request.UserId).Select(x => x.Id).ToList();

        await _webSocketService.SendAthleteAssignedMessageAsync(request.UserId, request.Id, userIds);

        var response = new AssignAthleteResponse(athlete);
        response.User = _mapper.Map<UserData>(user);

        return Ok(response);
    }

    [HttpPut("clear/{draftId}")]
    public async Task<IActionResult> ClearDraftedAthletesByDraftIdAsync([FromRoute] Guid draftId)
    {
        var athletes = _context.Athletes.Include(i => i.Draft).Include(i => i.User).Where(w => w.Draft.Id == draftId);

        if (athletes == null || athletes.Count() < 1)
            return NotFound();

        foreach (var athlete in athletes)
        {
            athlete.User = null;
            athlete.UserId = null;        
            _context.Update(athlete);
        }

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAthleteAsync([FromRoute] Guid id)
    {
        var athlete = this._context.Athletes.FirstOrDefault(x => x.Id == id);

        if (athlete == null)
            return NotFound();

        _context.Remove(athlete);
        await _context.SaveChangesAsync();

        return Ok();
    }
}