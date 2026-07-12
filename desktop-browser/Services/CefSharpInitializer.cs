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

        var settings = new CefSettings
        {
            CachePath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "MadsjeezSellerBrowser", "Cache"),
            LogSeverity = LogSeverity.Warning,
            UserAgent = "MadsjeezSellerBrowser/0.1.0 (Windows; Seller OS)",
        };

        settings.CefCommandLineArgs.Add("enable-media-stream", "1");
        settings.CefCommandLineArgs.Add("disable-features", "HardwareMediaKeyHandling");

        Cef.Initialize(settings, performDependencyCheck: true, browserProcessHandler: null);
        _initialized = true;
    }

    public static void SetProfileCachePath(string profileId)
    {
        var cachePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "MadsjeezSellerBrowser", "Profiles", profileId);

        Directory.CreateDirectory(cachePath);
    }
}
