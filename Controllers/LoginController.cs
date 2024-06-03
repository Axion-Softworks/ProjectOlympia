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
            .FirstOrDefault(f => f.Username == request.Username);

        if (user == null || request.Password != user.Password)
            return Unauthorized();

        var response = new LoginResponse(user);

        return Ok(response);
    }
}