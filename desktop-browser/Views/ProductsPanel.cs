using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using MadsjeezSellerBrowser.Models;
using MadsjeezSellerBrowser.Services;

namespace MadsjeezSellerBrowser.Views;

public class ProductsPanel : Window
{
    private readonly ApiService _api;
    private readonly SettingsService _settings;
    private readonly ListBox _productList;
    private readonly TextBox _nameInput;
    private readonly TextBox _priceInput;
    private readonly TextBox _stockInput;
    private readonly TextBox _descInput;
    private List<ApiProduct> _products = new();

    public ProductsPanel(ApiService api, SettingsService settings)
    {
        _api = api;
        _settings = settings;

        Title = "📦 Productos - Madsjeez";
        Width = 640;
        Height = 520;
        WindowStartupLocation = WindowStartupLocation.CenterOwner;
        Background = new SolidColorBrush(Color.FromRgb(26, 26, 46));

        var grid = new Grid { Margin = new Thickness(16) };
        grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
        grid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });
        grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

        var title = new TextBlock
        {
            Text = "Catálogo de Productos (nube)",
            FontSize = 18,
            FontWeight = FontWeights.Bold,
            Foreground = Brushes.White,
            Margin = new Thickness(0, 0, 0, 12),
        };
        Grid.SetRow(title, 0);
        grid.Children.Add(title);

        _productList = new ListBox
        {
            Background = new SolidColorBrush(Color.FromRgb(15, 23, 42)),
            Foreground = Brushes.White,
            BorderThickness = new Thickness(0),
        };
        _productList.MouseDoubleClick += async (_, _) => await DeleteSelectedProductAsync();
        Grid.SetRow(_productList, 1);
        grid.Children.Add(_productList);

        var form = new StackPanel { Margin = new Thickness(0, 12, 0, 0) };
        Grid.SetRow(form, 2);

        _nameInput = CreateInput("Nombre del producto");
        _priceInput = CreateInput("Precio");
        _stockInput = CreateInput("Stock");
        _descInput = CreateInput("Descripción");

        form.Children.Add(_nameInput);
        form.Children.Add(_priceInput);
        form.Children.Add(_stockInput);
        form.Children.Add(_descInput);

        var buttons = new StackPanel { Orientation = Orientation.Horizontal };
        var addBtn = new Button
        {
            Content = "+ Agregar producto",
            Background = new SolidColorBrush(Color.FromRgb(99, 102, 241)),
            Foreground = Brushes.White,
            Padding = new Thickness(16, 8, 16, 8),
            Margin = new Thickness(0, 8, 8, 0),
            BorderThickness = new Thickness(0),
            Cursor = System.Windows.Input.Cursors.Hand,
        };
        addBtn.Click += async (_, _) => await AddProductAsync();
        buttons.Children.Add(addBtn);

        var refreshBtn = new Button
        {
            Content = "↻ Actualizar",
            Background = new SolidColorBrush(Color.FromRgb(51, 65, 85)),
            Foreground = Brushes.White,
            Padding = new Thickness(16, 8, 16, 8),
            Margin = new Thickness(0, 8, 0, 0),
            BorderThickness = new Thickness(0),
            Cursor = System.Windows.Input.Cursors.Hand,
        };
        refreshBtn.Click += async (_, _) => await LoadProductsAsync();
        buttons.Children.Add(refreshBtn);

        form.Children.Add(buttons);
        grid.Children.Add(form);
        Content = grid;

        Loaded += async (_, _) => await LoadProductsAsync();
    }

    private static TextBox CreateInput(string placeholder) =>
        new()
        {
            Tag = placeholder,
            Text = placeholder,
            Foreground = Brushes.White,
            Background = new SolidColorBrush(Color.FromRgb(15, 23, 42)),
            BorderBrush = new SolidColorBrush(Color.FromRgb(51, 65, 85)),
            Padding = new Thickness(8),
            Margin = new Thickness(0, 0, 0, 6),
        };

    private static string GetInput(TextBox box, string placeholder) =>
        box.Text == placeholder ? string.Empty : box.Text.Trim();

    private async Task LoadProductsAsync()
    {
        _productList.Items.Clear();
        var workspaceId = _settings.Settings.ActiveWorkspaceId;
        _products = await _api.GetProductsAsync(workspaceId);
        foreach (var p in _products)
            _productList.Items.Add($"📦 {p.Name} - ${p.Price:N0} - Stock: {p.Stock}");
        if (_products.Count == 0)
            _productList.Items.Add("(Sin productos — agrega uno abajo)");
    }

    private async Task AddProductAsync()
    {
        var name = GetInput(_nameInput, "Nombre del producto");
        if (string.IsNullOrWhiteSpace(name)) return;

        if (!decimal.TryParse(GetInput(_priceInput, "Precio"), NumberStyles.Any, CultureInfo.InvariantCulture, out var price))
            price = 0;
        if (!int.TryParse(GetInput(_stockInput, "Stock"), out var stock))
            stock = 0;

        var desc = GetInput(_descInput, "Descripción");
        var created = await _api.CreateProductAsync(name, price, stock, desc, _settings.Settings.ActiveWorkspaceId);
        if (created == null)
        {
            MessageBox.Show("No se pudo crear el producto. Verifica tu sesión.", "Error", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }

        _nameInput.Text = "Nombre del producto";
        _priceInput.Text = "Precio";
        _stockInput.Text = "Stock";
        _descInput.Text = "Descripción";
        await LoadProductsAsync();
    }

    private async Task DeleteSelectedProductAsync()
    {
        var idx = _productList.SelectedIndex;
        if (idx < 0 || idx >= _products.Count) return;
        var product = _products[idx];
        if (MessageBox.Show($"¿Eliminar '{product.Name}'?", "Confirmar", MessageBoxButton.YesNo) != MessageBoxResult.Yes)
            return;
        await _api.DeleteProductAsync(product.Id);
        await LoadProductsAsync();
    }
}
