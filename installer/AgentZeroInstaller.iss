[Setup]
AppName=Agent Zero Interface
AppVersion=1.0.0
AppPublisher=Agent Zero Team
AppPublisherURL=https://github.com/Dave-Meloncelli/RPG-Reliquary-UI-Interface
AppSupportURL=https://github.com/Dave-Meloncelli/RPG-Reliquary-UI-Interface/issues
AppUpdatesURL=https://github.com/Dave-Meloncelli/RPG-Reliquary-UI-Interface/releases
DefaultDirName={autopf}\AgentZero
DefaultGroupName=Agent Zero
AllowNoIcons=yes
LicenseFile=LICENSE
OutputDir=output
OutputBaseFilename=AgentZeroSetup
SetupIconFile=assets\icon.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode

[Files]
; Main application files
Source: "dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "docker-compose.yml"; DestDir: "{app}"; Flags: ignoreversion
Source: "env.example"; DestDir: "{app}"; Flags: ignoreversion
Source: "README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "SETUP.md"; DestDir: "{app}"; Flags: ignoreversion

; Docker files
Source: "backend\*"; DestDir: "{app}\backend"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "crewai\*"; DestDir: "{app}\crewai"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "a2a\*"; DestDir: "{app}\a2a"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "monitoring\*"; DestDir: "{app}\monitoring"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "scripts\*"; DestDir: "{app}\scripts"; Flags: ignoreversion recursesubdirs createallsubdirs

; Shared data directories
Source: "data\*"; DestDir: "{commonappdata}\AgentZero\data"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "Personas\*"; DestDir: "{commonappdata}\AgentZero\personas"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "schemas\*"; DestDir: "{commonappdata}\AgentZero\schemas"; Flags: ignoreversion recursesubdirs createallsubdirs

; Documentation
Source: "docs\*"; DestDir: "{app}\docs"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Agent Zero Interface"; Filename: "{app}\AgentZero.exe"
Name: "{group}\Agent Zero Dashboard"; Filename: "http://localhost:3000"
Name: "{group}\CrewAI Dashboard"; Filename: "http://localhost:8500"
Name: "{group}\n8n Workflows"; Filename: "http://localhost:5678"
Name: "{group}\Grafana Monitoring"; Filename: "http://localhost:3001"
Name: "{group}\Portainer"; Filename: "http://localhost:9000"
Name: "{group}\{cm:UninstallProgram,Agent Zero Interface}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\Agent Zero Interface"; Filename: "{app}\AgentZero.exe"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\Agent Zero Interface"; Filename: "{app}\AgentZero.exe"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\AgentZero.exe"; Description: "{cm:LaunchProgram,Agent Zero Interface}"; Flags: nowait postinstall skipifsilent

[Code]
var
  ApiKeysPage: TInputQueryWizardPage;
  SecurityPage: TInputQueryWizardPage;
  StoragePage: TInputQueryWizardPage;
  DockerPage: TInputQueryWizardPage;

procedure InitializeWizard;
begin
  // API Keys Configuration Page
  ApiKeysPage := CreateInputQueryPage(wpWelcome,
    'API Keys Configuration', 'Configure your AI service API keys',
    'Please enter your API keys for the AI services. You can leave blank if not using a service.');

  ApiKeysPage.Add('OpenAI API Key:', False);
  ApiKeysPage.Add('Google Gemini API Key:', False);
  ApiKeysPage.Add('Anthropic API Key:', False);
  ApiKeysPage.Add('Chutes.ai API Key:', False);

  // Security Configuration Page
  SecurityPage := CreateInputQueryPage(ApiKeysPage.ID,
    'Security Configuration', 'Configure security settings',
    'Set up security credentials and settings for the platform.');

  SecurityPage.Add('JWT Secret Key (32+ characters):', False);
  SecurityPage.Add('PostgreSQL Password:', True);
  SecurityPage.Add('Redis Password:', True);
  SecurityPage.Add('Grafana Admin Password:', True);
  SecurityPage.Add('n8n Password:', True);

  // Storage Configuration Page
  StoragePage := CreateInputQueryPage(SecurityPage.ID,
    'Storage Configuration', 'Configure storage locations',
    'Set up local storage paths for the platform data.');

  StoragePage.Add('Data Directory:', False);
  StoragePage.Add('Models Directory:', False);
  StoragePage.Add('Logs Directory:', False);
  StoragePage.Add('Backup Directory:', False);

  // Docker Configuration Page
  DockerPage := CreateInputQueryPage(StoragePage.ID,
    'Docker Configuration', 'Configure Docker settings',
    'Set up Docker configuration for the platform.');

  DockerPage.Add('Docker Compose Version:', False);
  DockerPage.Add('Container Memory Limit (GB):', False);
  DockerPage.Add('Container CPU Limit (cores):', False);
  DockerPage.Add('Enable GPU Support:', False);
