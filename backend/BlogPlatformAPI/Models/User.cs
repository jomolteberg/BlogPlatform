using Microsoft.AspNetCore.Identity;

namespace BlogPlatformAPI.Models;

public class User : IdentityUser
{
    // Add new properties for first name, last name, and profile image URL
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfileImageUrl { get; set; }
}