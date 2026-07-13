using System.Net;
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
        _http = new HttpClient { Timeout = TimeSpan.FromSeconds(12) };
    }

    private string BaseUrl => _settings.Settings.ApiBaseUrl.TrimEnd('/');

    public bool IsAuthenticated => !string.IsNullOrEmpty(_settings.Settings.AccessToken);

    private void SetAuth()
    {
        _http.DefaultRequestHeaders.Authorization = null;
        if (!string.IsNullOrEmpty(_settings.Settings.AccessToken))
        {
            _http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _settings.Settings.AccessToken);
        }
    }

    private async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        bool retryOnUnauthorized = true,
        CancellationToken cancellationToken = default)
    {
        SetAuth();
        var response = await _http.SendAsync(request, cancellationToken);

        if (response.StatusCode == HttpStatusCode.Unauthorized && retryOnUnauthorized)
        {
            if (await TryRefreshTokenAsync())
            {
                SetAuth();
                var retry = CloneRequest(request);
                response = await _http.SendAsync(retry, cancellationToken);
            }
        }

        return response;
    }

    private static HttpRequestMessage CloneRequest(HttpRequestMessage original)
    {
        var clone = new HttpRequestMessage(original.Method, original.RequestUri);
        if (original.Content != null)
        {
            var content = original.Content.ReadAsStringAsync().Result;
            clone.Content = new StringContent(content, Encoding.UTF8, "application/json");
        }
        return clone;
    }

    public async Task<AuthResult?> LoginAsync(string email, string password)
    {
        var payload = new { email, password };
        var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
        try
        {
            var response = await _http.PostAsync($"{BaseUrl}/auth/login", content);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<AuthResult>(json);
        }
        catch
        {
            return null;
        }
    }

    public async Task<AuthResult?> RegisterAsync(string name, string email, string password)
    {
        var payload = new { name, email, password };
        var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
        try
        {
            var response = await _http.PostAsync($"{BaseUrl}/auth/register", content);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<AuthResult>(json);
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> TryRefreshTokenAsync()
    {
        var refreshToken = _settings.Settings.RefreshToken;
        if (string.IsNullOrEmpty(refreshToken)) return false;

        var payload = new { refreshToken };
        var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
        try
        {
            var response = await _http.PostAsync($"{BaseUrl}/auth/refresh", content);
            if (!response.IsSuccessStatusCode) return false;
            var json = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<AuthResult>(json);
            if (result == null) return false;
            PersistAuth(result);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public void PersistAuth(AuthResult auth)
    {
        _settings.Settings.AccessToken = auth.AccessToken;
        _settings.Settings.RefreshToken = auth.RefreshToken;
        _settings.Settings.UserId = auth.User?.Id;
        _settings.Settings.UserEmail = auth.User?.Email;
        _settings.Save();
    }

    public void ClearAuth()
    {
        _settings.Settings.AccessToken = null;
        _settings.Settings.RefreshToken = null;
        _settings.Settings.UserId = null;
        _settings.Settings.UserEmail = null;
        _settings.Settings.UserName = null;
        _settings.Settings.ActiveWorkspaceId = null;
        _settings.Save();
    }

    public async Task<List<ApiWorkspace>> GetWorkspacesAsync(CancellationToken cancellationToken = default)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"{BaseUrl}/workspaces");
        try
        {
            var response = await SendAsync(request, cancellationToken: cancellationToken);
            if (!response.IsSuccessStatusCode) return new List<ApiWorkspace>();
            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonConvert.DeserializeObject<List<ApiWorkspace>>(json) ?? new List<ApiWorkspace>();
        }
        catch
        {
            return new List<ApiWorkspace>();
        }
    }

    public async Task<List<ApiProduct>> GetProductsAsync(string? workspaceId = null)
    {
        var url = string.IsNullOrEmpty(workspaceId)
            ? $"{BaseUrl}/products"
            : $"{BaseUrl}/products?workspaceId={Uri.EscapeDataString(workspaceId)}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        try
        {
            var response = await SendAsync(request);
            if (!response.IsSuccessStatusCode) return new List<ApiProduct>();
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<ApiProduct>>(json) ?? new List<ApiProduct>();
        }
        catch
        {
            return new List<ApiProduct>();
        }
    }

    public async Task<ApiProduct?> CreateProductAsync(string name, decimal price, int stock, string? description, string? workspaceId)
    {
        var payload = new
        {
            name,
            price,
            stock,
            description,
            workspaceId,
        };
        var request = new HttpRequestMessage(HttpMethod.Post, $"{BaseUrl}/products")
        {
            Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json"),
        };
        try
        {
            var response = await SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<ApiProduct>(json);
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> DeleteProductAsync(string id)
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, $"{BaseUrl}/products/{id}");
        try
        {
            var response = await SendAsync(request);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<List<ApiFavorite>> GetFavoritesAsync(string? workspaceId = null, CancellationToken cancellationToken = default)
    {
        var url = string.IsNullOrEmpty(workspaceId)
            ? $"{BaseUrl}/favorites"
            : $"{BaseUrl}/favorites?workspaceId={Uri.EscapeDataString(workspaceId)}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        try
        {
            var response = await SendAsync(request, cancellationToken: cancellationToken);
            if (!response.IsSuccessStatusCode) return new List<ApiFavorite>();
            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonConvert.DeserializeObject<List<ApiFavorite>>(json) ?? new List<ApiFavorite>();
        }
        catch
        {
            return new List<ApiFavorite>();
        }
    }

    public async Task<ApiFavorite?> CreateFavoriteAsync(string title, string url, string? workspaceId)
    {
        var payload = new { title, url, workspaceId };
        var request = new HttpRequestMessage(HttpMethod.Post, $"{BaseUrl}/favorites")
        {
            Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json"),
        };
        try
        {
            var response = await SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<ApiFavorite>(json);
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> DeleteFavoriteAsync(string id)
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, $"{BaseUrl}/favorites/{id}");
        try
        {
            var response = await SendAsync(request);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<string?> GenerateAiResponseAsync(string type, string prompt, string? pageUrl, string? pageContent)
    {
        var payload = new { type, prompt, pageUrl, pageContent };
        var request = new HttpRequestMessage(HttpMethod.Post, $"{BaseUrl}/ai/generate")
        {
            Content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json"),
        };
        try
        {
            var response = await SendAsync(request);
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

    public async Task<UpdateCheckResult?> CheckForUpdatesAsync(string currentVersion)
    {
        try
        {
            var response = await _http.GetAsync($"{BaseUrl}/updates/check?version={Uri.EscapeDataString(currentVersion)}");
            if (!response.IsSuccessStatusCode) return null;
            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<UpdateCheckResult>(json);
        }
        catch
        {
            return null;
        }
    }

    public async Task TrackTelemetryAsync(string eventType, object? payload = null)
    {
        var body = new
        {
            eventType,
            payload,
            appVersion = UpdateInstallerService.GetAppVersion(),
            osVersion = Environment.OSVersion.ToString(),
        };
        var request = new HttpRequestMessage(HttpMethod.Post, $"{BaseUrl}/telemetry/track")
        {
            Content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json"),
        };
        try
        {
            await SendAsync(request, retryOnUnauthorized: false);
        }
        catch { /* optional telemetry */ }
    }
}
