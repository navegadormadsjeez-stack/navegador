using System.IO;
using System.Security.Cryptography;
using System.Text;
using MadsjeezSellerBrowser.Models;
using Newtonsoft.Json;

namespace MadsjeezSellerBrowser.Services;

public class SettingsService
{
    private readonly string _settingsPath;
    private readonly string _profilesPath;
    private AppSettings _settings = new();

    public AppSettings Settings => _settings;

    public SettingsService()
    {
        var appData = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "MadsjeezSellerBrowser");
        Directory.CreateDirectory(appData);
        _settingsPath = Path.Combine(appData, "settings.enc");
        _profilesPath = Path.Combine(appData, "profiles.json");
        Load();
    }

    public void Save()
    {
        var json = JsonConvert.SerializeObject(_settings, Formatting.Indented);
        var encrypted = Encrypt(json);
        File.WriteAllBytes(_settingsPath, encrypted);
    }

    public void Load()
    {
        if (!File.Exists(_settingsPath)) return;
        try
        {
            var encrypted = File.ReadAllBytes(_settingsPath);
            var json = Decrypt(encrypted);
            _settings = JsonConvert.DeserializeObject<AppSettings>(json) ?? new AppSettings();
        }
        catch
        {
            _settings = new AppSettings();
        }
    }

    public List<BrowserProfile> LoadProfiles()
    {
        if (!File.Exists(_profilesPath))
            return GetDefaultProfiles();

        try
        {
            var json = File.ReadAllText(_profilesPath);
            return JsonConvert.DeserializeObject<List<BrowserProfile>>(json) ?? GetDefaultProfiles();
        }
        catch
        {
            return GetDefaultProfiles();
        }
    }

    public void SaveProfiles(List<BrowserProfile> profiles)
    {
        var json = JsonConvert.SerializeObject(profiles, Formatting.Indented);
        File.WriteAllText(_profilesPath, json);
    }

    public static List<BrowserProfile> GetDefaultProfiles()
    {
        var basePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "MadsjeezSellerBrowser", "Profiles");

        return new List<BrowserProfile>
        {
            new()
            {
                Name = "Maqjeez",
                Slug = "maqjeez",
                Color = "#FFE600",
                StartupUrls = new List<string>
                {
                    "https://www.mercadolibre.com.ar",
                    "https://web.whatsapp.com",
                    "https://mail.google.com",
                    "https://www.madsjeez.com",
                },
                CachePath = Path.Combine(basePath, "maqjeez"),
            },
            new()
            {
                Name = "Materia Natural",
                Slug = "materia-natural",
                Color = "#10B981",
                StartupUrls = new List<string>
                {
                    "https://www.instagram.com",
                    "https://www.facebook.com",
                    "https://web.whatsapp.com",
                },
                CachePath = Path.Combine(basePath, "materia-natural"),
            },
        };
    }

    private static byte[] Encrypt(string plainText)
    {
        var data = Encoding.UTF8.GetBytes(plainText);
        return ProtectedData.Protect(data, null, DataProtectionScope.CurrentUser);
    }

    private static string Decrypt(byte[] encrypted)
    {
        var data = ProtectedData.Unprotect(encrypted, null, DataProtectionScope.CurrentUser);
        return Encoding.UTF8.GetString(data);
    }
}
