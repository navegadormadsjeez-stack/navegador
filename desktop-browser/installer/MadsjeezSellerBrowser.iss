; Madsjeez Seller Browser — Instalador profesional (Inno Setup 6)
; Compilar: ISCC.exe MadsjeezSellerBrowser.iss
; Requiere publish en ..\publish\win-x64 (ver build-installer.ps1)

#define MyAppName "Madsjeez Seller Browser"
#define MyAppVersion "0.1.10"
#define MyAppPublisher "Madsjeez"
#define MyAppURL "https://admin-panel-production-b4e5.up.railway.app"
#define MyAppExeName "MadsjeezSellerBrowser.exe"
#define MyAppId "{8F4E2B1A-9C3D-4E5F-A6B7-1C2D3E4F5A6B}"
#define MyPublishDir "..\publish\win-x64"

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
DefaultDirName={localappdata}\Programs\MadsjeezSellerBrowser
DefaultGroupName=Madsjeez
DisableProgramGroupPage=yes
OutputDir=..\release
OutputBaseFilename=MadsjeezSellerBrowserSetup
SetupIconFile=..\Assets\app.ico
UninstallDisplayIcon={app}\app.ico
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
MinVersion=10.0
; Actualización sobre instalación existente
UsePreviousAppDir=yes
DisableDirPage=auto
CloseApplications=force
RestartApplications=yes
AppMutex={#MyAppId},{#MyAppExeName}
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
spanish.WelcomeLabel2=Esto instalará [name/ver] en su equipo.%n%nNavegador para vendedores en MercadoLibre y marketplaces de Latinoamérica.%n%nIncluye todo lo necesario para ejecutarse: no hace falta instalar .NET por separado.%n%nSe crearán accesos directos en el escritorio y menú Inicio.
spanish.FinishedLabel=La instalación de [name] se completó correctamente.%n%nHaga clic en Finalizar para abrir el navegador.
spanish.FinishedHeadingLabel=Instalación completada
spanish.UpgradeWelcome=Ya tiene instalada la versión %1.%n%nEste asistente actualizará [name/ver] conservando su configuración, perfiles y datos.%n%nSe cerrará el navegador si está abierto.

[Tasks]
Name: "desktopicon"; Description: "Crear acceso directo en el &escritorio"; GroupDescription: "Accesos directos:"; Flags: checkedonce

[Files]
Source: "{#MyPublishDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\app.ico"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\app.ico"; Tasks: desktopicon

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
  if RegQueryStringValue(HKCU, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{#MyAppId}_is1', 'DisplayVersion', Result) then
    Exit;
  RegQueryStringValue(HKLM, 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{#MyAppId}_is1', 'DisplayVersion', Result);
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
    WizardForm.StatusLabel.Caption := 'Actualizando a la versión {#MyAppVersion}...';
end;

function UpdateReadyMemo(const Space, NewLine, MemoUserInfoInfo, MemoDirInfo, MemoTypeInfo,
  MemoComponentsInfo, MemoGroupInfo, MemoTasksInfo: String): String;
begin
  Result := MemoDirInfo + NewLine + NewLine;
  if IsUpgrade then
    Result := Result + 'Tipo: Actualización' + NewLine +
              'Versión anterior: ' + PrevVersion + NewLine +
              'Versión nueva: {#MyAppVersion}' + NewLine + NewLine +
              'Se reemplazarán los archivos del programa. Tus perfiles y ajustes se conservan.'
  else
    Result := Result + 'Tipo: Instalación nueva';
end;