end;

function NextButtonClick(CurPageID: Integer): Boolean;
var
  I: Integer;
  JWTSecret: string;
  DataDir: string;
begin
  Result := True;

  if CurPageID = ApiKeysPage.ID then
  begin
    // Validate API keys (optional - can be empty)
    for I := 0 to ApiKeysPage.Values.Count - 1 do
    begin
      if ApiKeysPage.Values[I] <> '' then
      begin
        // Basic validation for API key format
        if Length(ApiKeysPage.Values[I]) < 10 then
        begin
          MsgBox('API key ' + ApiKeysPage.Prompt[I] + ' appears to be too short. Please check and try again.', mbError, MB_OK);
          Result := False;
          Exit;
        end;
      end;
    end;
  end;

  if CurPageID = SecurityPage.ID then
  begin
    // Validate security settings
    JWTSecret := SecurityPage.Values[0];
    if Length(JWTSecret) < 32 then
    begin
      MsgBox('JWT Secret Key must be at least 32 characters long for security.', mbError, MB_OK);
      Result := False;
      Exit;
    end;

    if SecurityPage.Values[1] = '' then
    begin
      MsgBox('PostgreSQL password is required.', mbError, MB_OK);
      Result := False;
      Exit;
    end;

    if SecurityPage.Values[2] = '' then
    begin
      MsgBox('Redis password is required.', mbError, MB_OK);
      Result := False;
      Exit;
    end;
  end;

  if CurPageID = StoragePage.ID then
  begin
    // Validate storage paths
    DataDir := StoragePage.Values[0];
    if DataDir = '' then
      DataDir := ExpandConstant('{commonappdata}\AgentZero\data');

    if not DirExists(ExtractFilePath(DataDir)) then
    begin
      if MsgBox('Data directory does not exist. Create it?', mbConfirmation, MB_YESNO) = IDYES then
      begin
        if not CreateDir(DataDir) then
        begin
          MsgBox('Failed to create data directory. Please choose a different location.', mbError, MB_OK);
          Result := False;
          Exit;
        end;
      end
      else
      begin
        Result := False;
        Exit;
      end;
    end;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  EnvFile: string;
  I: Integer;
