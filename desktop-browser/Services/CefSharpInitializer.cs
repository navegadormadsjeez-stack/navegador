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

        var depsOkMarker = Path.Combine(appDataRoot, ".cef-deps-verified");
        var skipDependencyCheck = File.Exists(depsOkMarker);

        Cef.Initialize(settings, performDependencyCheck: !skipDependencyCheck, browserProcessHandler: null);

        if (!skipDependencyCheck)
        {
            try { File.WriteAllText(depsOkMarker, DateTime.UtcNow.ToString("O")); }
            catch { /* ignore */ }
        }

        _initialized = true;
    }

    public static bool IsInitialized => _initialized;
}
