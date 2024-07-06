using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{

    private readonly ILogger<LoginController> _logger;
    private readonly IMapper _mapper;
    private readonly DraftingContext _context;
    private readonly JwtOptions _jwtOptions;

    public LoginController(ILogger<LoginController> logger, IMapper mapper, DraftingContext draftingContext, JwtOptions jwtOptions)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
        _jwtOptions = jwtOptions;
    }

    [HttpPost]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _context.Users
            .FirstOrDefault(f => f.Username == request.Username);

        if (user == null || request.Password != user.Password)
            return Unauthorized();

        var response = new LoginResponse(user);

        var jwt = this.GenerateJWTToken(user);

        response.Jwt = jwt;

        return Ok(response);
    }

    public string GenerateJWTToken(User user) {
        var claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
        };
        var jwtToken = new JwtSecurityToken(
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(this._jwtOptions.JwtSigningKey)
                ),
                SecurityAlgorithms.HmacSha256Signature)
            );
        return new JwtSecurityTokenHandler().WriteToken(jwtToken);
    }
}