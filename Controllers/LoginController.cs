using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{

    private readonly ILogger<LoginController> _logger;
    private readonly IMapper _mapper;
    private readonly DraftingContext _context;

    public LoginController(ILogger<LoginController> logger, IMapper mapper, DraftingContext draftingContext)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
    }

    [HttpPost]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _context.Users
            .Include(i => i.Drafts).ThenInclude(t => t.Users)
            .Include(i => i.Drafts).ThenInclude(t => t.Athletes) //Inefficient to be getting all these, look into alternative counting solutions
            .FirstOrDefault(f => f.Username == request.Username);

        if (user == null || request.Password != user.Password)
            return Unauthorized();

        var response = new LoginResponse(user);

        foreach (var draft in user.Drafts)
        {
            var summary = _mapper.Map<DraftSummaryData>(draft);
            summary.UserCount = draft.Users.Count();
            summary.AthleteCount = draft.Athletes.Count();
            response.Drafts.Add(summary);
        }

        return Ok(response);
    }
}