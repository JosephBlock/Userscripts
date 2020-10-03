using Newtonsoft.Json;

namespace Userscripts.Models
{
    public class RocksUser
    {
        [JsonProperty("agentid")] public string AgentName { get; set; }
        [JsonProperty("gid")] public string GoogleId { get; set; }
        [JsonProperty("name")] public string Name { get; set; }
        [JsonProperty("smurf")] public bool Smurf { get; set; }
        [JsonProperty("tgid")] public int TelegramId { get; set; }
        [JsonProperty("verified")] public bool Verified { get; set; }
    }
}