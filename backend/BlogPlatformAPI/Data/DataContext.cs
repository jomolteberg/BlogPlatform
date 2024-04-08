using BlogPlatformAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BlogPlatformAPI.Data;

public class DataContext : IdentityDbContext<IdentityUser>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }
    
    public DbSet<BlogPost> BlogPosts { get; set; } 
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // If you have a custom User class with additional properties, configure it here
        // For example, if User now includes FirstName, LastName, ProfileImageUrl
        modelBuilder.Entity<User>(user =>
        {
            user.Property(u => u.FirstName).HasMaxLength(100);
            user.Property(u => u.LastName).HasMaxLength(100);
            user.Property(u => u.ProfileImageUrl).HasMaxLength(255);
        });

        
        modelBuilder.Entity<BlogPost>()
            .HasOne(b => b.Author) 
            .WithMany()
            .HasForeignKey(b => b.AuthorId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Oppdater relasjonen mellom Comments og BlogPosts for å unngå kaskadeslettingsproblemet
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.BlogPost)
            .WithMany()
            .HasForeignKey(c => c.BlogPostId)
            .IsRequired(true)
            .OnDelete(DeleteBehavior.Restrict); // Endre til Restrict for å forhindre kaskadesletting

    }




}