using System.Diagnostics;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Threading;
using CefSharp;
using MadsjeezSellerBrowser.Models;
using MadsjeezSellerBrowser.Services;

namespace MadsjeezSellerBrowser;

public partial class MainWindow : Window
{
    private readonly SettingsService _settingsService;
    private readonly ApiService _apiService;
    private List<BrowserProfile> _profiles = new();
    private BrowserProfile? _activeProfile;
    private readonly List<BrowserTab> _tabs = new();
    private BrowserTab? _activeTab;
    private readonly List<HistoryEntry> _history = new();
    private readonly List<FavoriteEntry> _favorites = new();
    private readonly List<DownloadEntry> _downloads = new();
    private readonly List<AiMessage> _aiMessages = new();
    private readonly DispatcherTimer _statusTimer = new();
    private readonly UpdateInstallerService _updateService = new();
    private bool _initializing;

    public MainWindow(SettingsService settings, ApiService api)
    {
        _settingsService = settings;
        _apiService = api;
        InitializeComponent();
        NewTabView.NavigateRequested += (_, url) => NavigateTo(url);
        NewTabView.AiAssistRequested += (_, _) => ToggleSidebar(true);
        SettingsView.LogoutRequested += (_, _) => HandleLogout();
        SettingsView.SaveRequested += (_, _) => HandleSaveSettings();
        SettingsView.ClearHistoryRequested += (_, _) => HandleClearHistory();
        SettingsView.ClearCacheRequested += (_, _) => HandleClearCache();
        SettingsView.NavigateRequested += (_, url) => NavigateTo(url);
        SettingsView.CheckUpdatesRequested += (_, _) => _ = HandleCheckUpdatesAsync();
        SettingsView.InstallUpdateRequested += (_, _) => _ = HandleInstallUpdateAsync();
        Loaded += MainWindow_Loaded;
        _statusTimer.Interval = TimeSpan.FromSeconds(2);
        _statusTimer.Tick += (_, _) => UpdateSystemStats();
    }

    private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
    {
        _initializing = true;

        await SyncFromApiAsync();

        _profiles = _settingsService.LoadProfiles();
        if (_profiles.Count == 0)
            _profiles = SettingsService.GetDefaultProfiles();

        ProfileComboBox.ItemsSource = _profiles;
        ProfileComboBox.DisplayMemberPath = "Name";

        var activeId = _settingsService.Settings.ActiveProfileId;
        _activeProfile = _profiles.FirstOrDefault(p => p.Id == activeId) ?? _profiles.First();
        ProfileComboBox.SelectedItem = _activeProfile;

        SetupBrowserEvents();
        ApplyProfile(_activeProfile);
        await LoadFavoritesAsync();

        _initializing = false;

        if (!_settingsService.Settings.SidebarOpen)
            ToggleSidebar(false);
        else
            ToggleSidebar(true);

        _statusTimer.Start();
        UpdateSystemStats();
        SyncStatusText.Text = string.IsNullOrEmpty(_settingsService.Settings.UserEmail)
            ? "Sin sesión"
            : "Sincronizado";

        Title = $"Madsjeez Seller Browser — {_settingsService.Settings.UserEmail}";
        VersionText.Text = $"v{UpdateInstallerService.GetAppVersion()}";
        _ = _apiService.TrackTelemetryAsync("app_started");
        _ = CheckUpdatesAsync();

        AddAiMessage(false, "Hola. Soy tu asistente para vender online. Elegí una acción rápida o escribí tu consulta.");
    }

    private void UpdateSystemStats()
    {
        try
        {
            using var proc = Process.GetCurrentProcess();
            var ramMb = proc.WorkingSet64 / (1024 * 1024);
            RamStatusText.Text = $"RAM {ramMb} MB";
        }
        catch
        {
            RamStatusText.Text = "RAM —";
        }

        CpuStatusText.Text = "CPU —";
    }

    private void ShowNewTabPage()
    {
        NewTabView.Visibility = Visibility.Visible;
        SettingsView.Visibility = Visibility.Collapsed;
        WebBrowser.Visibility = Visibility.Collapsed;
    }

    private void ShowSettingsPage()
    {
        RefreshSettingsPage();
        NewTabView.Visibility = Visibility.Collapsed;
        SettingsView.Visibility = Visibility.Visible;
        WebBrowser.Visibility = Visibility.Collapsed;
    }

