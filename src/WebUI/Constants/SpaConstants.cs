namespace ReduxArchitecture.WebUI.Constants;

public static class SpaConstants
{
    public static class AppModes
    {
        public const string AngularApp = "Angular";
        public const string ReactApp = "React";
    }

    public static class AppPaths
    {
        public const string AngularApp = "NgApp";
        public const string ReactApp = "ReactApp";
    }

    public static class AppPorts
    {
        public const int NodeAppPort = 5201;
        public const int ApiPort = 5200;
    }

    public static class AppHosts
    {
        public static readonly AppHost ApiApp = new("https", "localhost", AppPorts.ApiPort);
        public static readonly AppHost NodeApp = new("https", "localhost", AppPorts.NodeAppPort);
    }
    public static class DistributionFolders
    {
        public const string AngularApp = "dist";
        public const string ReactApp = "build";
    }

    public static class NpmScripts
    {
        public const string AngluarScript = "start";
        public const string ReactScript = "start";
    }

    public record AppHost(string Scheme, string Host, int Port)
    {
        public string FullHost => $"{Scheme}://{Host}:{Port}";
    }
}
