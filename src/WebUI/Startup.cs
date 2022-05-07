using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using NSwag;
using NSwag.Generation.Processors.Security;
using ReduxArchitecture.Application;
using ReduxArchitecture.Application.Common.Interfaces;
using ReduxArchitecture.Infrastructure;
using ReduxArchitecture.Infrastructure.Identity;
using ReduxArchitecture.Infrastructure.Persistence;
using ReduxArchitecture.WebUI.Filters;
using ReduxArchitecture.WebUI.Services;
using static ReduxArchitecture.WebUI.Constants.ConfigurationConstants;
using static ReduxArchitecture.WebUI.Constants.SpaConstants;

namespace ReduxArchitecture.WebUI;

public class Startup
{
    public IConfiguration Configuration { get; }
    public IWebHostEnvironment HostEnvironment { get; }
    public bool IsAngular { get; } = false;
    public bool IsReact { get; } = false;

    public Startup(
        IConfiguration configuration,
        IWebHostEnvironment hostEnvironment)
    {
        const string appModeKey = "AppMode";
        Configuration = configuration;
        HostEnvironment = hostEnvironment;
        IsAngular = Configuration[appModeKey].ToString().Equals(AppModes.AngularApp, StringComparison.OrdinalIgnoreCase);
        IsReact = Configuration[appModeKey].ToString().Equals(AppModes.ReactApp, StringComparison.OrdinalIgnoreCase);
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplication();
        services.AddInfrastructure(Configuration, HostEnvironment);

        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddSingleton<ICurrentUserService, CurrentUserService>();

        services.AddHttpContextAccessor();

        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>();

        services.AddControllersWithViews(options =>
            options.Filters.Add<ApiExceptionFilterAttribute>())
                .AddFluentValidation(x => x.AutomaticValidationEnabled = false);

        services.AddRazorPages();
        services.AddCors();

        // Customise default API behaviour
        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

        services.AddOpenApiDocument(configure =>
        {
            configure.Title = "ReduxArchitecture API";
            configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = OpenApiSecurityApiKeyLocation.Header,
                Description = "Type into the textbox: Bearer {your JWT token}."
            });

            configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
        });

        // In production, the Angular/React Spa files will be served from this directory

        var rootFolder = string.Empty;
        var distributionFolder = string.Empty;
        if (IsAngular)
        {
            rootFolder = AppPaths.AngularApp;
            distributionFolder = DistributionFolders.AngularApp;
        }
        else if (IsReact)
        {
            rootFolder = AppPaths.ReactApp;
            distributionFolder = DistributionFolders.ReactApp;
        }
        services
            .AddSpaStaticFiles(configuration =>
                configuration.RootPath = $@"{rootFolder}\{distributionFolder}");
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(
        IApplicationBuilder app,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<Startup> logger)
    {
        logger
            .LogInformation($"IsAngular: {IsAngular}");
        logger
            .LogInformation($"IsReact: {IsReact}");
        if (HostEnvironment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseMigrationsEndPoint();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }
        app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

        app.UseHealthChecks("/health");
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSpaStaticFiles();

        app.UseSwaggerUi3(settings =>
        {
            settings.Path = "/api";
            settings.DocumentPath = "/api/specification.json";
        });

        app.UseRouting();

        app.UseAuthentication();
        app.UseIdentityServer();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");
            endpoints.MapRazorPages();
        });

        app.UseSpa(spa =>
        {
            // To learn more about options for serving an Angular SPA from ASP.NET Core,
            // see https://go.microsoft.com/fwlink/?linkid=864501
            var sourcePath = string.Empty;
            var npmScript = string.Empty;
            Action<string> useDevServerDel = script => { };

            if (IsAngular)
            {
                sourcePath = AppPaths.AngularApp;
                npmScript = NpmScripts.AngluarScript;
                useDevServerDel = spa.UseAngularCliServer;
            }
            else if (IsReact)
            {
                sourcePath = AppPaths.ReactApp;
                npmScript = NpmScripts.ReactScript;
                useDevServerDel = spa.UseReactDevelopmentServer;
            }

            spa.Options.SourcePath = sourcePath;
            UseDevelopmentServer(useDevServerDel, npmScript);

            if (HostEnvironment.IsDevelopment())
            {
                if (IsAngular)
                {
                    spa.UseProxyToSpaDevelopmentServer(Configuration[AngularSpaBaseUrl] ?? AppHosts.NodeApp.FullHost);
                }
            }
        });

        MigrateAndSeed(context, userManager, roleManager, logger).GetAwaiter().GetResult();
    }

    private static void UseDevelopmentServer(
        Action<string> useDevServer,
        string npmScript)
        => useDevServer(npmScript);

    private static async Task MigrateAndSeed(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<Startup> logger)
    {
        var isDeleted = false;
        try
        {
            isDeleted = context.Database.EnsureDeleted();
            logger.LogInformation($"Database deleted: {isDeleted}");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating or seeding the database.");

            throw;
        }

        context.Database.Migrate();
        logger.LogInformation($"Database Migrated: {context.Database.GetConnectionString()}");

        await ApplicationDbContextSeed.SeedDefaultUserAsync(userManager, roleManager);
        await ApplicationDbContextSeed.SeedSampleDataAsync(context);
        logger.LogInformation("Data Seeded");
    }
}
