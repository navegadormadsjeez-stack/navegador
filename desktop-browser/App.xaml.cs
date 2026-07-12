using System.Windows;
using CefSharp;
using MadsjeezSellerBrowser.Services;
using MadsjeezSellerBrowser.Views;

namespace MadsjeezSellerBrowser;

public partial class App : Application
{
    private static Mutex? _instanceMutex;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        _instanceMutex = new Mutex(true, "MadsjeezSellerBrowser", out var isFirstInstance);
        if (!isFirstInstance)
        {
            MessageBox.Show(
                "Madsjeez Seller Browser ya está abierto.",
                "Madsjeez Seller Browser",
                MessageBoxButton.OK,
                MessageBoxImage.Information);
            Shutdown();
            return;
        }

        DispatcherUnhandledException += (_, args) =>
        {
            MessageBox.Show(
                $"Error inesperado:\n\n{args.Exception.Message}",
                "Madsjeez Seller Browser",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
            args.Handled = true;
        };

        AppDomain.CurrentDomain.UnhandledException += (_, args) =>
        {
            if (args.ExceptionObject is Exception ex)
            {
                MessageBox.Show(
                    $"Error crítico:\n\n{ex.Message}",
                    "Madsjeez Seller Browser",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        };

        try
        {
            CefSharpInitializer.Initialize();
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                $"No se pudo iniciar el motor del navegador (Chromium).\n\n{ex.Message}\n\nReinstala la aplicación o ejecuta como administrador.",
                "Madsjeez Seller Browser",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
            Shutdown(1);
            return;
        }

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
        _instanceMutex?.ReleaseMutex();
        _instanceMutex?.Dispose();
        Cef.Shutdown();
        base.OnExit(e);
    }
}
