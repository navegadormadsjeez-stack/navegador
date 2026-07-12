using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using MadsjeezSellerBrowser.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MadsjeezSellerBrowser.Services;

public class ApiService
{
    private readonly HttpClient _http;
    private readonly SettingsService _settings;

    public ApiService(SettingsService settings)
    {
        _settings = settings;
        _http = new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
    }

    private string BaseUrl => _settings.Settings.ApiBaseUrl;

    private void SetAuth()
    {
        _http.DefaultRequestHeaders.Authorization = null;
        if (!string.IsNullOrEmpty(_settings.Settings.AccessToken))
        {
            _http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _settings.Settings.AccessToken);
        }
    }

    public async Task<string?> GenerateAiResponseAsync(string type, string prompt, string? pageUrl, string? pageContent)
    {
        SetAuth();
        var payload = new
        {
            type,
            prompt,
            pageUrl,
            pageContent,
        };

        var content = new StringContent(
            JsonConvert.SerializeObject(payload),
            Encoding.UTF8,
            "application/json");

        try
        {
            var response = await _http.PostAsync($"{BaseUrl}/ai/generate", content);
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var obj = JObject.Parse(json);
            return obj["response"]?.ToString();
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> CheckForUpdatesAsync(string currentVersion)
    {
        try
        {
            var response = await _http.GetAsync($"{BaseUrl}/updates/check?version={currentVersion}");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task TrackTelemetryAsync(string eventType, object? payload = null)
    {
        SetAuth();
        var body = new
        {
            eventType,
            payload,
            appVersion = "0.1.0",
            osVersion = Environment.OSVersion.ToString(),
        };

        var content = new StringContent(
            JsonConvert.SerializeObject(body),
            Encoding.UTF8,
            "application/json");

        try
        {
            await _http.PostAsync($"{BaseUrl}/telemetry/track", content);
        }
        catch { /* optional telemetry */ }
    }
}
