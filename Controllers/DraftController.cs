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