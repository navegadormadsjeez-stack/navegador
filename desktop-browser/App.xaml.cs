using System.Windows;
using CefSharp;
using MadsjeezSellerBrowser.Services;
using MadsjeezSellerBrowser.Views;

namespace MadsjeezSellerBrowser;

public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        CefSharpInitializer.Initialize();

        var settings = new SettingsService();
        var api = new ApiService(settings);

        if (string.IsNullOrEmpty(settings.Settings.AccessToken))
        {
            var login = new LoginWindow(settings, api);
            if (login.ShowDialog() != true)
            {
                Shutdown();
                return;
            }
        }
        else if (!api.IsAuthenticated)
        {
            api.ClearAuth();
            var login = new LoginWindow(settings, api);
            if (login.ShowDialog() != true)
            {
                Shutdown();
                return;
            }
        }

        var mainWindow = new MainWindow(settings, api);
        mainWindow.Show();
    }

    protected override void OnExit(ExitEventArgs e)
    {
        Cef.Shutdown();
        base.OnExit(e);
    }
}
