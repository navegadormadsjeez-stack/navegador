using System.IO;

namespace MadsjeezSellerBrowser.Services;

public static class StartupArgumentResolver
{
    /// <summary>
    /// Resolves a command-line argument to a navigable URL (http/https/file).
    /// Returns null if the argument is not a valid URL or local web file.
    /// </summary>
    public static string? Resolve(string? argument)
    {
        if (string.IsNullOrWhiteSpace(argument))
            return null;

        var trimmed = argument.Trim().Trim('"');

        if (Uri.TryCreate(trimmed, UriKind.Absolute, out var absoluteUri)
            && (absoluteUri.Scheme == Uri.UriSchemeHttp
                || absoluteUri.Scheme == Uri.UriSchemeHttps
                || absoluteUri.Scheme == Uri.UriSchemeFile))
        {
            return absoluteUri.AbsoluteUri;
        }

        if (File.Exists(trimmed))
        {
            var ext = Path.GetExtension(trimmed).ToLowerInvariant();
            if (ext is ".htm" or ".html" or ".xhtml" or ".svg" or ".webp" or ".mhtml" or ".mht")
                return new Uri(Path.GetFullPath(trimmed)).AbsoluteUri;
        }

        if (trimmed.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
            || trimmed.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            return trimmed;
        }

        return null;
    }

    public static string? ResolveFirst(IEnumerable<string> args) =>
        args.Select(Resolve).FirstOrDefault(url => !string.IsNullOrEmpty(url));
}