    private void HideInternalPages()
    {
        NewTabView.Visibility = Visibility.Collapsed;
        SettingsView.Visibility = Visibility.Collapsed;
        WebBrowser.Visibility = Visibility.Visible;
    }

    private void RefreshSettingsPage()
    {
        SettingsView.LoadData(
            _settingsService.Settings.UserEmail ?? "",
            _settingsService.Settings.UserName,
            _activeProfile?.Name ?? "—",
            _profiles.Select(p => p.Name),
            _settingsService.Settings.HomePage,
            _settingsService.Settings.SidebarOpen,
            _settingsService.Settings.SearchEngine,
            UpdateInstallerService.GetAppVersion());
    }

    private async Task SyncFromApiAsync()
    {
        var workspaces = await _apiService.GetWorkspacesAsync();
        if (workspaces.Count == 0) return;

        var basePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "MadsjeezSellerBrowser", "Profiles");

        _profiles = workspaces.Select(w => new BrowserProfile
        {
            Id = w.Id,
            WorkspaceId = w.Id,
            Name = w.Name,
            Slug = w.Slug,
            Color = w.Color,
            StartupUrls = w.StartupUrls?.Count > 0 ? w.StartupUrls : new List<string> { _settingsService.Settings.HomePage },
            CachePath = Path.Combine(basePath, w.Slug),
        }).ToList();

        _settingsService.SaveProfiles(_profiles);

