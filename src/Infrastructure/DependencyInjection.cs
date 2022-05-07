using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ReduxArchitecture.Application.Common.Interfaces;
using ReduxArchitecture.Infrastructure.Files;
using ReduxArchitecture.Infrastructure.Identity;
using ReduxArchitecture.Infrastructure.Persistence;
using ReduxArchitecture.Infrastructure.Services;

namespace ReduxArchitecture.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment hostEnvironment)
    {
        if (configuration.GetValue<bool>("UseInMemoryDatabase"))
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("ReduxArchitectureDb"));
        }
        else
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options
                    .UseSqlServer(
                        configuration.GetConnectionString("DefaultConnection"),
                        b =>
                        {
                            b.EnableRetryOnFailure(3);
                            b.CommandTimeout(10);
                            b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                        })
                    .EnableDetailedErrors(hostEnvironment.IsDevelopment())
                    .EnableDetailedErrors(hostEnvironment.IsDevelopment())
            );
        }

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<IDomainEventService, DomainEventService>();

        services
            .AddDefaultIdentity<ApplicationUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services
            .AddIdentityServer()
            .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

        services.AddTransient<IDateTime, DateTimeService>();
        services.AddTransient<IIdentityService, IdentityService>();
        services.AddTransient<ICsvFileBuilder, CsvFileBuilder>();

        services
            .AddAuthentication()
            .AddIdentityServerJwt();

        services
            .AddAuthorization(options =>
                options.AddPolicy(
                    "CanPurge",
                    policy => policy.RequireRole("Administrator")));

        return services;
    }
}
