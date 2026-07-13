using System.Windows;
using System.Windows.Controls;

namespace MadsjeezSellerBrowser.Views;

public partial class ExtensionsPage : UserControl
{
    public event EventHandler<string>? ToolRequested;

    public ExtensionsPage()
    {
        InitializeComponent();
    }

    private void Tool_Click(object sender, RoutedEventArgs e)
    {
        if (sender is Button { Tag: string tool })
            ToolRequested?.Invoke(this, tool);
    }
}
