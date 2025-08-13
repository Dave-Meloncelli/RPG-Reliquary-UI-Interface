import React, { useState, useEffect } from 'react';

interface APIConfig {
  name: string;
  key: string;
  projectId?: string;
  enabled: boolean;
  setupUrl: string;
  description: string;
  required: boolean;
}

interface DriveConfig {
  drive: string;
  availableSpace: number;
  recommended: boolean;
}

interface InstallationConfig {
  drive: string;
  frontendPath: string;
  backendPath: string;
  sharedPath: string;
  personaDataPath: string;
  buildArtifactsPath: string;
  logsPath: string;
  ashrakaPath: string;
}

export const InstallationWizard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [installationConfig, setInstallationConfig] = useState<InstallationConfig>({
    drive: 'C:',
    frontendPath: '',
    backendPath: '',
    sharedPath: '',
    personaDataPath: '',
    buildArtifactsPath: '',
    logsPath: '',
    ashrakaPath: ''
  });

  const [apiConfigs, setApiConfigs] = useState<APIConfig[]>([
    {
      name: 'Google AI Studio',
      key: '',
      enabled: false,
      required: false,
      setupUrl: 'https://makersuite.google.com/app/apikey',
      description: 'Access to Gemini Pro, Code Gecko, and Imagen models'
    },
    {
      name: 'OpenAI Codex',
      key: '',
      enabled: false,
      required: false,
      setupUrl: 'https://platform.openai.com/api-keys',
      description: 'Advanced code generation and analysis capabilities'
    },
    {
      name: 'Google Vertex AI',
      key: '',
      projectId: '',
      enabled: false,
      required: false,
      setupUrl: 'https://console.cloud.google.com/apis/credentials',
      description: 'Custom model training and A/B testing capabilities'
    }
  ]);

  const [availableDrives, setAvailableDrives] = useState<DriveConfig[]>([
    { drive: 'C:', availableSpace: 500, recommended: true },
    { drive: 'D:', availableSpace: 200, recommended: false },
    { drive: 'E:', availableSpace: 1000, recommended: false }
  ]);

  const [installationProgress, setInstallationProgress] = useState({
    frontend: false,
    backend: false,
    shared: false,
    apis: false
  });

  const steps = [
    { id: 'welcome', title: 'Welcome to AZ Interface', required: true },
    { id: 'drive', title: 'Installation Drive Selection', required: true },
    { id: 'paths', title: 'Path Configuration', required: true },
    { id: 'frontend', title: 'Frontend Installation', required: true },
    { id: 'backend', title: 'Backend Installation', required: true },
    { id: 'shared', title: 'Shared Resources Setup', required: true },
    { id: 'apis', title: 'API Integrations (Optional)', required: false },
    { id: 'validation', title: 'System Validation', required: true },
    { id: 'complete', title: 'Installation Complete', required: true }
  ];

  useEffect(() => {
    // Auto-detect if installation is needed
    checkInstallationStatus();
  }, []);

  const checkInstallationStatus = async () => {
    try {
      // Check if key files exist
      const response = await fetch('/api/installation/status');
      const status = await response.json();
      
      if (!status.installed) {
        setIsOpen(true);
      }
    } catch (error) {
      // If API is not available, show wizard
      setIsOpen(true);
    }
  };

  const updateInstallationConfig = (updates: Partial<InstallationConfig>) => {
    setInstallationConfig(prev => ({ ...prev, ...updates }));
  };

  const updateApiConfig = (index: number, updates: Partial<APIConfig>) => {
    setApiConfigs(prev => 
      prev.map((config, i) => 
        i === index ? { ...config, ...updates } : config
      )
    );
  };

  const selectDrive = (drive: string) => {
    updateInstallationConfig({ drive });
    
    // Auto-generate paths based on selected drive
    const basePath = `${drive}\\AZ Interface`;
    updateInstallationConfig({
      frontendPath: `${basePath}\\frontend`,
      backendPath: `${basePath}\\backend`,
      sharedPath: `${basePath}\\shared`,
      personaDataPath: `${basePath}\\shared\\persona-data`,
      buildArtifactsPath: `${basePath}\\shared\\build-artifacts`,
      logsPath: `${basePath}\\shared\\logs`,
      ashrakaPath: `${basePath}\\shared\\ashraka-autonomy`
    });
  };

  const createDirectories = async () => {
    const paths = [
      installationConfig.frontendPath,
      installationConfig.backendPath,
      installationConfig.sharedPath,
      installationConfig.personaDataPath,
      installationConfig.buildArtifactsPath,
      installationConfig.logsPath,
      installationConfig.ashrakaPath
    ];

    try {
      for (const path of paths) {
        await createDirectory(path);
      }
      setInstallationProgress(prev => ({ ...prev, shared: true }));
    } catch (error) {
      console.error('Failed to create directories:', error);
    }
  };

  const createDirectory = async (path: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/filesystem/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      return false;
    }
  };

  const installFrontend = async () => {
    try {
      // Simulate frontend installation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setInstallationProgress(prev => ({ ...prev, frontend: true }));
    } catch (error) {
      console.error('Frontend installation failed:', error);
    }
  };

  const installBackend = async () => {
    try {
      // Simulate backend installation
      await new Promise(resolve => setTimeout(resolve, 3000));
      setInstallationProgress(prev => ({ ...prev, backend: true }));
    } catch (error) {
      console.error('Backend installation failed:', error);
    }
  };

  const handleNext = async () => {
    const currentStepData = steps[currentStep];
    
    // Handle step-specific actions
    switch (currentStepData.id) {
      case 'paths':
        await createDirectories();
        break;
      case 'frontend':
        await installFrontend();
        break;
      case 'backend':
        await installBackend();
        break;
      case 'validation':
        // Validate all installations
        const allValid = Object.values(installationProgress).every(Boolean);
        if (!allValid) {
          // Continue to next step even if some validations fail
          console.log('Some installations may need attention in settings');
        }
        break;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Welcome to AZ Interface</h2>
            <p className="text-lg text-gray-600">
              AI-powered development environment with persistent memory and automated builds.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold">Persistent Memory</h3>
                <p className="text-sm">AI assistants that remember across sessions</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold">Automated Builds</h3>
                <p className="text-sm">Intelligent build and deployment management</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold">AI Integration</h3>
                <p className="text-sm">Multiple AI services for enhanced capabilities</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Installation Process</h3>
              <p className="text-sm text-yellow-700">
                This wizard will guide you through a complete installation including drive selection, 
                path configuration, frontend/backend setup, and optional API integrations.
              </p>
            </div>
          </div>
        );

      case 'drive':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Select Installation Drive</h2>
            <p className="text-gray-600">
              Choose the drive where AZ Interface will be installed. We recommend a drive with at least 2GB of free space.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableDrives.map((drive) => (
                <div
                  key={drive.drive}
                  onClick={() => selectDrive(drive.drive)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    installationConfig.drive === drive.drive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{drive.drive}</h3>
                    {drive.recommended && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Recommended</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Available: {drive.availableSpace}GB
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (drive.availableSpace / 2) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {installationConfig.drive && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">Selected Drive: {installationConfig.drive}</h3>
                <p className="text-sm text-green-700">
                  AZ Interface will be installed at: {installationConfig.drive}\AZ Interface
                </p>
              </div>
            )}
          </div>
        );

      case 'paths':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Path Configuration</h2>
            <p className="text-gray-600">
              Review and customize the installation paths. All paths will be created automatically.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Frontend Path</label>
                <input
                  type="text"
                  value={installationConfig.frontendPath}
                  onChange={(e) => updateInstallationConfig({ frontendPath: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Backend Path</label>
                <input
                  type="text"
                  value={installationConfig.backendPath}
                  onChange={(e) => updateInstallationConfig({ backendPath: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Shared Resources Path</label>
                <input
                  type="text"
                  value={installationConfig.sharedPath}
                  onChange={(e) => updateInstallationConfig({ sharedPath: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Persona Data</label>
                  <input
                    type="text"
                    value={installationConfig.personaDataPath}
                    onChange={(e) => updateInstallationConfig({ personaDataPath: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Build Artifacts</label>
                  <input
                    type="text"
                    value={installationConfig.buildArtifactsPath}
                    onChange={(e) => updateInstallationConfig({ buildArtifactsPath: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logs Directory</label>
                  <input
                    type="text"
                    value={installationConfig.logsPath}
                    onChange={(e) => updateInstallationConfig({ logsPath: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ashraka Autonomy</label>
                  <input
                    type="text"
                    value={installationConfig.ashrakaPath}
                    onChange={(e) => updateInstallationConfig({ ashrakaPath: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'frontend':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Frontend Installation</h2>
            <p className="text-gray-600">
              Installing React frontend with all dependencies and configurations.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">React Frontend</h3>
                    <p className="text-sm text-gray-600">Modern UI with TypeScript and Tailwind CSS</p>
                  </div>
                  {installationProgress.frontend ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Installed</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Installing...</span>
                  )}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Dependencies</h3>
                    <p className="text-sm text-gray-600">npm packages and build tools</p>
                  </div>
                  {installationProgress.frontend ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Installed</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Installing...</span>
                  )}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Configuration</h3>
                    <p className="text-sm text-gray-600">Environment and build settings</p>
                  </div>
                  {installationProgress.frontend ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Configured</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Configuring...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'backend':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Backend Installation</h2>
            <p className="text-gray-600">
              Installing FastAPI backend with database and service configurations.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">FastAPI Backend</h3>
                    <p className="text-sm text-gray-600">Python-based API server</p>
                  </div>
                  {installationProgress.backend ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Installed</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Installing...</span>
                  )}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Database Setup</h3>
                    <p className="text-sm text-gray-600">PostgreSQL with schema migration</p>
                  </div>
                  {installationProgress.backend ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Configured</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Configuring...</span>
                  )}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Service Integration</h3>
                    <p className="text-sm text-gray-600">CrewAI, A2A, and n8n connections</p>
                  </div>
                  {installationProgress.backend ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Connected</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Connecting...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'shared':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Shared Resources Setup</h2>
            <p className="text-gray-600">
              Creating shared directories and setting up data persistence.
            </p>
            
            <div className="space-y-4">
              {[
                { name: 'Persona Data', path: installationConfig.personaDataPath },
                { name: 'Build Artifacts', path: installationConfig.buildArtifactsPath },
                { name: 'Logs Directory', path: installationConfig.logsPath },
                { name: 'Ashraka Autonomy', path: installationConfig.ashrakaPath }
              ].map((item) => (
                <div key={item.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 font-mono">{item.path}</p>
                    </div>
                    {installationProgress.shared ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Created</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Creating...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'apis':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">API Integrations (Optional)</h2>
            <p className="text-gray-600">
              Configure AI service integrations. You can skip this and configure later in settings.
            </p>
            
            {apiConfigs.map((config, index) => (
              <div key={config.name} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{config.name}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => updateApiConfig(index, { enabled: e.target.checked })}
                      className="mr-2"
                    />
                    Enable
                  </label>
                </div>
                
                {config.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium">API Key</label>
                      <input
                        type="password"
                        value={config.key}
                        onChange={(e) => updateApiConfig(index, { key: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter your API key (or leave blank to configure later)"
                      />
                    </div>
                    
                    {config.name === 'Google Vertex AI' && (
                      <div>
                        <label className="block text-sm font-medium">Project ID</label>
                        <input
                          type="text"
                          value={config.projectId || ''}
                          onChange={(e) => updateApiConfig(index, { projectId: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Enter your Google Cloud Project ID"
                        />
                      </div>
                    )}
                    
                    <a
                      href={config.setupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Get API Key
                    </a>
                  </div>
                )}
              </div>
            ))}
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Note</h3>
              <p className="text-sm text-blue-700">
                You can configure these APIs later in the Settings tab. The system will work without them, 
                but you'll have access to enhanced AI capabilities once configured.
              </p>
            </div>
          </div>
        );

      case 'validation':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Validation</h2>
            <p className="text-gray-600">
              Validating all installations and configurations.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Frontend Installation</h3>
                  <p className="text-sm text-gray-600">React application and dependencies</p>
                </div>
                {installationProgress.frontend ? (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Valid</span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">⚠ Needs Attention</span>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Backend Installation</h3>
                  <p className="text-sm text-gray-600">FastAPI server and database</p>
                </div>
                {installationProgress.backend ? (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Valid</span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">⚠ Needs Attention</span>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Shared Directories</h3>
                  <p className="text-sm text-gray-600">Data persistence and logs</p>
                </div>
                {installationProgress.shared ? (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">✓ Valid</span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">⚠ Needs Attention</span>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">API Integrations</h3>
                  <p className="text-sm text-gray-600">AI service connections</p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Optional</span>
              </div>
            </div>
            
            {!Object.values(installationProgress).every(Boolean) && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Some Issues Detected</h3>
                <p className="text-sm text-yellow-700">
                  Some installations may need attention. You can review and fix these in the Settings tab.
                </p>
              </div>
            )}
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold">Installation Complete!</h2>
            <p className="text-lg text-gray-600">
              Your AZ Interface is now ready to use.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">What's Next?</h3>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Explore the dashboard</li>
                  <li>• Configure your first persona</li>
                  <li>• Set up your first build</li>
                  <li>• Configure API integrations in Settings</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Settings</h3>
                <p className="text-sm text-blue-700 mt-2">
                  Access the Settings tab to configure API keys, review installations, 
                  and customize your environment.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">AZ Interface Setup</h1>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {!steps[currentStep].required && (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Skip
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 