using Microsoft.EntityFrameworkCore;
using gt_turing_backend.Models;

namespace gt_turing_backend.Data
{
    /// <summary>
    /// Application Database Context / Contexto de Base de Datos de la Aplicación
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Circuit> Circuits { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Role);
                
                entity.Property(e => e.Role)
                    .HasConversion<string>();
            });

            // Car configuration
            modelBuilder.Entity<Car>(entity =>
            {
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.Status);
                
                entity.Property(e => e.Type)
                    .HasConversion<string>();
                
                entity.Property(e => e.Status)
                    .HasConversion<string>();
                
                entity.Property(e => e.PricePerDay)
                    .HasPrecision(10, 2);
            });

            // Circuit configuration
            modelBuilder.Entity<Circuit>(entity =>
            {
                entity.HasIndex(e => e.Province);
                entity.HasIndex(e => e.IsAvailable);
                
                entity.Property(e => e.SurfaceType)
                    .HasConversion<string>();
                
                entity.Property(e => e.WidthMeters)
                    .HasPrecision(5, 2);
            });

            // Reservation configuration
            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.CarId);
                entity.HasIndex(e => e.CircuitId);
                entity.HasIndex(e => new { e.StartDate, e.EndDate });
                
                entity.Property(e => e.Status)
                    .HasConversion<string>();
                
                entity.Property(e => e.TotalPrice)
                    .HasPrecision(10, 2);

                // Relationships
                entity.HasOne(r => r.User)
                    .WithMany(u => u.Reservations)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Car)
                    .WithMany(c => c.Reservations)
                    .HasForeignKey(r => r.CarId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Circuit)
                    .WithMany(c => c.Reservations)
                    .HasForeignKey(r => r.CircuitId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Conversation configuration
            modelBuilder.Entity<Conversation>(entity =>
            {
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.Status);
                
                entity.Property(e => e.Status)
                    .HasConversion<string>();

                // Relationships
                entity.HasOne(c => c.User)
                    .WithMany(u => u.Conversations)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Admin)
                    .WithMany()
                    .HasForeignKey(c => c.AdminId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Message configuration
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasIndex(e => e.ConversationId);
                entity.HasIndex(e => e.SenderId);

                // Relationships
                entity.HasOne(m => m.Conversation)
                    .WithMany(c => c.Messages)
                    .HasForeignKey(m => m.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.Sender)
                    .WithMany(u => u.Messages)
                    .HasForeignKey(m => m.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
