using System;
using System.ComponentModel.DataAnnotations;

namespace Userscripts.Models
{
    public class Images
    {
        [Key] public Guid ImageGuid { get; set; }
        public string ImageDescription { get; set; }
    }
}