using System.Diagnostics;
using System.Runtime.InteropServices;

namespace MadsjeezSellerBrowser.Services;

internal static class SingleInstanceHelper
{
    public const string MutexName = "MadsjeezSellerBrowser_SingleInstance_v1";

    [DllImport("user32.dll")]
    private static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    private static extern bool IsIconic(IntPtr hWnd);

    private const int SwRestore = 9;

    public static bool TryActivateExistingInstance()
    {
        var current = Process.GetCurrentProcess();
        foreach (var process in Process.GetProcessesByName(current.ProcessName))
        {
            if (process.Id == current.Id)
                continue;

            try
            {
                if (!process.HasExited)
                    process.Refresh();

                var handle = process.MainWindowHandle;
                if (handle == IntPtr.Zero && !process.HasExited)
                {
                    process.WaitForInputIdle(3000);
                    handle = process.MainWindowHandle;
                }

                if (handle != IntPtr.Zero)
                {
                    if (IsIconic(handle))
                        ShowWindow(handle, SwRestore);
                    else
                        ShowWindow(handle, SwRestore);

                    SetForegroundWindow(handle);
                    return true;
                }
            }
            catch
            {
                /* ignore stale process handles */
            }
        }

        return false;
    }
}
