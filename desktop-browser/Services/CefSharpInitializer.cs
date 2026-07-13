using System.IO;
using CefSharp;
using CefSharp.Wpf;

namespace MadsjeezSellerBrowser;

public static class CefSharpInitializer
{
    private static bool _initialized;

    public static void Initialize()
    {
        if (_initialized) return;

        var appDataRoot = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "MadsjeezSellerBrowser");
        var cefRoot = Path.Combine(appDataRoot, "CefCache");
        Directory.CreateDirectory(Path.Combine(cefRoot, "cache"));

        var settings = new CefSettings
        {
            LogSeverity = LogSeverity.Warning,
            RootCachePath = cefRoot,
            CachePath = Path.Combine(cefRoot, "cache"),
            LogFile = Path.Combine(appDataRoot, "logs", "cef.log"),
        };

        settings.CefCommandLineArgs.Add("enable-media-stream", "1");
        settings.CefCommandLineArgs.Add("disable-features", "HardwareMediaKeyHandling");

        Cef.Initialize(settings, performDependencyCheck: true, browserProcessHandler: null);
        _initialized = true;
    }

    public static bool IsInitialized => _initialized;
}