begin
  if CurStep = ssPostInstall then
  begin
    // Create .env file with user configuration
    EnvFile := ExpandConstant('{app}\.env');
    
    with TStringList.Create do
    try
      Add('# Agent Zero Environment Configuration');
      Add('# Generated by installer on ' + GetDateTimeString('yyyy-mm-dd hh:nn:ss', '-', ':'));
      Add('');
      Add('# ===== APPLICATION CONFIGURATION =====');
      Add('NODE_ENV=production');
      Add('FRONTEND_URL=http://localhost:3000');
      Add('BACKEND_URL=http://localhost:8000');
      Add('');
      Add('# ===== DATABASE CONFIGURATION =====');
      Add('POSTGRES_DB=az_interface');
      Add('POSTGRES_USER=az_user');
      Add('POSTGRES_PASSWORD=' + SecurityPage.Values[1]);
      Add('DATABASE_URL=postgresql://az_user:' + SecurityPage.Values[1] + '@postgres:5432/az_interface');
      Add('');
      Add('# ===== REDIS CONFIGURATION =====');
      Add('REDIS_PASSWORD=' + SecurityPage.Values[2]);
      Add('REDIS_URL=redis://:' + SecurityPage.Values[2] + '@redis:6379');
      Add('');
      Add('# ===== SECURITY =====');
      Add('SECRET_KEY=' + SecurityPage.Values[0]);
      Add('');
      Add('# ===== API KEYS =====');
      Add('OPENAI_API_KEY=' + ApiKeysPage.Values[0]);
      Add('GEMINI_API_KEY=' + ApiKeysPage.Values[1]);
      Add('ANTHROPIC_API_KEY=' + ApiKeysPage.Values[2]);
      Add('CHUTES_API_KEY=' + ApiKeysPage.Values[3]);
      Add('');
      Add('# ===== MONITORING =====');
      Add('GRAFANA_PASSWORD=' + SecurityPage.Values[3]);
      Add('PROMETHEUS_RETENTION_TIME=200h');
      Add('');
      Add('# ===== WORKFLOW AUTOMATION =====');
      Add('N8N_USER=admin');
      Add('N8N_PASSWORD=' + SecurityPage.Values[4]);
      Add('');
      Add('# ===== STORAGE PATHS =====');
      Add('DATA_DIR=' + StoragePage.Values[0]);
      Add('MODELS_DIR=' + StoragePage.Values[1]);
      Add('LOGS_DIR=' + StoragePage.Values[2]);
      Add('BACKUP_DIR=' + StoragePage.Values[3]);
      Add('');
      Add('# ===== DOCKER CONFIGURATION =====');
      Add('DOCKER_COMPOSE_VERSION=' + DockerPage.Values[0]);
      Add('CONTAINER_MEMORY_LIMIT=' + DockerPage.Values[1]);
      Add('CONTAINER_CPU_LIMIT=' + DockerPage.Values[2]);
      Add('ENABLE_GPU=' + DockerPage.Values[3]);
      Add('');
      Add('# ===== DEVELOPMENT SETTINGS =====');
      Add('DEBUG=false');
      Add('LOG_LEVEL=INFO');
      Add('CORS_ORIGINS=http://localhost:3000,http://localhost:5173');
      Add('');
      Add('# ===== PERFORMANCE SETTINGS =====');
      Add('RATE_LIMIT_PER_MINUTE=100');
      Add('MAX_CONCURRENT_TASKS=5');
      Add('WORKER_ID=worker-1');
      Add('');
      Add('# ===== AI & ML SERVICES =====');
      Add('OLLAMA_HOST=http://ollama:11434');
      Add('OLLAMA_MODEL=llama3');
      Add('MILVUS_HOST=milvus');
      Add('MILVUS_PORT=19530');
      Add('');
      Add('# ===== EMAIL & NOTIFICATIONS =====');
      Add('SMTP_HOST=smtp.gmail.com');
      Add('SMTP_PORT=587');
      Add('SMTP_USER=your_email@gmail.com');
      Add('SMTP_PASSWORD=your_app_password_here');
      Add('SMTP_FROM=noreply@yourdomain.com');
      Add('MAILHOG_SMTP_PORT=1025');
      Add('MAILHOG_WEB_PORT=8025');
      Add('');
      Add('# ===== BACKUP & RECOVERY =====');
      Add('BACKUP_SCHEDULE=0 2 * * *');
      Add('RETENTION_DAYS=30');
      Add('BACKUP_S3_BUCKET=your-backup-bucket-name');
      Add('AWS_ACCESS_KEY_ID=your_aws_access_key_id');
      Add('AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key');
      Add('AWS_DEFAULT_REGION=us-east-1');
      
      SaveToFile(EnvFile);
    finally
      Free;
    end;

    // Create startup script
    with TStringList.Create do
    try
      Add('@echo off');
      Add('echo Starting Agent Zero Interface...');
      Add('cd /d "' + ExpandConstant('{app}') + '"');
      Add('echo Checking Docker installation...');
      Add('docker --version >nul 2>&1');
      Add('if errorlevel 1 (');
      Add('    echo Docker is not installed or not running.');
      Add('    echo Please install Docker Desktop and try again.');
      Add('    pause');
      Add('    exit /b 1');
      Add(')');
      Add('echo Starting services with Docker Compose...');
      Add('docker-compose up -d');
      Add('if errorlevel 1 (');
      Add('    echo Failed to start services.');
      Add('    echo Check the logs with: docker-compose logs');
      Add('    pause');
      Add('    exit /b 1');
      Add(')');
      Add('echo Services started successfully!');
      Add('echo.');
      Add('echo Access URLs:');
      Add('echo - Agent Zero UI: http://localhost:3000');
      Add('echo - CrewAI Dashboard: http://localhost:8500');
      Add('echo - n8n Workflows: http://localhost:5678');
      Add('echo - Grafana Monitoring: http://localhost:3001');
      Add('echo - Portainer: http://localhost:9000');
      Add('echo.');
      Add('echo Press any key to open the main interface...');
      Add('pause >nul');
      Add('start http://localhost:3000');
      
      SaveToFile(ExpandConstant('{app}\start-agent-zero.bat'));
    finally
      Free;
    end;

    // Create stop script
    with TStringList.Create do
    try
      Add('@echo off');
      Add('echo Stopping Agent Zero Interface...');
      Add('cd /d "' + ExpandConstant('{app}') + '"');
      Add('docker-compose down');
      Add('echo Services stopped.');
      Add('pause');
      
      SaveToFile(ExpandConstant('{app}\stop-agent-zero.bat'));
    finally
      Free;
    end;

    // Create uninstall script
    with TStringList.Create do
    try
      Add('@echo off');
      Add('echo Uninstalling Agent Zero Interface...');
      Add('cd /d "' + ExpandConstant('{app}') + '"');
      Add('docker-compose down -v');
      Add('echo Removing data directories...');
      Add('rmdir /s /q "' + ExpandConstant('{commonappdata}\AgentZero') + '"');
      Add('echo Uninstall complete.');
      Add('pause');
      
      SaveToFile(ExpandConstant('{app}\uninstall-agent-zero.bat'));
    finally
      Free;
    end;
  end;
