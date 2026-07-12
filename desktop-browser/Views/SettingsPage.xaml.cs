using System.Windows;
using System.Windows.Controls;

namespace MadsjeezSellerBrowser.Views;

public partial class SettingsPage : UserControl
{
    public event EventHandler? LogoutRequested;
    public event EventHandler? SaveRequested;
    public event EventHandler? ClearHistoryRequested;
    public event EventHandler? ClearCacheRequested;
    public event EventHandler<string>? NavigateRequested;

    public SettingsPage()
    {
        InitializeComponent();
    }

    public void LoadData(string userEmail, string? userName, string activeProfileName,
        IEnumerable<string> profileNames, string homePage, bool sidebarOpen,
        string searchEngine, string version)
    {
        UserEmailText.Text = string.IsNullOrEmpty(userEmail) ? "—" : userEmail;
        UserNameText.Text = string.IsNullOrEmpty(userName) ? "—" : userName;
        ProfileNameText.Text = activeProfileName;
        ProfilesListText.Text = profileNames.Any()
            ? "Perfiles disponibles: " + string.Join(", ", profileNames)
            : "Sin perfiles adicionales";

        HomePageBox.Text = homePage;
        SidebarOpenCheck.IsChecked = sidebarOpen;

        foreach (ComboBoxItem item in SearchEngineBox.Items)
        {
            if (item.Tag is string tag && tag.Equals(searchEngine, StringComparison.OrdinalIgnoreCase))
            {
                SearchEngineBox.SelectedItem = item;
                break;
            }
        }
        if (SearchEngineBox.SelectedItem == null && SearchEngineBox.Items.Count > 0)
            SearchEngineBox.SelectedIndex = 0;

        VersionText.Text = $"Versión {version}";
    }

    public string GetHomePage() => HomePageBox.Text.Trim();

    public bool GetSidebarOpen() => SidebarOpenCheck.IsChecked == true;

    public string GetSearchEngine()
    {
        if (SearchEngineBox.SelectedItem is ComboBoxItem { Tag: string tag })
            return tag;
        return "duckduckgo";
    }

    private void SaveBtn_Click(object sender, RoutedEventArgs e) => SaveRequested?.Invoke(this, EventArgs.Empty);

    private void LogoutBtn_Click(object sender, RoutedEventArgs e) => LogoutRequested?.Invoke(this, EventArgs.Empty);

    private void ClearHistoryBtn_Click(object sender, RoutedEventArgs e) =>
        ClearHistoryRequested?.Invoke(this, EventArgs.Empty);

    private void ClearCacheBtn_Click(object sender, RoutedEventArgs e) =>
        ClearCacheRequested?.Invoke(this, EventArgs.Empty);

    private void WebsiteBtn_Click(object sender, RoutedEventArgs e) =>
        NavigateRequested?.Invoke(this, "https://www.madsjeez.com");
}
