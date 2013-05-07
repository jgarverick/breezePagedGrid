namespace SampleObjects.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SampleObjects.UserDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(SampleObjects.UserDbContext context)
        {
            if (context.Users.Count() == 0)
            {
                context.Users.Add(new User()
                {
                    DisplayName = "John Smith",
                    IsActive = true,
                    UserName = "Schmitty"

                });
                context.Users.Add(new User()
                {
                    DisplayName = "Jane Smith",
                    IsActive = true,
                    UserName = "Schmittens"

                });

            }
        }
    }
}
