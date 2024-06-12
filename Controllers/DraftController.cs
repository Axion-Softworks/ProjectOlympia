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
    private IWebSocketService _websocketService;

    public DraftController(ILogger<DraftController> logger, IMapper mapper, DraftingContext draftingContext, IWebSocketService webSocketService)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
        _websocketService = webSocketService;
    }

    [HttpGet]
    public IActionResult GetAllDrafts()
    {
        var drafts = _context.Drafts.Include(i => i.Users).ToList();

        var response = new List<GetDraftResponse>();

        foreach (var draft in drafts)
        {
            var draftResponse = new GetDraftResponse(draft);

            foreach (var user in draft.Users)
            {
                draftResponse.Users.Add(_mapper.Map<UserData>(user));
            }

            response.Add(draftResponse);   
        }

        return Ok(response);
    }

    [HttpGet("summary/{userId}")]
    public IActionResult GetAllDraftSummariesByUserId([FromRoute] Guid userId)
    {
        var drafts = _context.Drafts.Include(i => i.Users).Include(i => i.Athletes).Where(w => w.Users.Any(a => a.Id == userId)).ToList();

        var response = new List<DraftSummaryData>();

        foreach (var draft in drafts)
        {
            var draftSummaryData = new DraftSummaryData() {
                Id = draft.Id,
                Name = draft.Name,
                UserCount = draft.Users.Count(),
                AthleteCount = draft.Athletes.Count(),
                Status = draft.Status
            };

            response.Add(draftSummaryData);   
        }

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetDraft(Guid id)
    {
        var draft = _context.Drafts.Include(i => i.Users).Include(i => i.Athletes).FirstOrDefault(x => x.Id == id);

        if (draft == null)
            return NotFound();

        var response = new GetDraftResponse(draft);

        foreach (var user in draft.Users)
        {
            response.Users.Add(_mapper.Map<UserData>(user));
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
        draft.Users = _context.Users.Where(w => request.UserIds.Contains(w.Id)).ToList();        

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

    [HttpPut("assign")]
    public async Task<IActionResult> AssignUsersToDraftAsync([FromBody] AssignUsersToDraftRequest request)
    {
        var draft = _context.Drafts.Include(i => i.Users).FirstOrDefault(f => f.Id == request.Id);

        if (draft == null)
            return NotFound();

        foreach (var userId in request.UserIds)
        {
            var user = _context.Users.FirstOrDefault(f => f.Id == userId);

            if (user == null)
                return NotFound();

            draft.Users.Add(user);
        }

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("status/{id}/{status}")]
    public async Task<IActionResult> SetDraftStatusAsync([FromRoute] Guid id, [FromRoute] EDraftStatus status)
    {
        var draft = this._context.Drafts.Include(i => i.Users).FirstOrDefault(f => f.Id == id);

        if (draft == null)
            return NotFound();

        draft.Status = status;

        _context.Update(draft);
        await _context.SaveChangesAsync();

        if (status == EDraftStatus.InProgress)
            await this._websocketService.SendDraftStartedMessageAsync(draft.Id, draft.Users.Select(s => s.Id).ToList());

        return Ok();
    }

    [HttpPut("randomise/{id}")]
    public async Task<IActionResult> RandomiseDraftOrder([FromRoute] Guid id)
    {
        var draft = this._context.Drafts.Include(i => i.Users).FirstOrDefault(f => f.Id == id);

        if (draft == null)
            return NotFound();

        Random rng = new Random();
        var order = draft.Users.Select(s => s.Id.ToString()).OrderBy(_ => rng.Next()).ToList();
        
        draft.DraftOrder = string.Join(',', order);

        _context.Update(draft);
        await _context.SaveChangesAsync();

        await this._websocketService.SendDraftRandomisedMessageAsync(draft.Id, draft.Users.Select(s => s.Id).ToList(), order);

        return Ok();
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