using Microsoft.AspNetCore.Mvc.Formatters;

namespace Userscripts.formatters
{
    public class JavascriptOutputFormatter : StringOutputFormatter
    {
        public JavascriptOutputFormatter()
        {
            SupportedMediaTypes.Add("application/javascript");
        }
     }
}