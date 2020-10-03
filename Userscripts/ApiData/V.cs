using System;
using Microsoft.Extensions.Configuration;
using RestSharp;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Userscripts.Models;

namespace Userscripts.ApiData
{
    public class V
    {
        private readonly RestClient _client;
        private readonly string _apiKey;

        public V(IConfiguration configuration)
        {
            IConfigurationSection configurationSection =
                configuration.GetSection("APIKeys");
            _apiKey = configurationSection["V"];
            _client = new RestClient("https://v.enl.one")
                { Timeout = -1, UserAgent = "Userscripts" };
        }

        public VUser GetAgentName(string googleId)
        {
            RestRequest request = new RestRequest($"/api/v1/agent/{googleId}/trust?apikey={_apiKey}", Method.GET);
            IRestResponse response = _client.Execute(request);
            try
            {
                VObject vo = JsonConvert.DeserializeObject<VObject>(response.Content);
                return vo.status.Equals("error", StringComparison.InvariantCultureIgnoreCase) ? null : vo.VUser;
            }
            catch (System.Exception)
            {
                return null;
            }
        }
    }
}