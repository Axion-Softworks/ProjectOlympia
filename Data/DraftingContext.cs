using Microsoft.EntityFrameworkCore;
using ProjectOlympia;

public class DraftingContext : DbContext
{
    public DbSet<Player> Players { get; set; }
    public DbSet<Draft> Drafts { get; set; }
    public DbSet<Athlete> Athletes { get; set; }
    public DbSet<Medal> Medals { get; set; }

    public DraftingContext(DbContextOptions options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Athlete>()
            .HasOne(p => p.Player)
            .WithMany()
            .HasForeignKey(p => p.PlayerId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(false);
    }
}