using Microsoft.AspNetCore.Mvc;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{

    private readonly ILogger<LoginController> _logger;
    private readonly DraftingContext _context;

    public LoginController(ILogger<LoginController> logger, DraftingContext draftingContext)
    {
        _logger = logger;
        _context = draftingContext;
    }

    [HttpPost]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var player = _context.Players.FirstOrDefault(f => f.Username == request.Username);

        if (player == null || request.Password != player.Password)
            return Unauthorized();

        return Ok(new LoginResponse(player));
    }
}