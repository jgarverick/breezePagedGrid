using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;

namespace SampleObjects
{
    public class UserDbContext: DbContext
    {
        public DbSet<User> Users { get; set; }
    }
}
