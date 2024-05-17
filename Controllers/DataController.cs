using System.Globalization;
using AutoMapper;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace ProjectOlympia.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DataController : ControllerBase
{

    private readonly ILogger<DataController> _logger;
    private readonly IMapper _mapper;

    public DataController(ILogger<DataController> logger, IMapper mapper)
    {
        _logger = logger;
        _mapper = mapper;
    }

    [HttpPost]
    public IActionResult ParseData([FromBody] DataRequest request)
    {
        var records = new List<AthleteData>();

        try 
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                MissingFieldFound = null
            };
            using (var reader = new StreamReader($@"Data\Files\{request.Filename}"))
            using (var csv = new CsvReader(reader, config))
            {
                records = csv.GetRecords<AthleteData>().ToList();
            }
        }
        catch (Exception ex) 
        {
            return StatusCode(500, ex);
        }

        var result = this._mapper.Map<List<Athlete>>(records);

        return Ok(result);
    }
}