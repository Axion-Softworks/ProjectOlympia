using ProjectOlympia;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Auto Mapper Configurations
var mappingConfig = new AutoMapper.MapperConfiguration(mc =>
{
    mc.AddProfile(new ProjectOlympia.MappingProfile());
});

AutoMapper.IMapper mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

builder.Services.AddSingleton<IWebSocketHandler, WebSocketHandler>();
builder.Services.AddScoped<IWebSocketService, WebSocketService>();

builder.Services.AddDbContext<DraftingContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("ProjectOlympiaConnectionString")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};

app.UseWebSockets(webSocketOptions);

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
