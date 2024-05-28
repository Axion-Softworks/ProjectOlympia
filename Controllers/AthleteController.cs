﻿using AutoMapper;
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

    public AthleteController(ILogger<AthleteController> logger, IMapper mapper, DraftingContext draftingContext)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
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
        var athlete = _context.Athletes.FirstOrDefault(f => f.Id == request.Id);
        var user = _context.Users.FirstOrDefault(f => f.Id == request.UserId);

        if (athlete == null || user == null)
            return NotFound();

        athlete.User = user;
        athlete.UserId = user.Id;

        _context.Update(athlete);
        await _context.SaveChangesAsync();

        var response = new AssignAthleteResponse(athlete);
        response.User = _mapper.Map<UserData>(user);

        return Ok(response);
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