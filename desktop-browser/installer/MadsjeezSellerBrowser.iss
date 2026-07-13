; Madsjeez Seller Browser — Instalador profesional (Inno Setup 6)
; Compilar: ISCC.exe MadsjeezSellerBrowser.iss
; Requiere publish en ..\publish\win-x64 (ver build-installer.ps1)

#define MyAppName "Madsjeez Seller Browser"
#define MyAppVersion "0.1.14"
#define MyAppPublisher "Madsjeez"
#define MyAppURL "https://admin-panel-production-b4e5.up.railway.app"
#define MyAppExeName "MadsjeezSellerBrowser.exe"
#define MyAppId "{8F4E2B1A-9C3D-4E5F-A6B7-1C2D3E4F5A6B}"
#define MyPublishDir "..\publish\win-x64"
#define MyAppCanonicalName "MadsJeezBrowser"
#define MyHtmlProgId "MadsJeezHTML"
#define MyHttpProgId "MadsJeezHTTP"
#define MyHttpsProgId "MadsJeezHTTPS"
#define MyAppDescription "Navegador web para vendedores online de Latinoamerica"

[Setup]
AppId={{#MyAppId}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
VersionInfoVersion={#MyAppVersion}.0
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}/api/download
DefaultDirName={autopf}\MadsjeezSellerBrowser
DefaultGroupName=Madsjeez
DisableProgramGroupPage=yes
OutputDir=..\release
OutputBaseFilename=MadsjeezSellerBrowserSetup
SetupIconFile=..\Assets\app.ico
UninstallDisplayIcon={app}\app.ico
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
MinVersion=10.0
UsePreviousAppDir=yes
DisableDirPage=auto
CloseApplications=force
RestartApplications=yes
AppMutex=MadsjeezSellerBrowser_SingleInstance_v1,{#MyAppExeName}
AllowNoIcons=yes
Uninstallable=yes
CreateUninstallRegKey=yes
UpdateUninstallLogAppName=yes
ShowLanguageDialog=no
LicenseFile=
InfoBeforeFile=
ChangesAssociations=no

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[CustomMessages]
spanish.WelcomeLabel2=Esto instalara [name/ver] en su equipo.%n%nNavegador para vendedores en MercadoLibre y marketplaces de Latinoamerica.%n%nIncluye todo lo necesario para ejecutarse: no hace falta instalar .NET por separado.%n%nSe registrara como navegador web en Windows y se crearan accesos directos.
spanish.FinishedLabel=La instalacion de [name] se completo correctamente.%n%nHaga clic en Finalizar para abrir el navegador.%n%nPara elegirlo como navegador predeterminado, use Ajustes > Windows dentro de la app.
spanish.FinishedHeadingLabel=Instalacion completada
spanish.UpgradeWelcome=Ya tiene instalada la version %1.%n%nEste asistente actualizara [name/ver] conservando su configuracion, perfiles y datos.%n%nSe cerrara el navegador si esta abierto.

[Tasks]
Name: "desktopicon"; Description: "Crear acceso directo en el &escritorio"; GroupDescription: "Accesos directos:"; Flags: checkedonce

[Files]
Source: "{#MyPublishDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\app.ico"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\app.ico"; Tasks: desktopicon

[Registry]
; RegisteredApplications — required for Default Apps settings
Root: HKLM; Subkey: "SOFTWARE\RegisteredApplications"; ValueType: string; ValueName: "{#MyAppName}"; ValueData: "Software\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities"; Flags: uninsdeletevalue

; StartMenuInternet client
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}"; ValueType: string; ValueName: ""; ValueData: "{#MyAppName}"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" ""%1"""; Flags: uninsdeletekeyifempty

; Capabilities
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities"; ValueType: string; ValueName: "ApplicationDescription"; ValueData: "{#MyAppDescription}"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities"; ValueType: string; ValueName: "ApplicationName"; ValueData: "{#MyAppName}"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities"; ValueType: string; ValueName: "ApplicationIcon"; ValueData: "{app}\{#MyAppExeName},0"; Flags: uninsdeletekeyifempty

; URL associations
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities\URLAssociations"; ValueType: string; ValueName: "http"; ValueData: "{#MyHttpProgId}"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities\URLAssociations"; ValueType: string; ValueName: "https"; ValueData: "{#MyHttpsProgId}"; Flags: uninsdeletekeyifempty

; File associations
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities\FileAssociations"; ValueType: string; ValueName: ".htm"; ValueData: "{#MyHtmlProgId}"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities\FileAssociations"; ValueType: string; ValueName: ".html"; ValueData: "{#MyHtmlProgId}"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities\FileAssociations"; ValueType: string; ValueName: ".xhtml"; ValueData: "{#MyHtmlProgId}"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities\FileAssociations"; ValueType: string; ValueName: ".svg"; ValueData: "{#MyHtmlProgId}"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Clients\StartMenuInternet\{#MyAppCanonicalName}\Capabilities\FileAssociations"; ValueType: string; ValueName: ".webp"; ValueData: "{#MyHtmlProgId}"; Flags: uninsdeletekeyifempty

; ProgID: HTML and web files
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHtmlProgId}"; ValueType: string; ValueName: ""; ValueData: "Madsjeez HTML Document"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHtmlProgId}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHtmlProgId}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" ""%1"""; Flags: uninsdeletekeyifempty

; ProgID: HTTP
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHttpProgId}"; ValueType: string; ValueName: ""; ValueData: "Madsjeez HTTP URL"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHttpProgId}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHttpProgId}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" ""%1"""; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHttpProgId}\URL Protocol"; ValueType: string; ValueName: ""; ValueData: ""; Flags: uninsdeletekeyifempty

; ProgID: HTTPS
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHttpsProgId}"; ValueType: string; ValueName: ""; ValueData: "Madsjeez HTTPS URL"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHttpsProgId}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHttpsProgId}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" ""%1"""; Flags: uninsdeletekeyifempty
Root: HKLM; Subkey: "SOFTWARE\Classes\{#MyHttpsProgId}\URL Protocol"; ValueType: string; ValueName: ""; ValueData: ""; Flags: uninsdeletekeyifempty

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Abrir {#MyAppName}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Code]
var
  IsUpgrade: Boolean;
  PrevVersion: String;

function InstalledVersion(): String;
begin
  Result := '';
  if RegQueryStringValue(HKLM, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{#MyAppId}_is1', 'DisplayVersion', Result) then
    Exit;
  if RegQueryStringValue(HKCU, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{#MyAppId}_is1', 'DisplayVersion', Result) then
    Exit;
end;

function InitializeSetup(): Boolean;
begin
  PrevVersion := InstalledVersion();
  IsUpgrade := PrevVersion <> '';
  Result := True;
end;

procedure InitializeWizard();
begin
  if IsUpgrade then
    WizardForm.Caption := 'Actualizar {#MyAppName}'
  else
    WizardForm.Caption := 'Instalar {#MyAppName}';
end;

procedure CurPageChanged(CurPageID: Integer);
begin
  if (CurPageID = wpWelcome) and IsUpgrade then
  begin
    WizardForm.WelcomeLabel1.Caption := 'Actualizar {#MyAppName}';
    WizardForm.WelcomeLabel2.Caption := FmtMessage(CustomMessage('UpgradeWelcome'), [PrevVersion]);
  end;
end;

function PrepareToInstall(var NeedsRestart: Boolean): String;
begin
  Result := '';
  if IsUpgrade then
    WizardForm.StatusLabel.Caption := 'Actualizando a la version {#MyAppVersion}...';
end;

function UpdateReadyMemo(const Space, NewLine, MemoUserInfoInfo, MemoDirInfo, MemoTypeInfo,
  MemoComponentsInfo, MemoGroupInfo, MemoTasksInfo: String): String;
begin
  Result := MemoDirInfo + NewLine + NewLine;
  if IsUpgrade then
    Result := Result + 'Tipo: Actualizacion' + NewLine +
              'Version anterior: ' + PrevVersion + NewLine +
              'Version nueva: {#MyAppVersion}' + NewLine + NewLine +
              'Se reemplazaran los archivos del programa. Tus perfiles y ajustes se conservan.'
  else
    Result := Result + 'Tipo: Instalacion nueva';
end;
