using Microsoft.Extensions.Configuration;
using RestSharp;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Userscripts.Models;

namespace Userscripts.ApiData
{
    public class Rocks
    {
        private readonly RestClient _client;
        private readonly string _apiKey;

        public Rocks(IConfiguration configuration)
        {
            IConfigurationSection configurationSection =
                configuration.GetSection("APIKeys");
            _apiKey = configurationSection["Rocks"];
            _client = new RestClient("https://enlightened.rocks/api/user/status/")
                {Timeout = -1, UserAgent = "Userscripts"};
        }

        public RocksUser GetAgentName(string googleId)
        {
            RestRequest request = new RestRequest(googleId, Method.GET) {AlwaysMultipartFormData = true};
            request.AddParameter("apikey", _apiKey);
            IRestResponse response = _client.Execute(request);
            try
            {
                return JsonConvert.DeserializeObject<RocksUser>(response.Content);
            }
            catch (System.Exception)
            {
                return null;
            }
        }
    }
}