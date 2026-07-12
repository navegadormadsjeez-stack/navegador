namespace MadsjeezSellerBrowser.Models;

public class BrowserProfile
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "Default";
    public string Slug { get; set; } = "default";
    public string Color { get; set; } = "#6366f1";
    public List<string> StartupUrls { get; set; } = new();
    public string CachePath { get; set; } = string.Empty;
}

public class BrowserTab
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = "Nueva pestaña";
    public string Url { get; set; } = "about:blank";
    public bool IsLoading { get; set; }
}

public class HistoryEntry
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public DateTime VisitedAt { get; set; } = DateTime.Now;
}

public class FavoriteEntry
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class DownloadEntry
{
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public long TotalBytes { get; set; }
    public long ReceivedBytes { get; set; }
    public bool IsComplete { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.Now;
}

public class AiMessage
{
    public bool IsUser { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.Now;
}

public class AppSettings
{
    public bool DarkMode { get; set; } = true;
    public bool SidebarOpen { get; set; } = true;
    public string HomePage { get; set; } = "https://www.madsjeez.com";
    public string SearchEngine { get; set; } = "google";
    public string? ActiveProfileId { get; set; }
    public string ApiBaseUrl { get; set; } = "http://localhost:3001/api/v1";
    public string? AccessToken { get; set; }
}