end;

[Registry]
; Register file associations
Root: HKCR; Subkey: ".azconfig"; ValueType: string; ValueName: ""; ValueData: "AgentZeroConfig"; Flags: uninsdeletekey
Root: HKCR; Subkey: "AgentZeroConfig"; ValueType: string; ValueName: ""; ValueData: "Agent Zero Configuration File"; Flags: uninsdeletekey
Root: HKCR; Subkey: "AgentZeroConfig\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\AgentZero.exe,0"; Flags: uninsdeletekey
Root: HKCR; Subkey: "AgentZeroConfig\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\AgentZero.exe"" ""%1"""; Flags: uninsdeletekey

; Register application in Windows
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: string; ValueName: "DisplayName"; ValueData: "Agent Zero Interface"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: string; ValueName: "UninstallString"; ValueData: "{uninstallexe}"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: string; ValueName: "DisplayIcon"; ValueData: "{app}\AgentZero.exe"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: string; ValueName: "Publisher"; ValueData: "Agent Zero Team"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: string; ValueName: "URLInfoAbout"; ValueData: "https://github.com/Dave-Meloncelli/RPG-Reliquary-UI-Interface"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: string; ValueName: "URLUpdateInfo"; ValueData: "https://github.com/Dave-Meloncelli/RPG-Reliquary-UI-Interface/releases"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: string; ValueName: "HelpLink"; ValueData: "https://github.com/Dave-Meloncelli/RPG-Reliquary-UI-Interface/issues"; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: dword; ValueName: "NoModify"; ValueData: 1; Flags: uninsdeletekey
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\AgentZero"; ValueType: dword; ValueName: "NoRepair"; ValueData: 1; Flags: uninsdeletekey

[UninstallDelete]
Type: filesandordirs; Name: "{commonappdata}\AgentZero"
Type: files; Name: "{app}\*.log"
Type: files; Name: "{app}\*.tmp" 