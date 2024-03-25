using Microsoft.AspNetCore.Identity;

namespace BlogPlatformAPI.Models;

public class Comment
{
    public int Id { get; set; }
    public string UserId { get; set; } // Lenke til IdentityUser
    public int BlogPostId { get; set; } // Lenke til BlogPost
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigasjonsegenskaper
    public virtual BlogPost BlogPost { get; set; }
    public virtual IdentityUser User { get; set; }
}
