using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Userscripts.Models
{
    public class Userscript
    {
        [Key] public Guid ScriptId { get; set; }
        public string ScriptName { get; set; }
        public string Script { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime LastUpdated { get; set; }

        public int VersionNumber { get; set; } = 0;
        public virtual ApplicationUser Creator { get; set; }
        public virtual ICollection<UserscriptCategory> Categories { get; set; }
    }

    public class UserscriptRating
    {
        [Key] public Guid ScriptRatingId { get; set; }
        public virtual Userscript Script { get; set; }
        public long Rating { get; set; }
        public DateTime RatingCalculatedTimestamp { get; set; }
    }

    public class UserscriptComments
    {
        [Key] public Guid UserscriptCommentId { get; set; }
        public string Comment { get; set; }
        public virtual ApplicationUser User { get; set; }
        public bool Hidden { get; set; }
        public int Rating { get; set; }
    }

    public class UserscriptVersions
    {
        [Key] public Guid ScriptVersionId { get; set; }
        public virtual Userscript Script { get; set; }
        public string PreviousVersion { get; set; }
        public DateTime VersionCreationTime { get; set; }
        public int VersionNumber { get; set; }
    }

    public class UserscriptCategory
    {
        [Key] public int UserscriptCategoryId { get; set; }
        public Guid CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }

    public class Category
    {
        [Key] public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}