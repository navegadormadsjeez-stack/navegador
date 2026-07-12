using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Net.Http;
using System.Reflection;

namespace MadsjeezSellerBrowser.Services;

public class UpdateInstallerService
{
    private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromMinutes(15) };

    public static string GetAppVersion()
    {
        var info = Assembly.GetExecutingAssembly()
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
        if (!string.IsNullOrEmpty(info))
            return info.Split('+')[0];
        return Assembly.GetExecutingAssembly().GetName().Version?.ToString(3) ?? "0.0.0";
    }

    public async Task<string> DownloadAndExtractInstallerAsync(string downloadUrl, IProgress<string>? progress = null)
    {
        progress?.Report("Descargando actualización...");
        var tempDir = Path.Combine(Path.GetTempPath(), "MadsjeezSellerBrowser", "update");
        Directory.CreateDirectory(tempDir);

        var ext = Path.GetExtension(new Uri(downloadUrl).AbsolutePath).ToLowerInvariant();
        var downloadPath = Path.Combine(tempDir, ext == ".zip" ? "update.zip" : "MadsjeezSellerBrowserSetup.exe");

        using (var response = await Http.GetAsync(downloadUrl, HttpCompletionOption.ResponseHeadersRead))
        {
            response.EnsureSuccessStatusCode();
            await using var stream = await response.Content.ReadAsStreamAsync();
            await using var file = File.Create(downloadPath);
            await stream.CopyToAsync(file);
        }

        if (downloadPath.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
        {
            progress?.Report("Extrayendo instalador...");
            var extractDir = Path.Combine(tempDir, "extracted");
            if (Directory.Exists(extractDir))
                Directory.Delete(extractDir, recursive: true);
            ZipFile.ExtractToDirectory(downloadPath, extractDir);

            var setup = Directory.GetFiles(extractDir, "MadsjeezSellerBrowserSetup.exe", SearchOption.AllDirectories)
                .FirstOrDefault()
                ?? Directory.GetFiles(extractDir, "*.exe", SearchOption.AllDirectories).FirstOrDefault();

            if (setup == null)
                throw new InvalidOperationException("El paquete no contiene el instalador (.exe).");

            return setup;
        }

        return downloadPath;
    }

    public void LaunchInstaller(string setupExePath)
    {
        if (!File.Exists(setupExePath))
            throw new FileNotFoundException("No se encontró el instalador.", setupExePath);

        Process.Start(new ProcessStartInfo
        {
            FileName = setupExePath,
            UseShellExecute = true,
            WorkingDirectory = Path.GetDirectoryName(setupExePath) ?? Environment.CurrentDirectory,
        });
    }
}
