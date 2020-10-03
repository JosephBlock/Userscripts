using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Userscripts.Data;
using Userscripts.Models;

namespace Userscripts.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserscriptsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private ApplicationUser _currentUser;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserscriptsController(ApplicationDbContext context, UserManager<ApplicationUser> um)
        {
            _context = context;
            _userManager = um;
        }

        // GET: api/Userscripts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Userscript>>> GetUserscripts()
        {
            return await _context.Userscripts.ToListAsync();
        }

        // GET: api/Userscripts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Userscript>> GetUserscript(Guid id)
        {
            Userscript userscript = await _context.Userscripts.Where(x => x.ScriptId == id).Include(u => u.Creator).Include(x =>x.Categories).ThenInclude(x=>x.Category)
                .FirstOrDefaultAsync();

            if (userscript == null)
            {
                return NotFound();
            }

            userscript.Script = ApplyHeader(userscript);
            userscript.Creator = SanitizeUser(userscript.Creator);
            return userscript;
        }

        private ApplicationUser SanitizeUser(ApplicationUser user)
        {
            return new ApplicationUser(){UserName = user.UserName,Id = user.Id};
        }

        // GET: api/Userscripts/5
        [AllowAnonymous]
        [HttpGet("{id}.meta.js")]
        [HttpGet("{id}.user.js")]
        public async Task<ActionResult<string>> GetUserscriptDownload(Guid id)
        {
            Userscript userscript = await _context.Userscripts.Where(x => x.ScriptId == id).Include(u => u.Creator)
                .FirstOrDefaultAsync();

            if (userscript == null)
            {
                return NotFound();
            }

            Response.ContentType = "application/javascript";
            return ApplyHeader(userscript);
        }

        private string ApplyHeader(Userscript userscript)
        {
            StringBuilder sb = new StringBuilder();
            string url = HttpContext.Request.GetDisplayUrl();
            string description = Regex.Replace(userscript.Description, @"\t|\n|\r", " ");
            sb.AppendLine($"// ==UserScript==");
            sb.AppendLine($"// @name        {userscript.ScriptName}");
            sb.AppendLine($"// @description {description}");
            sb.AppendLine($"// @version     1.{userscript.VersionNumber}");
            sb.AppendLine($"// @downloadURL {url}");
            sb.AppendLine($"// @author      {userscript.Creator.UserName}");
            sb.AppendLine(userscript.Script);
            return sb.ToString();
        }

        // PUT: api/Userscripts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ActionResult<Object>> PutUserscript(Guid id, Userscript userscript)
        {
            Userscript previousVersion = await _context.Userscripts.FindAsync(id);
            string userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            _currentUser = _userManager.FindByIdAsync(userId).Result;
            // check user can edit
            if (_currentUser.Id != previousVersion.Creator.Id)
            {
                return Unauthorized();
            }

            int version = previousVersion.VersionNumber;
            _context.UserscriptVersions.Add(new UserscriptVersions
            {
                PreviousVersion = previousVersion.Script, Script = previousVersion,
                VersionCreationTime = previousVersion.LastUpdated, VersionNumber = version
            });
            version += 1;
            previousVersion.VersionNumber = version;

            // strip unneeded header lines
            StringBuilder sb = StripHeader(userscript.Script);
            previousVersion.Script = sb.ToString();

            _context.Entry(previousVersion).State = EntityState.Modified;

            dynamic success = new ExpandoObject();
            success.Success = false;
            try
            {
                await _context.SaveChangesAsync();
                success.Success = true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserscriptExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return success;
        }

        // POST: api/Userscripts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Userscript>> PostUserscript(Userscript userscript)
        {
            string id = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            _currentUser = _userManager.FindByIdAsync(id).Result;
            userscript.Creator = _currentUser;
            userscript.Created = DateTime.UtcNow;

            //filter out unwanted headers
            StringBuilder sb = StripHeader(userscript.Script);
            userscript.Script = sb.ToString();

            _context.Userscripts.Add(userscript);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserscript", new {id = userscript.ScriptId}, userscript);
        }

        // DELETE: api/Userscripts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Userscript>> DeleteUserscript(Guid id)
        {
            Userscript userscript = await _context.Userscripts.FindAsync(id);
            if (userscript == null)
            {
                return NotFound();
            }

            _context.Userscripts.Remove(userscript);
            await _context.SaveChangesAsync();

            return userscript;
        }

        private bool UserscriptExists(Guid id)
        {
            return _context.Userscripts.Any(e => e.ScriptId == id);
        }

        private StringBuilder StripHeader(string script)
        {
            StringBuilder sb = new StringBuilder();
            List<string> regex = new List<string>
            {
                @".*\/\/.*==UserScript==.*",
                @".*\/\/.*@author.*",
                @".*\/\/.*@version.*",
                @".*\/\/.*@name.*",
                @".*\/\/.*@updateURL.*",
                @".*\/\/.*@downloadURL.*",
                @".*\/\/.*@description.*",
            };
            string regexString = string.Join("|", regex);
            Regex rg = new Regex(regexString, RegexOptions.Compiled | RegexOptions.IgnoreCase);
            string[] lines = script.Split(
                new[] {"\r\n", "\r", "\n"},
                StringSplitOptions.None
            );
            foreach (string line in lines)
            {
                Match found = rg.Match(line);
                if (!found.Success)
                {
                    sb.AppendLine(line);
                }
            }

            return sb;
        }
    }
}