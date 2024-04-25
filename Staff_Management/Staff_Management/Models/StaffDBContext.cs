using Microsoft.EntityFrameworkCore;

namespace Staff_Management.Models
{
    public class StaffDBContext:DbContext
    {
        public StaffDBContext(DbContextOptions options) : base(options) { 
        
        }

        public DbSet<Staff> Staff { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }
    }
}
