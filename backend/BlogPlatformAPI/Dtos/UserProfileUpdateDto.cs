namespace BlogPlatformAPI.Dtos;

public class UserProfileUpdateDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public IFormFile? ProfileImage { get; set; }
}