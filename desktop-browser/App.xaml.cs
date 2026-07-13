using System.Diagnostics;
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
        var startupTimer = Stopwatch.StartNew();
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

        SplashWindow? splash = null;
        try
        {
            splash = new SplashWindow();
            splash.Show();
            splash.SetStatus("Preparando navegador...");
            Dispatcher.Invoke(() => { }, System.Windows.Threading.DispatcherPriority.Render);

            var cefTimer = Stopwatch.StartNew();
            CefSharpInitializer.Initialize();
            StartupLog.Write($"CefSharp inicializado en {cefTimer.ElapsedMilliseconds}ms");

            splash.SetStatus("Verificando sesión...");
            var settings = new SettingsService();
            var api = new ApiService(settings);

            if (string.IsNullOrEmpty(settings.Settings.AccessToken))
            {
                StartupLog.Write("Mostrando login (sin token)");
                splash.Hide();
                if (!ShowLogin(settings, api))
                {
                    StartupLog.Write("Login cancelado");
                    Shutdown();
                    return;
                }
                splash.Show();
            }
            else if (!api.IsAuthenticated)
            {
                api.ClearAuth();
                StartupLog.Write("Mostrando login (token inválido)");
                splash.Hide();
                if (!ShowLogin(settings, api))
                {
                    StartupLog.Write("Login cancelado");
                    Shutdown();
                    return;
                }
                splash.Show();
            }

            splash.SetStatus("Abriendo ventana...");
            var startupUrl = StartupArgumentResolver.ResolveFirst(e.Args);
            var mainWindow = new MainWindow(settings, api, startupUrl);
            MainWindow = mainWindow;
            mainWindow.Show();
            splash.Close();
            splash = null;
            StartupLog.Write($"Ventana principal abierta en {startupTimer.ElapsedMilliseconds}ms");
        }
        catch (Exception ex)
        {
            splash?.Close();
            StartupLog.Write($"Fallo al iniciar: {ex}");
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
