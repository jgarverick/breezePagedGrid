using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SampleObjects
{
    [Table("User")]
    public class User
    {
        [Key, DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [StringLength(100)]
        public string DisplayName { get; set; }

        [StringLength(100)]
        public string UserName { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}
