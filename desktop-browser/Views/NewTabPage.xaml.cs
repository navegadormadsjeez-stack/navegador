using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace MadsjeezSellerBrowser.Views;

public partial class NewTabPage : UserControl
{
    private const string Placeholder = "Buscar en la web de forma privada...";

    public event EventHandler<string>? NavigateRequested;
    public event EventHandler? AiAssistRequested;

    public NewTabPage()
    {
        InitializeComponent();
    }

    private void SearchBox_GotFocus(object sender, RoutedEventArgs e)
    {
        if (SearchBox.Text == Placeholder)
            SearchBox.Text = string.Empty;
    }

    private void SearchBox_LostFocus(object sender, RoutedEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(SearchBox.Text))
            SearchBox.Text = Placeholder;
    }

    private void SearchBox_KeyDown(object sender, KeyEventArgs e)
    {
        if (e.Key != Key.Enter) return;
        var query = SearchBox.Text.Trim();
        if (query == Placeholder || string.IsNullOrEmpty(query)) return;
        NavigateRequested?.Invoke(this, query);
    }

    private void QuickLink_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button { Tag: string url } && url != "about:newtab")
            NavigateRequested?.Invoke(this, url);
    }

    private void AiSearchBtn_Click(object sender, RoutedEventArgs e) =>
        AiAssistRequested?.Invoke(this, EventArgs.Empty);
}
