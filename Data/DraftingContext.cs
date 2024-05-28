using Microsoft.EntityFrameworkCore;
using ProjectOlympia;

public class DraftingContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Draft> Drafts { get; set; }
    public DbSet<Athlete> Athletes { get; set; }
    public DbSet<Medal> Medals { get; set; }

    public DraftingContext(DbContextOptions options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Athlete>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(false);
    }
}