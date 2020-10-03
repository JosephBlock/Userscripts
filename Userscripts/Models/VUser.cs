using Newtonsoft.Json;

namespace Userscripts.Models
{
    public class VUser
    {
        [JsonProperty("agent")] public string AgentName { get; set; }
        [JsonProperty("level")] public int Level { get; set; }
        [JsonProperty("vlevel")] public int VLevel { get; set; }
        [JsonProperty("vpoints")] public int VPoints { get; set; }
        [JsonProperty("verified")] public bool Verified { get; set; }
        [JsonProperty("active")] public bool Active { get; set; }
        [JsonProperty("flagged")] public bool Flagged { get; set; }
        [JsonProperty("quarantine")] public bool Quarantine { get; set; }
        [JsonProperty("banned_by_nia")] public bool NIABanned { get; set; }
        [JsonProperty("blacklisted")] public bool Blacklisted { get; set; }
    }

    public class VObject
    {
        public string status { get; set; }
        [JsonProperty("data")]
        public VUser VUser { get; set; }
    }
}