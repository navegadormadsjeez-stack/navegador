using System.Windows;
using CefSharp;
using MadsjeezSellerBrowser.Services;

namespace MadsjeezSellerBrowser;

public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        CefSharpInitializer.Initialize();

        var mainWindow = new MainWindow();
        mainWindow.Show();
    }

    protected override void OnExit(ExitEventArgs e)
    {
        Cef.Shutdown();
        base.OnExit(e);
    }
}
