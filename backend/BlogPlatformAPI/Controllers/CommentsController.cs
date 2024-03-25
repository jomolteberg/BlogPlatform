using BlogPlatformAPI.Data;
using BlogPlatformAPI.Dtos;
using BlogPlatformAPI.Hubs;
using BlogPlatformAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class CommentsController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IHubContext<CommentHub> _hubContext;

    public CommentsController(DataContext context, UserManager<IdentityUser> userManager, IHubContext<CommentHub> hubContext)
    {
        _context = context;
        _userManager = userManager;
        _hubContext = hubContext;
    }

    [HttpPost("{blogPostId}")]
    [Authorize] // Sørg for at brukeren er autentisert
    public async Task<IActionResult> CreateComment(int blogPostId, [FromBody] CreateCommentDTO commentDTO)
    {
        // Hent den autentiserte brukerens ID
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized("User is not logged in.");
        }

        var comment = new Comment
        {
            UserId = user.Id,
            BlogPostId = blogPostId,
            Text = commentDTO.Text,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        // Oppdater til å inkludere relevant informasjon om kommentaren som skal sendes
        // Husk å tilpasse dette basert på din CommentType definisjon i frontend
        var commentToSend = new
        {
            comment.Id,
            comment.Text,
            comment.CreatedAt,
            UserName = user.UserName, // Anta at brukernavn er tilgjengelig via user.UserName
            comment.BlogPostId
        };

        // Send meldingen til alle tilkoblede klienter
        await _hubContext.Clients.All.SendAsync("ReceiveComment", commentToSend);

        return Ok(comment);
    }

    
    [HttpGet("ByBlogPost/{blogPostId}")]
    public async Task<IActionResult> GetCommentsByBlogPost(int blogPostId)
    {
        var comments = await _context.Comments
            .Where(c => c.BlogPostId == blogPostId)
            .ToListAsync();
        return Ok(comments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
        {
            return NotFound();
        }
        return Ok(comment);
    }

    [HttpPut("{id}")]
    [Authorize] // Sørg for at kun autentiserte brukere kan redigere kommentarer
    public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentDto commentDTO)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
        {
            return NotFound();
        }

        // Sjekk for å sikre at brukeren eier kommentaren
        var user = await _userManager.GetUserAsync(User);
        if (comment.UserId != user.Id)
        {
            return Forbid("You do not have permission to edit this comment.");
        }

        comment.Text = commentDTO.Text;
        await _context.SaveChangesAsync();

        return Ok(comment);
    }


    [HttpDelete("{id}")]
    [Authorize] // Sikrer at kun autentiserte brukere kan slette kommentarer
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
        {
            return NotFound();
        }

        // Ekstra sjekk for å sikre at brukeren eier kommentaren eller er en admin
        var user = await _userManager.GetUserAsync(User);
        if (comment.UserId != user.Id && !User.IsInRole("Admin")) // Anta en "Admin" rolle, juster etter dine behov
        {
            return Forbid("You do not have permission to delete this comment.");
        }

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return NoContent(); // En NoContent (204) respons indikerer en vellykket sletting
    }


}