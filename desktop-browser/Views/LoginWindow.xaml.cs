using System.Windows;
using MadsjeezSellerBrowser.Services;

namespace MadsjeezSellerBrowser.Views;

public partial class LoginWindow : Window
{
    private readonly SettingsService _settings;
    private readonly ApiService _api;

    public bool LoginSucceeded { get; private set; }

    public LoginWindow(SettingsService settings, ApiService api)
    {
        InitializeComponent();
        _settings = settings;
        _api = api;

        if (!string.IsNullOrEmpty(_settings.Settings.UserEmail))
            EmailBox.Text = _settings.Settings.UserEmail;
    }

    private async void LoginBtn_Click(object sender, RoutedEventArgs e)
    {
        ErrorText.Visibility = Visibility.Collapsed;
        LoginBtn.IsEnabled = false;

        var email = EmailBox.Text.Trim();
        var password = PasswordBox.Password;

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            ShowError("Ingresa email y contraseña.");
            LoginBtn.IsEnabled = true;
            return;
        }

        var result = await _api.LoginAsync(email, password);
        if (result == null)
        {
            ShowError("Credenciales inválidas o API no disponible.");
            LoginBtn.IsEnabled = true;
            return;
        }

        _api.PersistAuth(result);
        LoginSucceeded = true;
        DialogResult = true;
        Close();
    }

    private async void CreateAccountBtn_Click(object sender, RoutedEventArgs e)
    {
        RegErrorText.Visibility = Visibility.Collapsed;
        CreateAccountBtn.IsEnabled = false;

        var name = NameBox.Text.Trim();
        var email = RegEmailBox.Text.Trim();
        var password = RegPasswordBox.Password;

        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email) || password.Length < 6)
        {
            ShowRegError("Completa todos los campos (mínimo 6 caracteres en contraseña).");
            CreateAccountBtn.IsEnabled = true;
            return;
        }

        var result = await _api.RegisterAsync(name, email, password);
        if (result == null)
        {
            ShowRegError("No se pudo crear la cuenta. El email puede estar en uso.");
            CreateAccountBtn.IsEnabled = true;
            return;
        }

        _api.PersistAuth(result);
        LoginSucceeded = true;
        DialogResult = true;
        Close();
    }

    private void RegisterBtn_Click(object sender, RoutedEventArgs e)
    {
        LoginPanel.Visibility = Visibility.Collapsed;
        RegisterPanel.Visibility = Visibility.Visible;
    }

    private void BackToLogin_Click(object sender, RoutedEventArgs e)
    {
        RegisterPanel.Visibility = Visibility.Collapsed;
        LoginPanel.Visibility = Visibility.Visible;
    }

    private void ShowError(string message)
    {
        ErrorText.Text = message;
        ErrorText.Visibility = Visibility.Visible;
    }

    private void ShowRegError(string message)
    {
        RegErrorText.Text = message;
        RegErrorText.Visibility = Visibility.Visible;
    }
}
