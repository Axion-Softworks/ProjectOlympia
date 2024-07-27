using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ProjectOlympia.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class MedalController : ControllerBase
{
    private readonly ILogger<MedalController> _logger;
    private readonly IMapper _mapper;
    private DraftingContext _context;
    private IWebSocketService _websocketService;
    private readonly HttpClient _httpClient;

    public MedalController(ILogger<MedalController> logger, IMapper mapper, DraftingContext draftingContext, IWebSocketService webSocketService)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
        _websocketService = webSocketService;
        _httpClient = new HttpClient();
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

    
    [HttpGet("update/{draftId}")]
    public async Task<IActionResult> GetMedalDataFromOlympicApi([FromRoute] Guid draftId) 
    {
        var response = await _httpClient.GetStringAsync("https://olympics.com/en/paris-2024/medals/medallists");

        if (string.IsNullOrWhiteSpace(response))
            return BadRequest();

        var start = "\"athletes\":[";
        var end = "\"competitionCode\":";
        var startIndex = response.IndexOf(start) + start.Length - 1;
        var endIndex = response.IndexOf(end) - 1;

        response = response.Substring(startIndex, endIndex - startIndex);

        var data = JsonConvert.DeserializeObject<List<OlympicData>>(response);

        if (data == null || data.Count < 1)
            return NotFound();

        var athletes = this._context.Athletes.Include(i => i.Medals).Include(i => i.Draft).ThenInclude(i => i.Users).Where(x => x.Draft.Id == draftId).ToList();

        foreach (var oData in data)
        {
            if (oData.Medals == null || oData.Medals.Count < 1)
                continue;

            var athlete = athletes.FirstOrDefault(x => x.OlympicId == oData.Code);

            if (athlete == null)
                continue;

            _context.RemoveRange(athlete.Medals);

            foreach (var oMedal in oData.Medals)
            {
                var medal = new Medal{ Id = Guid.NewGuid(), Event = oMedal.EventName, Place = this.ParsePlace(oMedal.MedalType), Athlete = athlete };
                _context.Add(medal);
            }  
        }

        await _context.SaveChangesAsync();

        await this._websocketService.SendAllMedalsUpdatedMessageAsync(draftId, athletes[0].Draft.Users.Select(s => s.Id).ToList());

        return Ok();
    }

    private EPlace ParsePlace(string place) {
        switch (place)
        {
            case "ME_BRONZE":
                return EPlace.Bronze;

            case "ME_SILVER":
                return EPlace.Silver;

            case "ME_GOLD":
                return EPlace.Gold;

            default:
                return EPlace.Bronze;
        }
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

    [HttpPut("manage")]
    public async Task<IActionResult> ManageMedalsByAthleteIdAsync([FromBody] ManageMedalsRequest request)
    {
        var athlete = _context.Athletes.Include(i => i.Medals).Include(i => i.Draft).ThenInclude(i => i.Users).FirstOrDefault(x => x.Id == request.AthleteId);
        
        if (athlete == null)
            return NotFound();

        foreach (var medalData in request.Medals)
        {
            var existingMedal = athlete.Medals.FirstOrDefault(x => x.Id == medalData.Id);

            if (existingMedal == null)
            {
                var newMedal = new Medal() {
                    Id = Guid.NewGuid(),
                    Event = medalData.Event == null ? string.Empty : medalData.Event,
                    Place = medalData.Place,
                    Athlete = athlete
                };

                athlete.Medals.Add(newMedal);
                _context.Add(newMedal);
            }
            else 
            {
                existingMedal.Event = medalData.Event == null ? string.Empty : medalData.Event;
                existingMedal.Place = medalData.Place;
                _context.Update(existingMedal);
            }
        }

        await _context.SaveChangesAsync();

        await this._websocketService.SendMedalsManagedMessageAsync(athlete.Draft.Id, athlete.Draft.Users.Select(s => s.Id).ToList(), request);

        return Ok();
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