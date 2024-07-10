using AutoMapper;
using Konscious.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ProjectOlympia.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IMapper _mapper;
    private DraftingContext _context;

    public UserController(ILogger<UserController> logger, IMapper mapper, DraftingContext draftingContext)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        var users = _context.Users.Include(i => i.Drafts).ToList();

        var response = new List<GetUserResponse>();

        foreach (var user in users)
        {
            var userResponse = new GetUserResponse(user);

            foreach (var draft in user.Drafts)
            {
                userResponse.Drafts.Add(_mapper.Map<DraftData>(draft));
            }

            response.Add(userResponse);   
        }
    
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetUser(Guid id)
    {
        var user = _context.Users.Include(i => i.Drafts).FirstOrDefault(x => x.Id == id);

        if (user == null)
            return NotFound();

        var response = new GetUserResponse(user);

        foreach (var draft in user.Drafts)
        {
            response.Drafts.Add(_mapper.Map<DraftData>(draft));
        }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> AddUserAsync([FromBody] AddUserRequest request)
    {
        var user = this._mapper.Map<User>(request);
        user.Id = Guid.NewGuid();
        user.Drafts = new List<Draft>();

        var salt = RandomNumberGenerator.GetBytes(64);
        var hash = this.HashPassword(request.Password, salt, user.Id.ToString());

        user.Salt = Convert.ToHexString(salt);
        user.Password = hash;

        _context.Add(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateUserAsync([FromBody] UpdateUserRequest request)
    {
        var user = this._context.Users.FirstOrDefault(x => x.Id == request.Id);

        if (user == null)
            return NotFound();

        var hash = this.HashPassword(request.Password, Convert.FromHexString(user.Salt), user.Id.ToString());

        user.Username = request.Username;
        user.Password = hash;
        user.IsAdmin = request.IsAdmin;
        user.HexColor = request.HexColor;

        _context.Update(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUserAsync([FromRoute] Guid id)
    {
        var user = this._context.Users.FirstOrDefault(x => x.Id == id);

        if (user == null)
            return NotFound();

        _context.Remove(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    private string HashPassword(string password, byte[] salt, string id) 
    {
        var passwordBytes = Encoding.UTF8.GetBytes(password);
        var userUuidBytes = Encoding.UTF8.GetBytes(id);

        var argon2 = new Argon2i(passwordBytes)
        {
            DegreeOfParallelism = 4,
            MemorySize = 8192,
            Iterations = 40,
            Salt = salt,
            AssociatedData = userUuidBytes
        };

        var hash = argon2.GetBytes(128);

        return Convert.ToHexString(hash);
    }
}