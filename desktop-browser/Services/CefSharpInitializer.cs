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
            LogSeverity = LogSeverity.Warning,
            // User-Agent estándar Chromium/Chrome — evita bloqueos de Google por "tráfico inusual"
        };

        settings.CefCommandLineArgs.Add("enable-media-stream", "1");
        settings.CefCommandLineArgs.Add("disable-features", "HardwareMediaKeyHandling");

        Cef.Initialize(settings, performDependencyCheck: true, browserProcessHandler: null);
        _initialized = true;
    }

    public static bool IsInitialized => _initialized;
}
