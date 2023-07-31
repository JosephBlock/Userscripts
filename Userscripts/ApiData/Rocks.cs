using Microsoft.Extensions.Configuration;
using RestSharp;
using Newtonsoft.Json;
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
            _client = new RestClient("https://enlightened.rocks/api/user/status/");
        }

        public RocksUser GetAgentName(string googleId)
        {
            RestRequest request = new(googleId) {AlwaysMultipartFormData = true};
            request.AddParameter("apikey", _apiKey);
            RestResponse response = _client.Execute(request);
            try
            {
                if (response.Content != null) return JsonConvert.DeserializeObject<RocksUser>(response.Content);
            }
            catch (System.Exception)
            {
                return null;
            }

            return null;
        }
    }
}