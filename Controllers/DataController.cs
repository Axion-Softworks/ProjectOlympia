using System.Globalization;
using AutoMapper;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProjectOlympia.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DataController : ControllerBase
{

    private readonly ILogger<DataController> _logger;
    private readonly IMapper _mapper;
    private readonly DraftingContext _context;
    public DataController(ILogger<DataController> logger, IMapper mapper, DraftingContext draftingContext)
    {
        _logger = logger;
        _mapper = mapper;
        _context = draftingContext;
    }

    [HttpPost]
    public async Task<IActionResult> ParseData([FromBody] DataRequest request)
    {
        var records = new List<AthleteCsvData>();
        var draft = _context.Drafts.FirstOrDefault(x => x.Id == request.DraftId);

        if (draft == null)
            return NotFound();

        try 
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                MissingFieldFound = null
            };
            using (var reader = new StreamReader($@"Data\Files\{request.Filename}"))
            using (var csv = new CsvReader(reader, config))
            {
                records = csv.GetRecords<AthleteCsvData>().ToList();
            }
        }
        catch (Exception ex) 
        {
            return StatusCode(500, ex);
        }

        var athletes = this._mapper.Map<List<Athlete>>(records);

        for (int i = 0; i < athletes.Count; i++)
        {
            athletes[i].Draft = draft;
        }

        _context.AddRange(athletes);
        await _context.SaveChangesAsync();

        return Ok();
    }
}