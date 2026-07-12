; Madsjeez Seller Browser — Instalador profesional (Inno Setup 6)
; Compilar: ISCC.exe MadsjeezSellerBrowser.iss
; Requiere publish en ..\publish\win-x64 (ver build-installer.ps1)

#define MyAppName "Madsjeez Seller Browser"
#define MyAppVersion "0.1.0"
#define MyAppPublisher "Madsjeez"
#define MyAppURL "https://admin-panel-production-b4e5.up.railway.app"
#define MyAppExeName "MadsjeezSellerBrowser.exe"
#define MyPublishDir "..\publish\win-x64"

[Setup]
AppId={{8F4E2B1A-9C3D-4E5F-A6B7-1C2D3E4F5A6B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
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
CloseApplications=yes
RestartApplications=no
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
