using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BlogPlatformAPI.Data;
using BlogPlatformAPI.Dtos;
using BlogPlatformAPI.Interfaces;
using BlogPlatformAPI.Models;
using Ganss.Xss;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace BlogPlatformAPI.Controllers;

[ApiController]
[Route("[controller]")] 
public class BlogPostController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IAzureBlobService _azureBlobService;
    private readonly HtmlSanitizer _sanitizer;

    public BlogPostController(DataContext context, UserManager<IdentityUser> userManager, IAzureBlobService azureBlobService, HtmlSanitizer htmlSanitizer)
    {
        _context = context;
        _userManager = userManager;
        _azureBlobService = azureBlobService;
        _sanitizer = htmlSanitizer;
    }

    [HttpGet]
    public async Task<IActionResult> GetBlogPosts()
    {
        var blogPosts = await _context.BlogPosts.ToListAsync();
        return Ok(blogPosts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBlogPost(int id)
    {
        var blogPost = await _context.BlogPosts.FindAsync(id);
        if (blogPost == null)
        {
            return NotFound();
        }
        return Ok(blogPost);
    }

    [HttpPost]
    [Authorize] 
    public async Task<IActionResult> CreateBlogPost([FromForm] BlogPostDto blogPostDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Attempt to retrieve the currently authenticated user
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            // Respond with a 404 Not Found if we can't identify the user
            // This could be changed to a 403 Forbidden, depending on your application's requirements
            return NotFound("User not found. Make sure you're logged in and try again.");
        }
        
        // Upload image to Azure Blob Storage and get the URL
        string imageUrl = string.Empty;
        if (blogPostDto.ImageFile != null)
        {
            imageUrl = await UploadImageToAzureAsync(blogPostDto.ImageFile);
        }

        var blogPost = new BlogPost
        {
            Title = blogPostDto.Title,
            Content = _sanitizer.Sanitize(blogPostDto.Content),
            ImageUrl = imageUrl,
            AuthorId = user.Id, // Assuming your BlogPost model has an AuthorId to link to the User
            AuthorEmail = user.Email,
            PublishedDate = DateTime.UtcNow, // Optionally set the published date to now
            UpdatedDate = DateTime.UtcNow, // Optionally set the updated date to now
        };

        _context.BlogPosts.Add(blogPost);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBlogPost), new { id = blogPost.Id }, blogPost);
    }
    
    private async Task<string> UploadImageToAzureAsync(IFormFile imageFile)
    {
        var containerName = "blogplatform"; // Specify your container name
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName); // Create a unique file name
        var contentType = imageFile.ContentType;

        using (var stream = imageFile.OpenReadStream())
        {
            return await _azureBlobService.UploadFileAsync(containerName, stream, fileName, contentType);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBlogPost(int id, [FromBody] BlogPost model)
    {
        if (id != model.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var blogPost = await _context.BlogPosts.FindAsync(id);
        if (blogPost == null)
        {
            return NotFound();
        }

        var user = await _userManager.GetUserAsync(User);
        if (blogPost.AuthorId != user.Id)
        {
            return Forbid();
        }

        // Update properties
        blogPost.Title = model.Title;
        blogPost.Content = _sanitizer.Sanitize(model.Content);
        _context.Entry(blogPost).State = EntityState.Modified;

        await _context.SaveChangesAsync(); // Persist changes
        return Ok(blogPost);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBlogPost(int id)
    {
        var blogPost = await _context.BlogPosts.FindAsync(id);
        if (blogPost == null)
        {
            return NotFound();
        }

       /* var user = await _userManager.GetUserAsync(User);
        if (blogPost.AuthorId != user.Id)
        {
            return Forbid();
        }
        */

        _context.BlogPosts.Remove(blogPost);
        await _context.SaveChangesAsync(); // Persist changes
        return NoContent();
    }
}
