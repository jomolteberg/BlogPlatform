using System.ComponentModel.DataAnnotations;

namespace BlogPlatformAPI.Dtos;

public class BlogPostDto
{
    [Required]
    [StringLength(255)]
    public string Title { get; set; }

    [Required]
    public string Content { get; set; }
    
    // The actual URL after uploading to Azure will be stored in the ImageUrl property of your model.
    public IFormFile? ImageFile { get; set; }
}