        var defaultWs = workspaces.FirstOrDefault(w => w.IsDefault) ?? workspaces.First();
        _settingsService.Settings.ActiveWorkspaceId = defaultWs.Id;
        _settingsService.Settings.ActiveProfileId = defaultWs.Id;
        _settingsService.Save();
    }

    private async Task LoadFavoritesAsync()
    {
        _favorites.Clear();
        var workspaceId = _activeProfile?.WorkspaceId ?? _settingsService.Settings.ActiveWorkspaceId;
        var items = await _apiService.GetFavoritesAsync(workspaceId);
        foreach (var f in items)
        {
            _favorites.Add(new FavoriteEntry { Id = f.Id, Title = f.Title, Url = f.Url });
        }
    }

    private void SetupBrowserEvents()
    {
        WebBrowser.LoadingStateChanged += (_, args) =>
        {
            Dispatcher.Invoke(() =>
            {
                LoadingOverlay.Visibility = args.IsLoading ? Visibility.Visible : Visibility.Collapsed;
                if (_activeTab != null)
                {
                    _activeTab.IsLoading = args.IsLoading;
                    if (!args.IsLoading && WebBrowser.Address != "about:blank")
                    {
                        HideInternalPages();
                        _activeTab.Url = WebBrowser.Address;
                        _activeTab.Title = WebBrowser.Title ?? WebBrowser.Address;
                        UrlTextBox.Text = WebBrowser.Address;
                        UpdateTabTitle(_activeTab);
                        AddHistory(_activeTab.Title, _activeTab.Url);
                    }
                }
                StatusText.Text = args.IsLoading ? "Cargando..." : "Listo";
            });
        };

        WebBrowser.TitleChanged += (_, args) =>
        {
            Dispatcher.Invoke(() =>
            {
                if (_activeTab != null)
                {
                    _activeTab.Title = args.NewValue?.ToString() ?? _activeTab.Title;
                    UpdateTabTitle(_activeTab);
                }
            });
        };

        WebBrowser.DownloadHandler = new BrowserDownloadHandler(_downloads, Dispatcher);
    }

    private void ApplyProfile(BrowserProfile profile)
    {
        var previousProfileId = _activeProfile?.Id;
        _activeProfile = profile;
        _settingsService.Settings.ActiveProfileId = profile.Id;
        _settingsService.Settings.ActiveWorkspaceId = profile.WorkspaceId ?? profile.Id;
        _settingsService.SaveProfiles(_profiles);
        _settingsService.Save();

        Directory.CreateDirectory(profile.CachePath);

        if (!WebBrowser.IsBrowserInitialized)
        {
            var rcSettings = new RequestContextSettings
            {
                CachePath = profile.CachePath,
                PersistSessionCookies = true,
            };
            WebBrowser.RequestContext = new RequestContext(rcSettings);
        }
        else if (previousProfileId != profile.Id)
        {
            StatusText.Text = "Perfil cambiado. Reiniciá el navegador para aislar cookies por completo.";
        }

        _tabs.Clear();
        TabBar.Children.Clear();

        foreach (var url in profile.StartupUrls)
            CreateTab(url, showNewTab: false);

        if (_tabs.Count == 0)
            CreateTab("about:blank", showNewTab: true);

        _ = LoadFavoritesAsync();
    }

    private void CreateTab(string url, bool? showNewTab = null)
    {
        var isBlank = url == "about:blank" || string.IsNullOrWhiteSpace(url);
        var tab = new BrowserTab { Url = isBlank ? "about:blank" : url, Title = "Nueva pestaña" };
        _tabs.Add(tab);

        var tabBtn = new Button
        {
            Tag = tab,
            Style = (Style)FindResource("TabButton"),
            Content = new TextBlock { Text = tab.Title, TextTrimming = TextTrimming.CharacterEllipsis, MaxWidth = 160 },
            Margin = new Thickness(2, 0, 0, 0),
        };
        tabBtn.Click += TabBtn_Click;

        var closeBtn = new Button
        {
            Content = "×",
            Width = 20,
            Height = 20,
            Background = Brushes.Transparent,
            Foreground = new SolidColorBrush(Color.FromRgb(148, 163, 184)),
            BorderThickness = new Thickness(0),
            Cursor = Cursors.Hand,
            Margin = new Thickness(4, 0, 4, 0),
            VerticalAlignment = VerticalAlignment.Center,
        };
        closeBtn.Click += (_, _) => CloseTab(tab);

        var panel = new StackPanel { Orientation = Orientation.Horizontal };
        panel.Children.Add(tabBtn);
        panel.Children.Add(closeBtn);

        var container = new Border { Child = panel, Tag = tab, Background = Brushes.Transparent };
        TabBar.Children.Add(container);

        SelectTab(tab, showNewTab ?? isBlank);
    }

    private void NewTabBtn_Click(object sender, RoutedEventArgs e) => CreateTab("about:blank", showNewTab: true);

    private void SelectTab(BrowserTab tab, bool showNewTab = false)
    {
        _activeTab = tab;
        foreach (var child in TabBar.Children)
        {
            if (child is Border border && border.Tag is BrowserTab t)
            {
                border.Background = t.Id == tab.Id
                    ? new SolidColorBrush(Color.FromRgb(24, 26, 46))
                    : Brushes.Transparent;
            }
        }

        var isBlank = tab.Url == "about:blank" || showNewTab;
        if (isBlank)
        {
            ShowNewTabPage();
            UrlTextBox.Text = string.Empty;
        }
        else
        {
            HideInternalPages();
            if (WebBrowser.Address != tab.Url)
                WebBrowser.Load(tab.Url);
            UrlTextBox.Text = tab.Url;
        }
    }

    private void UpdateTabTitle(BrowserTab tab)
    {
        foreach (var child in TabBar.Children)
        {
            if (child is Border { Tag: BrowserTab t } border && t.Id == tab.Id)
            {
                if (border.Child is StackPanel sp && sp.Children[0] is Button btn)
                {
                    btn.Content = new TextBlock
                    {
                        Text = string.IsNullOrWhiteSpace(tab.Title) ? tab.Url : tab.Title,
                        TextTrimming = TextTrimming.CharacterEllipsis,
                        MaxWidth = 160,
                    };
                }
            }
        }
    }

    private void CloseTab(BrowserTab tab)
    {
        if (_tabs.Count <= 1) return;

        var idx = _tabs.IndexOf(tab);
        _tabs.Remove(tab);

        Border? toRemove = null;
        foreach (var child in TabBar.Children)
        {
            if (child is Border b && b.Tag is BrowserTab t && t.Id == tab.Id)
            {
                toRemove = b;
                break;
            }
        }
        if (toRemove != null) TabBar.Children.Remove(toRemove);

        if (_activeTab?.Id == tab.Id)
            SelectTab(_tabs[Math.Max(0, idx - 1)]);
    }

    private void TabBtn_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button { Tag: BrowserTab tab })
            SelectTab(tab, tab.Url == "about:blank");
    }

    private void ProfileComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (_initializing) return;
        if (ProfileComboBox.SelectedItem is BrowserProfile profile && profile.Id != _activeProfile?.Id)
            ApplyProfile(profile);
    }

    private void BackBtn_Click(object sender, RoutedEventArgs e) => WebBrowser.Back();
    private void ForwardBtn_Click(object sender, RoutedEventArgs e) => WebBrowser.Forward();
    private void ReloadBtn_Click(object sender, RoutedEventArgs e) => WebBrowser.Reload();

    private void HomeBtn_Click(object sender, RoutedEventArgs e) => NavHomeBtn_Click(sender, e);

    private void UrlTextBox_KeyDown(object sender, KeyEventArgs e)
    {
        if (e.Key == Key.Enter)
            NavigateTo(UrlTextBox.Text);
    }

    private void NavigateTo(string input)
    {
        var url = NormalizeUrl(input);
        HideInternalPages();
        if (_activeTab != null)
        {
            _activeTab.Url = url;
            UpdateTabTitle(_activeTab);
        }
        WebBrowser.Load(url);
        UrlTextBox.Text = url == "about:blank" ? string.Empty : url;
    }

    private void NavHomeBtn_Click(object sender, RoutedEventArgs e)
    {
        if (_activeTab != null)
        {
            _activeTab.Url = "about:blank";
            SelectTab(_activeTab, showNewTab: true);
        }
        else
            ShowNewTabPage();
    }

    private void NavAiBtn_Click(object sender, RoutedEventArgs e) => ToggleSidebar(true);

    private void NavToolsBtn_Click(object sender, RoutedEventArgs e) => ProductsBtn_Click(sender, e);

    private void NavSocialBtn_Click(object sender, RoutedEventArgs e) =>
        NavigateTo("https://web.whatsapp.com");

    private void NavExtensionsBtn_Click(object sender, RoutedEventArgs e) =>
        MessageBox.Show(
            "Las extensiones de Chrome no están disponibles en esta versión.\n\nMadsjeez usa Chromium embebido (CefSharp) sin tienda de extensiones.",
            "Extensiones",
            MessageBoxButton.OK,
            MessageBoxImage.Information);

    private void NavSettingsBtn_Click(object sender, RoutedEventArgs e) => ShowSettingsPage();

    private void HandleSaveSettings()
    {
        _settingsService.Settings.HomePage = SettingsView.GetHomePage();
        _settingsService.Settings.SidebarOpen = SettingsView.GetSidebarOpen();
        _settingsService.Settings.SearchEngine = SettingsView.GetSearchEngine();
        _settingsService.Save();
        ToggleSidebar(_settingsService.Settings.SidebarOpen);
        StatusText.Text = "Preferencias guardadas";
    }

    private void HandleClearHistory()
    {
        var result = MessageBox.Show(
            "¿Borrar todo el historial local de esta sesión?",
            "Limpiar historial",
            MessageBoxButton.YesNo,
            MessageBoxImage.Question);
        if (result != MessageBoxResult.Yes) return;

        _history.Clear();
        StatusText.Text = "Historial local borrado";
    }

    private void HandleClearCache()
    {
        if (_activeProfile == null) return;

        var result = MessageBox.Show(
            $"¿Borrar caché y cookies del perfil \"{_activeProfile.Name}\"?\n\nReiniciá el navegador después para aplicar los cambios.",
            "Limpiar caché",
            MessageBoxButton.YesNo,
            MessageBoxImage.Warning);
        if (result != MessageBoxResult.Yes) return;

        try
        {
            if (Directory.Exists(_activeProfile.CachePath))
                Directory.Delete(_activeProfile.CachePath, recursive: true);
            Directory.CreateDirectory(_activeProfile.CachePath);
            StatusText.Text = "Caché borrada. Reiniciá el navegador.";
        }
        catch (Exception ex)
        {
            MessageBox.Show($"No se pudo borrar la caché:\n\n{ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private async void HandleLogout()
    {
        var result = MessageBox.Show(
            "¿Cerrar sesión?",
            "Cerrar sesión",
            MessageBoxButton.YesNo,
            MessageBoxImage.Question);
        if (result != MessageBoxResult.Yes) return;

        _apiService.ClearAuth();
        var login = new Views.LoginWindow(_settingsService, _apiService);
        if (login.ShowDialog() != true)
        {
            Application.Current.Shutdown();
            return;
        }

        Title = $"Madsjeez Seller Browser — {_settingsService.Settings.UserEmail}";
        SyncStatusText.Text = "Sincronizado";
        await RefreshProfilesAsync();
        StatusText.Text = "Sesión iniciada";
    }

    private async Task RefreshProfilesAsync()
    {
        await SyncFromApiAsync();
        _profiles = _settingsService.LoadProfiles();
        ProfileComboBox.ItemsSource = _profiles;
        var activeId = _settingsService.Settings.ActiveProfileId;
        _activeProfile = _profiles.FirstOrDefault(p => p.Id == activeId) ?? _profiles.FirstOrDefault();
        if (_activeProfile != null)
            ProfileComboBox.SelectedItem = _activeProfile;
        RefreshSettingsPage();
    }

    private void NavProBtn_Click(object sender, RoutedEventArgs e) =>
        MessageBox.Show(
            "Madsjeez Pro estará disponible próximamente con más límites de IA y perfiles avanzados.",
            "Madsjeez Pro",
            MessageBoxButton.OK,
            MessageBoxImage.Information);

    private static readonly Dictionary<string, string> QuickSites = new(StringComparer.OrdinalIgnoreCase)
    {
        ["mercadolibre"] = "https://www.mercadolibre.com.ar",
        ["mercado libre"] = "https://www.mercadolibre.com.ar",
        ["ml"] = "https://www.mercadolibre.com.ar",
        ["google"] = "https://www.google.com",
        ["youtube"] = "https://www.youtube.com",
        ["whatsapp"] = "https://web.whatsapp.com",
        ["gmail"] = "https://mail.google.com",
        ["facebook"] = "https://www.facebook.com",
        ["instagram"] = "https://www.instagram.com",
    };

    private string NormalizeUrl(string input)
    {
        input = input.Trim();
        if (string.IsNullOrEmpty(input)) return "about:blank";

        if (QuickSites.TryGetValue(input, out var direct))
            return direct;

        if (!input.Contains('.') && !input.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            var engine = _settingsService.Settings.SearchEngine;
            return engine.Equals("google", StringComparison.OrdinalIgnoreCase)
                ? $"https://www.google.com/search?q={Uri.EscapeDataString(input)}"
                : $"https://duckduckgo.com/?q={Uri.EscapeDataString(input)}";
        }

        if (!input.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
            && !input.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            return "https://" + input;

        return input;
    }

    private async void BookmarkBtn_Click(object sender, RoutedEventArgs e)
    {
        if (_activeTab == null) return;
        var workspaceId = _activeProfile?.WorkspaceId ?? _settingsService.Settings.ActiveWorkspaceId;
        var created = await _apiService.CreateFavoriteAsync(_activeTab.Title, _activeTab.Url, workspaceId);
        if (created != null)
        {
            _favorites.Add(new FavoriteEntry { Id = created.Id, Title = created.Title, Url = created.Url });
            StatusText.Text = "Favorito guardado en la nube";
        }
        else
        {
            _favorites.Add(new FavoriteEntry { Title = _activeTab.Title, Url = _activeTab.Url });
            StatusText.Text = "Favorito guardado localmente";
        }
    }

    private void FavoritesBtn_Click(object sender, RoutedEventArgs e)
    {
        if (_favorites.Count == 0)
        {
            MessageBox.Show("No hay favoritos guardados.", "Favoritos", MessageBoxButton.OK, MessageBoxImage.Information);
            return;
        }
        var list = string.Join("\n", _favorites.Select(f => $"• {f.Title}\n  {f.Url}"));
        var result = MessageBox.Show(list + "\n\n¿Abrir el primero?", "Favoritos", MessageBoxButton.YesNo, MessageBoxImage.Information);
        if (result == MessageBoxResult.Yes && _favorites.Count > 0)
            NavigateTo(_favorites[0].Url);
    }

    private void HistoryBtn_Click(object sender, RoutedEventArgs e)
    {
        if (_history.Count == 0)
        {
            MessageBox.Show("No hay historial.", "Historial", MessageBoxButton.OK, MessageBoxImage.Information);
            return;
        }
        var list = string.Join("\n", _history.TakeLast(20).Select(h => $"• {h.Title}\n  {h.Url}"));
        MessageBox.Show(list, "Historial reciente", MessageBoxButton.OK, MessageBoxImage.Information);
    }

    private void DownloadsBtn_Click(object sender, RoutedEventArgs e)
    {
        if (_downloads.Count == 0)
        {
            MessageBox.Show("No hay descargas.", "Descargas", MessageBoxButton.OK, MessageBoxImage.Information);
            return;
        }
        var list = string.Join("\n", _downloads.Select(d => $"• {d.FileName} ({d.ReceivedBytes}/{d.TotalBytes} bytes)"));
        MessageBox.Show(list, "Descargas", MessageBoxButton.OK, MessageBoxImage.Information);
    }

    private void ProductsBtn_Click(object sender, RoutedEventArgs e)
    {
        var panel = new Views.ProductsPanel(_apiService, _settingsService);
        panel.ShowDialog();
    }

    private void ToggleSidebar(bool open)
    {
        RightPanelColumn.Width = new GridLength(open ? 340 : 0);
        AiSidebar.Visibility = open ? Visibility.Visible : Visibility.Collapsed;
        _settingsService.Settings.SidebarOpen = open;
        _settingsService.Save();
    }

    private void AddHistory(string title, string url)
    {
        _history.Add(new HistoryEntry { Title = title, Url = url });
        if (_history.Count > 500) _history.RemoveAt(0);
    }

    private async Task CheckUpdatesAsync()
    {
        var update = await _apiService.CheckForUpdatesAsync(UpdateInstallerService.GetAppVersion());
        if (update == null)
        {
            StatusText.Text = "Modo offline - API no disponible";
            return;
        }
        if (update.UpdateAvailable)
        {
            var latest = update.Latest?.Version ?? update.Version ?? "?";
            StatusText.Text = $"Actualización disponible: v{latest}";
        }
    }

    private async Task HandleCheckUpdatesAsync()
    {
        var current = UpdateInstallerService.GetAppVersion();
        SettingsView.SetUpdateStatus("Buscando actualizaciones...", canInstall: false);
        StatusText.Text = "Buscando actualizaciones...";

        var update = await _apiService.CheckForUpdatesAsync(current);
        if (update == null)
        {
            SettingsView.SetUpdateStatus(
                "No se pudo conectar al servidor. Podés descargar el instalador desde madsjeez.com e instalarlo sobre la versión actual.",
                canInstall: false);
            StatusText.Text = "Sin conexión para buscar actualizaciones";
            return;
        }

        if (!update.UpdateAvailable)
        {
            SettingsView.SetUpdateStatus($"Tenés la última versión (v{current}).", canInstall: false);
            StatusText.Text = "Estás al día";
            return;
        }

        var latestVersion = update.Latest?.Version ?? update.Version ?? "?";
        var downloadUrl = update.Latest?.DownloadUrl ?? update.DownloadUrl;
        SettingsView.SetUpdateStatus(
            $"Hay una nueva versión: v{latestVersion} (actual: v{current}). Podés instalarla sin desinstalar la anterior.",
            canInstall: !string.IsNullOrEmpty(downloadUrl),
            downloadUrl);
        StatusText.Text = $"Actualización disponible: v{latestVersion}";
    }

    private async Task HandleInstallUpdateAsync()
    {
        var downloadUrl = SettingsView.GetPendingUpdateUrl();
        if (string.IsNullOrEmpty(downloadUrl))
        {
            MessageBox.Show(
                "Primero buscá actualizaciones.",
                "Actualizar",
                MessageBoxButton.OK,
                MessageBoxImage.Information);
            return;
        }

        var confirm = MessageBox.Show(
            "Se descargará el instalador y se cerrará el navegador para actualizar.\n\n¿Continuar?",
            "Instalar actualización",
            MessageBoxButton.YesNo,
            MessageBoxImage.Question);
        if (confirm != MessageBoxResult.Yes) return;

        try
        {
            StatusText.Text = "Descargando actualización...";
            SettingsView.SetUpdateStatus("Descargando actualización...", canInstall: false);
            var setupPath = await _updateService.DownloadAndExtractInstallerAsync(downloadUrl);
            _updateService.LaunchInstaller(setupPath);
            Application.Current.Shutdown();
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                $"No se pudo descargar la actualización:\n\n{ex.Message}\n\nTambién podés descargar el instalador manualmente desde la web e instalarlo sobre la versión actual.",
                "Error de actualización",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
            StatusText.Text = "Error al descargar actualización";
        }
    }

    // AI Actions
    private async void AiAction_MlTitle(object sender, RoutedEventArgs e) =>
        await RunAiAction("ML_TITLE", "Genera un título optimizado para Mercado Libre basado en el contenido de la página actual.");

    private async void AiAction_SeoDescription(object sender, RoutedEventArgs e) =>
        await RunAiAction("SEO_DESCRIPTION", "Genera una descripción SEO optimizada para marketplace.");

    private async void AiAction_CustomerReply(object sender, RoutedEventArgs e) =>
        await RunAiAction("CUSTOMER_REPLY", "Ayúdame a redactar una respuesta profesional a un cliente.");

    private async void AiAction_Competitor(object sender, RoutedEventArgs e) =>
        await RunAiAction("COMPETITOR_ANALYSIS", "Analiza la competencia en esta página y dame recomendaciones.");

    private async void AiAction_Summary(object sender, RoutedEventArgs e) =>
        await RunAiAction("PAGE_SUMMARY", "Resume el contenido visible de esta página.");

    private async void AiAction_Facebook(object sender, RoutedEventArgs e) =>
        await RunAiAction("FACEBOOK_POST", "Genera una publicación atractiva para Facebook para promocionar este producto.");

    private async void AiAction_Price(object sender, RoutedEventArgs e) =>
        await RunAiAction("PRICE_SUGGESTION", "Sugiere un precio competitivo basado en el contexto de la página.");

    private async void AiSendBtn_Click(object sender, RoutedEventArgs e) =>
        await SendAiMessage();

    private async void AiInput_KeyDown(object sender, KeyEventArgs e)
    {
        if (e.Key == Key.Enter && Keyboard.Modifiers == ModifierKeys.Control)
            await SendAiMessage();
    }

    private async Task SendAiMessage()
    {
        var text = AiInput.Text.Trim();
        if (string.IsNullOrEmpty(text)) return;
        AiInput.Text = string.Empty;
        await RunAiAction("GENERAL", text);
    }

    private async Task RunAiAction(string type, string prompt)
    {
        AddAiMessage(true, prompt);
        StatusText.Text = "Generando respuesta IA...";

        string? pageContent = null;
        try
        {
            var task = WebBrowser.EvaluateScriptAsync(
                "document.body ? document.body.innerText.substring(0, 4000) : ''");
            var result = await task;
            pageContent = result.Success ? result.Result?.ToString() : null;
        }
        catch { /* page may not be ready */ }

        var response = await _apiService.GenerateAiResponseAsync(
            type, prompt, WebBrowser.Address, pageContent);

        response ??= GenerateLocalAiResponse(type, prompt, pageContent);
        AddAiMessage(false, response);
        StatusText.Text = "Listo";
    }

    private static string GenerateLocalAiResponse(string type, string prompt, string? pageContent)
    {
        var preview = pageContent?.Length > 100 ? pageContent[..100] + "..." : pageContent ?? "sin contenido";
        return type switch
        {
            "ML_TITLE" => $"[Demo local] Título sugerido: Producto Premium - Envío Gratis - Garantía Oficial\n\nBasado en: {preview}",
            "SEO_DESCRIPTION" => $"[Demo local] Descripción SEO optimizada con palabras clave relevantes para Latinoamérica.\n\nContexto: {preview}",
            "PRICE_SUGGESTION" => "[Demo local] Precio sugerido: analiza competencia local. Recomendación: precio competitivo con margen del 25-35%.",
            _ => $"[Demo local - Conecta el backend para IA real]\n\nRespuesta a: {prompt}\n\nContexto de página: {preview}",
        };
    }

    private void AddAiMessage(bool isUser, string content)
    {
        _aiMessages.Add(new AiMessage { IsUser = isUser, Content = content });

        var border = new Border
        {
            Background = new SolidColorBrush(isUser
                ? Color.FromRgb(99, 102, 241)
                : Color.FromRgb(18, 26, 46)),
            CornerRadius = new CornerRadius(8),
            Padding = new Thickness(10, 8, 10, 8),
            Margin = new Thickness(isUser ? 20 : 0, 4, isUser ? 0 : 20, 4),
            HorizontalAlignment = isUser ? HorizontalAlignment.Right : HorizontalAlignment.Left,
            MaxWidth = 300,
        };

        border.Child = new TextBlock
        {
            Text = content,
            TextWrapping = TextWrapping.Wrap,
            Foreground = Brushes.White,
            FontSize = 12,
        };

        AiChatPanel.Children.Add(border);
        AiChatScroll.ScrollToEnd();
    }
}
