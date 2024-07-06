using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        _context.Add(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateUserAsync([FromBody] UpdateUserRequest request)
    {
        var user = this._mapper.Map<User>(request);

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

}