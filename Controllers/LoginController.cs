using Microsoft.AspNetCore.Mvc;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{

    private readonly ILogger<LoginController> _logger;

    private User Kyle = new User("Kyle") { Id = Guid.NewGuid() };

    public LoginController(ILogger<LoginController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public User? Login([FromBody] LoginRequest request)
    {
        if (request.Username.ToLower() != "kyle" || request.Password != "meh")
        {
            this.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return null;
        }

        return Kyle;
    }
}