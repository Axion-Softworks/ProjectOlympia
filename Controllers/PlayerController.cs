using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly ILogger<PlayerController> _logger;
    private readonly IMapper _mapper;
    private DraftingContext _context;

    public PlayerController(ILogger<PlayerController> logger, IMapper mapper, DraftingContext draftingContext)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
    }

    [HttpGet]
    public IActionResult GetAllPlayers()
    {
        return Ok(_context.Players.ToList());
    }

    [HttpGet("{id}")]
    public IActionResult GetPlayer(Guid id)
    {
        var player = _context.Players.FirstOrDefault(x => x.Id == id);

        if (player == null)
            return NotFound();

        return Ok(player);
    }

    [HttpPost]
    public async Task<IActionResult> AddPlayerAsync([FromBody] AddPlayerRequest request)
    {
        var player = this._mapper.Map<Player>(request);
        player.Id = Guid.NewGuid();
        player.Drafts = new List<Draft>();

        _context.Add(player);
        await _context.SaveChangesAsync();

        return Ok(player);
    }

    [HttpPut]
    public async Task<IActionResult> UpdatePlayerAsync([FromBody] UpdatePlayerRequest request)
    {
        var player = this._mapper.Map<Player>(request);

        _context.Update(player);
        await _context.SaveChangesAsync();

        return Ok(player);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlayerAsync([FromRoute] Guid id)
    {
        var player = this._context.Players.FirstOrDefault(x => x.Id == id);

        if (player == null)
            return NotFound();

        _context.Remove(player);
        await _context.SaveChangesAsync();

        return Ok();
    }

}