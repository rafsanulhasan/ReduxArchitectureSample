using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReduxArchitecture.Infrastructure.Identity;
using ReduxArchitecture.Infrastructure.Persistence;
using static ReduxArchitecture.WebUI.Constants.SpaConstants;

namespace ReduxArchitecture.WebUI;

public class Program
{
    public async static Task Main(string[] args)
    {
        var apiHost = CreateApiHostBuilder(args).Build();
        await apiHost.RunAsync();
    }

    public static IHostBuilder CreateApiHostBuilder(string[] args) =>
        Host
            .CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder
                    .UseKestrel((ctx, opt)
                        => opt.ConfigureEndpointDefaults(listenOptions
                                => listenOptions.UseHttps()))
                    .UseUrls(AppHosts.ApiApp.FullHost)
                    .UseIISIntegration();
                webBuilder.ConfigureServices(services =>
                {
                    services.AddLogging(b => b.AddDebug().AddConsole().AddEventLog().AddEventSourceLogger());
                });
                webBuilder.UseStartup<Startup>();
            });
}
