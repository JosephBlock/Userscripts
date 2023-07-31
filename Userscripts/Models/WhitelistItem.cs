using System;
using System.ComponentModel.DataAnnotations;

namespace Userscripts.Models
{
    public class WhitelistItem
    {
        [Key] public string GoogleId { get; set; }
        public string Note { get; set; }
        public string AgentName { get; set; }
    }

    public class WhitelistAssociation
    {
        [Key] public Guid WhiteListAssociationId { get; set; }

        public virtual WhitelistItem AgentAdded { get; set; }
        public virtual ApplicationUser AgentAddedBy { get; set; }
    }
}