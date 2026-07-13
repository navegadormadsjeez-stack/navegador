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
        StartupLog.Write("Inicio de aplicación");

        _instanceMutex = new Mutex(true, SingleInstanceHelper.MutexName, out var isFirstInstance);
        if (!isFirstInstance)
        {
            StartupLog.Write("Segunda instancia detectada");
            if (SingleInstanceHelper.TryActivateExistingInstance())
            {
                StartupLog.Write("Ventana existente activada");
                Shutdown();
                return;
            }

            MessageBox.Show(
                "Madsjeez Seller Browser ya está abierto.\n\nSi no lo ves, revisá la barra de tareas o cerrá el proceso en el Administrador de tareas.",
                "Madsjeez Seller Browser",
                MessageBoxButton.OK,
                MessageBoxImage.Information);
            Shutdown();
            return;
        }

        DispatcherUnhandledException += (_, args) =>
        {
            StartupLog.Write($"Error UI: {args.Exception}");
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
                StartupLog.Write($"Error crítico: {ex}");
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
            StartupLog.Write("CefSharp inicializado");
        }
        catch (Exception ex)
        {
            StartupLog.Write($"CefSharp falló: {ex}");
            MessageBox.Show(
                $"No se pudo iniciar el motor del navegador (Chromium).\n\n{ex.Message}\n\nReinstala la aplicación o ejecuta como administrador.",
                "Madsjeez Seller Browser",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
            Shutdown(1);
            return;
        }

        try
        {
            var settings = new SettingsService();
            var api = new ApiService(settings);

            if (string.IsNullOrEmpty(settings.Settings.AccessToken))
            {
                StartupLog.Write("Mostrando login (sin token)");
                if (!ShowLogin(settings, api))
                {
                    StartupLog.Write("Login cancelado");
                    Shutdown();
                    return;
                }
            }
            else if (!api.IsAuthenticated)
            {
                api.ClearAuth();
                StartupLog.Write("Mostrando login (token inválido)");
                if (!ShowLogin(settings, api))
                {
                    StartupLog.Write("Login cancelado");
                    Shutdown();
                    return;
                }
            }

            var mainWindow = new MainWindow(settings, api);
            MainWindow = mainWindow;
            mainWindow.Show();
            StartupLog.Write("Ventana principal abierta");
        }
        catch (Exception ex)
        {
            StartupLog.Write($"Fallo al abrir ventana principal: {ex}");
            MessageBox.Show(
                $"No se pudo abrir el navegador:\n\n{ex.Message}\n\nLog: %LOCALAPPDATA%\\MadsjeezSellerBrowser\\logs\\startup.log",
                "Madsjeez Seller Browser",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
            Shutdown(1);
        }
    }

    private static bool ShowLogin(SettingsService settings, ApiService api)
    {
        var login = new LoginWindow(settings, api)
        {
            Topmost = true,
        };
        login.Activate();
        return login.ShowDialog() == true;
    }

    protected override void OnExit(ExitEventArgs e)
    {
        StartupLog.Write("Cierre de aplicación");
        try
        {
            _instanceMutex?.ReleaseMutex();
        }
        catch
        {
            /* mutex may already be released */
        }

        _instanceMutex?.Dispose();

        if (CefSharpInitializer.IsInitialized)
            Cef.Shutdown();

        base.OnExit(e);
    }
}
