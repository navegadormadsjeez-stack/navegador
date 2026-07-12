using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
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

    public ProductsPanel(ApiService api, SettingsService settings)
    {
        _api = api;
        _settings = settings;

        Title = "📦 Productos - Madsjeez";
        Width = 600;
        Height = 500;
        WindowStartupLocation = WindowStartupLocation.CenterOwner;
        Background = new SolidColorBrush(Color.FromRgb(26, 26, 46));

        var grid = new Grid { Margin = new Thickness(16) };
        grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
        grid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });
        grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

        var title = new TextBlock
        {
            Text = "Catálogo de Productos",
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

        var addBtn = new Button
        {
            Content = "+ Agregar producto",
            Background = new SolidColorBrush(Color.FromRgb(99, 102, 241)),
            Foreground = Brushes.White,
            Padding = new Thickness(16, 8, 16, 8),
            Margin = new Thickness(0, 8, 0, 0),
            BorderThickness = new Thickness(0),
            Cursor = System.Windows.Input.Cursors.Hand,
        };
        addBtn.Click += (_, _) => AddLocalProduct();
        form.Children.Add(addBtn);

        grid.Children.Add(form);
        Content = grid;

        LoadLocalProducts();
    }

    private static TextBox CreateInput(string placeholder)
    {
        return new TextBox
        {
            Tag = placeholder,
            Text = placeholder,
            Foreground = Brushes.White,
            Background = new SolidColorBrush(Color.FromRgb(15, 23, 42)),
            BorderBrush = new SolidColorBrush(Color.FromRgb(51, 65, 85)),
            Padding = new Thickness(8),
            Margin = new Thickness(0, 0, 0, 6),
        };
    }

    private void LoadLocalProducts()
    {
        _productList.Items.Add("📦 Producto demo - $15.999 - Stock: 10");
        _productList.Items.Add("📦 Aceite Natural 500ml - $8.500 - Stock: 25");
    }

    private void AddLocalProduct()
    {
        var name = _nameInput.Text;
        var price = _priceInput.Text;
        var stock = _stockInput.Text;
        if (string.IsNullOrWhiteSpace(name) || name == "Nombre del producto") return;

        _productList.Items.Add($"📦 {name} - ${price} - Stock: {stock}");
        _nameInput.Text = "Nombre del producto";
        _priceInput.Text = "Precio";
        _stockInput.Text = "Stock";
        _descInput.Text = "Descripción";
    }
}
