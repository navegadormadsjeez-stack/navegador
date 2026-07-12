using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
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

    public MainWindow(SettingsService settings, ApiService api)
    {
        _settingsService = settings;
        _apiService = api;
        InitializeComponent();
        Loaded += MainWindow_Loaded;
    }

    private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
    {
        await SyncFromApiAsync();

        _profiles = _settingsService.LoadProfiles();
        if (_profiles.Count == 0)
            _profiles = SettingsService.GetDefaultProfiles();

        ProfileComboBox.ItemsSource = _profiles;
        ProfileComboBox.DisplayMemberPath = "Name";

        var activeId = _settingsService.Settings.ActiveProfileId;
        _activeProfile = _profiles.FirstOrDefault(p => p.Id == activeId) ?? _profiles.First();
        ProfileComboBox.SelectedItem = _activeProfile;

        ApplyProfile(_activeProfile);
        SetupBrowserEvents();
        await LoadFavoritesAsync();

        if (!_settingsService.Settings.SidebarOpen)
            ToggleSidebar(false);

        Title = $"Madsjeez Seller Browser — {_settingsService.Settings.UserEmail}";
        _ = _apiService.TrackTelemetryAsync("app_started");
        _ = CheckUpdatesAsync();

        AddAiMessage(false, "¡Hola! Soy Madsjeez AI, tu asistente para vender online. Selecciona una acción rápida o escribe tu consulta.");
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
        _activeProfile = profile;
        _settingsService.Settings.ActiveProfileId = profile.Id;
        _settingsService.Settings.ActiveWorkspaceId = profile.WorkspaceId ?? profile.Id;
        _settingsService.SaveProfiles(_profiles);
        _settingsService.Save();

        Directory.CreateDirectory(profile.CachePath);

        var rcSettings = new RequestContextSettings
        {
            CachePath = profile.CachePath,
            PersistSessionCookies = true,
        };
        WebBrowser.RequestContext = new RequestContext(rcSettings);

        _tabs.Clear();
        TabBar.Children.Clear();

        foreach (var url in profile.StartupUrls)
            CreateTab(url);

        if (_tabs.Count == 0)
            CreateTab(_settingsService.Settings.HomePage);

        _ = LoadFavoritesAsync();
    }

    private void CreateTab(string url)
    {
        var tab = new BrowserTab { Url = url, Title = "Nueva pestaña" };
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

        var container = new Border { Child = panel, Tag = tab };
        TabBar.Children.Add(container);

        SelectTab(tab);
    }

    private void SelectTab(BrowserTab tab)
    {
        _activeTab = tab;
        foreach (var child in TabBar.Children)
        {
            if (child is Border border && border.Tag is BrowserTab t)
            {
                border.Background = t.Id == tab.Id
                    ? new SolidColorBrush(Color.FromRgb(30, 41, 59))
                    : Brushes.Transparent;
            }
        }

        if (WebBrowser.Address != tab.Url)
            WebBrowser.Load(tab.Url);
        UrlTextBox.Text = tab.Url;
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
            SelectTab(tab);
    }

    private void ProfileComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (ProfileComboBox.SelectedItem is BrowserProfile profile && profile.Id != _activeProfile?.Id)
            ApplyProfile(profile);
    }

    private void BackBtn_Click(object sender, RoutedEventArgs e) => WebBrowser.Back();
    private void ForwardBtn_Click(object sender, RoutedEventArgs e) => WebBrowser.Forward();
    private void ReloadBtn_Click(object sender, RoutedEventArgs e) => WebBrowser.Reload();
    private void HomeBtn_Click(object sender, RoutedEventArgs e) => NavigateTo(_settingsService.Settings.HomePage);

    private void UrlTextBox_KeyDown(object sender, KeyEventArgs e)
    {
        if (e.Key == Key.Enter)
            NavigateTo(UrlTextBox.Text);
    }

    private void NavigateTo(string input)
    {
        var url = NormalizeUrl(input);
        if (_activeTab != null)
        {
            _activeTab.Url = url;
            UpdateTabTitle(_activeTab);
        }
        WebBrowser.Load(url);
        UrlTextBox.Text = url;
    }

    private static string NormalizeUrl(string input)
    {
        input = input.Trim();
        if (string.IsNullOrEmpty(input)) return "about:blank";

        if (!input.Contains('.') && !input.StartsWith("http"))
            return $"https://www.google.com/search?q={Uri.EscapeDataString(input)}";

        if (!input.StartsWith("http://") && !input.StartsWith("https://"))
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

    private void ToggleSidebarBtn_Click(object sender, RoutedEventArgs e)
    {
        ToggleSidebar(SidebarColumn.Width.Value < 10);
    }

    private void ToggleSidebar(bool open)
    {
        SidebarColumn.Width = new GridLength(open ? 360 : 0);
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
        var update = await _apiService.CheckForUpdatesAsync("0.1.0");
        if (update == null)
        {
            StatusText.Text = "Modo offline - API no disponible";
            return;
        }
        if (update.UpdateAvailable)
            StatusText.Text = $"Actualización disponible: v{update.Version}";
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
                : Color.FromRgb(30, 41, 59)),
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
