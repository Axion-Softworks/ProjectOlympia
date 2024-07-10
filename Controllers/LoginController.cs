using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using Konscious.Security.Cryptography;

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

        if (user == null)
            return Unauthorized();

        var hash = this.HashPassword(request.Password, user.Salt, user.Id.ToString());

        if (hash != user.Password)
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

    private string HashPassword(string password, string salt, string id) 
    {
        var passwordBytes = Encoding.UTF8.GetBytes(password);
        var saltBytes = Convert.FromHexString(salt);
        var userUuidBytes = Encoding.UTF8.GetBytes(id);

        var argon2 = new Argon2i(passwordBytes)
        {
            DegreeOfParallelism = 4,
            MemorySize = 8192,
            Iterations = 40,
            Salt = saltBytes,
            AssociatedData = userUuidBytes
        };

        var hash = argon2.GetBytes(128);

        return Convert.ToHexString(hash);
    }
}