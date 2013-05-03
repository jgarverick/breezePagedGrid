using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi;
using SampleObjects;

namespace breezeGridExample.Controllers
{
    [BreezeController]
    public class ContextController : ApiController
    {
        readonly Breeze.WebApi.EFContextProvider<UserDbContext> _context = new EFContextProvider<UserDbContext>();

        [HttpGet]
        public string Metadata()
        {
            return _context.Metadata();
        }

        [HttpGet]
        public IQueryable<User> Users()
        {
            return _context.Context.Users;
        }
    }
}
