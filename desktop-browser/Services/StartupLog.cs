using System.IO;

namespace MadsjeezSellerBrowser.Services;

internal static class StartupLog
{
    private static readonly string LogPath = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "MadsjeezSellerBrowser",
        "logs",
        "startup.log");

    public static void Write(string message)
    {
        try
        {
            var dir = Path.GetDirectoryName(LogPath)!;
            Directory.CreateDirectory(dir);
            var line = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}{Environment.NewLine}";
            File.AppendAllText(LogPath, line);
        }
        catch
        {
            /* logging must never block startup */
        }
    }
}
