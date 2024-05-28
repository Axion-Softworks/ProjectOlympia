using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DraftController : ControllerBase
{
    private readonly ILogger<DraftController> _logger;
    private readonly IMapper _mapper;
    private DraftingContext _context;

    public DraftController(ILogger<DraftController> logger, IMapper mapper, DraftingContext draftingContext)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
    }

    [HttpGet]
    public IActionResult GetAllDrafts()
    {
        var drafts = _context.Drafts.Include(i => i.Players).ToList();

        var response = new List<GetDraftResponse>();

        foreach (var draft in drafts)
        {
            var draftResponse = new GetDraftResponse(draft);

            foreach (var player in draft.Players)
            {
                draftResponse.Players.Add(_mapper.Map<PlayerData>(player));
            }

            response.Add(draftResponse);   
        }

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetDraft(Guid id)
    {
        var draft = _context.Drafts.Include(i => i.Players).Include(i => i.Athletes).FirstOrDefault(x => x.Id == id);

        if (draft == null)
            return NotFound();

        var response = new GetDraftResponse(draft);

        foreach (var player in draft.Players)
        {
            response.Players.Add(_mapper.Map<PlayerData>(player));
        }

        foreach (var athlete in draft.Athletes)
        {
            response.Athletes.Add(_mapper.Map<AthleteData>(athlete));
        }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> AddDraftAsync([FromBody] AddDraftRequest request)
    {
        var draft = this._mapper.Map<Draft>(request);
        draft.Id = Guid.NewGuid();
        draft.Players = _context.Players.Where(w => request.PlayerIds.Contains(w.Id)).ToList();        

        _context.Add(draft);
        await _context.SaveChangesAsync();

        return Ok(new AddDraftResponse(draft));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateDraftAsync([FromBody] UpdateDraftRequest request)
    {
        var draft = this._mapper.Map<Draft>(request);

        _context.Update(draft);
        await _context.SaveChangesAsync();

        return Ok(draft);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDraftAsync([FromRoute] Guid id)
    {
        var draft = this._context.Drafts.FirstOrDefault(x => x.Id == id);

        if (draft == null)
            return NotFound();

        _context.Remove(draft);
        await _context.SaveChangesAsync();

        return Ok();
    }

}