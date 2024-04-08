using BlogPlatformAPI.Dtos;
using BlogPlatformAPI.Interfaces;
using BlogPlatformAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BlogPlatformAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IAzureBlobService _azureBlobService;

    public UserController(UserManager<User> userManager, IAzureBlobService azureBlobService)
    {
        _userManager = userManager;
        _azureBlobService = azureBlobService;
    }

    [HttpPost("UpdateProfile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile(
        [FromForm] UserProfileUpdateDto model)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        
        if (model.ProfileImage != null)
        {
            string imageUrl = await UploadImageToAzureAsync(model.ProfileImage);
            user.ProfileImageUrl = imageUrl;
        }

        user.FirstName = model.FirstName;
        user.LastName = model.LastName;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest("Failed to update user profile.");
        }

        return Ok(new { success = true, message = "Profile updated successfully.", imageUrl = user.ProfileImageUrl });

    }
    
    private async Task<string> UploadImageToAzureAsync(IFormFile imageFile)
    {
        var containerName = "blogplatform";
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
        var contentType = imageFile.ContentType;

        await using var stream = imageFile.OpenReadStream();
        return await _azureBlobService.UploadFileAsync(containerName, stream, fileName, contentType);
    }
}