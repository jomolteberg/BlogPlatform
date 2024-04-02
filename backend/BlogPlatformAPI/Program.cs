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
    options.AddPolicy("MyCorsPolicy", builder =>
        builder.WithOrigins("http://localhost:5173", "https://blogplatform.azurewebsites.net")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// Add services to the container.
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

// Hent URI til Key Vault fra appsettings.json
var keyVaultUri = builder.Configuration["KeyVault:Uri"];

// Legg til Azure Key Vault til konfigurasjonen
builder.Configuration.AddAzureKeyVault(new Uri(keyVaultUri), new DefaultAzureCredential());

// Add services to the container.
var connectionString = builder.Configuration["blogPlatformDefaultConnection"];

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<DataContext>();

// Etter å ha lagt til Key Vault, hent konfigurasjonsverdier
var azureBlobStorageConnectionString = builder.Configuration["blogPlatformBlobStorageConnectionString"];

// Bruk verdien til å konfigurere Azure blob storage
builder.Services.AddSingleton(s => new Azure.Storage.Blobs.BlobServiceClient(azureBlobStorageConnectionString));

builder.Services.AddScoped<IAzureBlobService, AzureBlobService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.MapIdentityApi<IdentityUser>();
app.UseCors("MyCorsPolicy");
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<CommentHub>("/commentHub");
app.MapFallbackToFile("index.html");

app.Run();
