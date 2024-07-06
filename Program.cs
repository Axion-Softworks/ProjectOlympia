using ProjectOlympia;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

var jwtSigningKey = builder.Configuration.GetValue<string>("JwtSigningKey");

if (string.IsNullOrWhiteSpace(jwtSigningKey))
    throw new Exception("No JWT Signing Key");

builder.Services.AddSingleton(delegate
{
    var jwtBearerOptions = new JwtOptions() { JwtSigningKey = jwtSigningKey };
    return jwtBearerOptions;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme,
    x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = false;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSigningKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

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
app.UseAuthentication();
app.UseAuthorization();

var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};

app.UseWebSockets(webSocketOptions);

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
