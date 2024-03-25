using Azure.Identity;
using BlogPlatformAPI.Data;
using BlogPlatformAPI.Hubs;
using BlogPlatformAPI.Interfaces;
using BlogPlatformAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddControllers(); // This line registers controller services

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteCorsPolicy", builder =>
        builder.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey
        });
    
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("blogPlatformDefaultConnection");


builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString,
        ServerVersion.AutoDetect(connectionString)));

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<DataContext>();


// Configure Azure blob storage
builder.Services.AddSingleton(s =>
{
    var configuration = s.GetRequiredService<IConfiguration>();
    return new Azure.Storage.Blobs.BlobServiceClient(
        configuration.GetValue<string>("AzureBlobStorage:ConnectionString"));
});

builder.Services.AddScoped<IAzureBlobService, AzureBlobService>();

// Hent URI til Key Vault fra appsettings.json
var keyVaultUri = builder.Configuration["KeyVault:Uri"];

// Legg til Azure Key Vault til konfigurasjonen
builder.Configuration.AddAzureKeyVault(new Uri(keyVaultUri), new DefaultAzureCredential());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapIdentityApi<IdentityUser>();

app.UseCors("ViteCorsPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Definer ruten for SignalR hub
app.MapHub<CommentHub>("/commentHub");

app.Run();

