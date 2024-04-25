using System.ComponentModel.DataAnnotations;

namespace Staff_Management.Models
{
    public class Staff
    {
        [Key]
        public string StaffID { get; set; } // String(8)
        public string FullName { get; set; } // String(100)
        public DateTime Birthday { get; set; } // Date
        public int Gender { get; set; } // Int (1: Male, 2: Female)
    }
}
