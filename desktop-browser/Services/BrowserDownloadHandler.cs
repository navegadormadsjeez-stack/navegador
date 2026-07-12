using System.IO;
using CefSharp;
using MadsjeezSellerBrowser.Models;

namespace MadsjeezSellerBrowser;

public class BrowserDownloadHandler : IDownloadHandler
{
    private readonly List<DownloadEntry> _downloads;
    private readonly System.Windows.Threading.Dispatcher _dispatcher;

    public BrowserDownloadHandler(List<DownloadEntry> downloads, System.Windows.Threading.Dispatcher dispatcher)
    {
        _downloads = downloads;
        _dispatcher = dispatcher;
    }

    public bool CanDownload(IWebBrowser chromiumWebBrowser, IBrowser browser, string url, string requestMethod)
        => true;

    public bool OnBeforeDownload(IWebBrowser chromiumWebBrowser, IBrowser browser,
        DownloadItem downloadItem, IBeforeDownloadCallback callback)
    {
        if (!callback.IsDisposed)
        {
            var downloadPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                "Downloads", "Madsjeez");

            Directory.CreateDirectory(downloadPath);
            var filePath = Path.Combine(downloadPath, downloadItem.SuggestedFileName);

            _dispatcher.Invoke(() =>
            {
                _downloads.Add(new DownloadEntry
                {
                    FileName = downloadItem.SuggestedFileName,
                    Url = downloadItem.Url,
                    TotalBytes = downloadItem.TotalBytes,
                });
            });

            callback.Continue(filePath, showDialog: false);
            return true;
        }
        return false;
    }

    public void OnDownloadUpdated(IWebBrowser chromiumWebBrowser, IBrowser browser,
        DownloadItem downloadItem, IDownloadItemCallback callback)
    {
        _dispatcher.Invoke(() =>
        {
            var entry = _downloads.LastOrDefault(d => d.Url == downloadItem.Url);
            if (entry != null)
            {
                entry.ReceivedBytes = downloadItem.ReceivedBytes;
                entry.TotalBytes = downloadItem.TotalBytes;
                entry.IsComplete = downloadItem.IsComplete;
            }
        });
    }
}
