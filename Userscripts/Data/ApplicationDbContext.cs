using Userscripts.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Duende.IdentityServer.EntityFramework.Options;

namespace Userscripts.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<WhitelistItem> Whitelist { get; set; }
        public DbSet<WhitelistAssociation> WhitelistAssociations { get; set; }
        public DbSet<Userscript> Userscripts { get; set; }
        public DbSet<UserscriptComments> UserscriptComments { get; set; }
        public DbSet<Images> Images { get; set; }
        public DbSet<UserscriptRating> UserscriptRatings { get; set; }
        public DbSet<UserscriptVersions> UserscriptVersions { get; set; }
        public DbSet<UserscriptCategory> UserscriptCategories { get; set; }
        public DbSet<Category> Category { get; set; }
    }
}