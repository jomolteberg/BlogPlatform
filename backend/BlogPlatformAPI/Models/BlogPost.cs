using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

public class BlogPost
{
    public int Id { get; set; }
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;
    
    [Required]
    [StringLength(255)]
    public string ImageUrl { get; set; } = string.Empty;

    public DateTime PublishedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    public string AuthorId { get; set; } = string.Empty; // Fjernet StringLength-attributtet
    [StringLength(255)]
    public string? AuthorEmail { get; set; } = string.Empty;

    public virtual IdentityUser Author { get; set; }
}