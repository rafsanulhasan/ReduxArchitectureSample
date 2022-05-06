namespace ReduxArchitecture.WebUI.Constants;

public static class SpaConstants
{
    public static class AppPaths
    {
        public const string AngularApp = "NgApp";
    }

    public static class AppHosts
    {
        public static readonly AppHost AngularApp = new("http", "localhost", 5200);
    }

    public static class NpmScripts
    {
        public const string AngluarScript = "start";
    }

    public record AppHost(string Scheme, string Host, int Port)
    {
        public string FullHost => $"{Scheme}://{Host}:{Port}";
    }
}
