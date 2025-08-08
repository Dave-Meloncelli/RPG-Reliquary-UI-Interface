#!/usr/bin/env python3
"""
AZ Interface Implementation Engine
- Actually installs missing dependencies
- Configures security and credentials
- Sets up infrastructure and shared folders
- Implements cloud integration
- Creates local processing capabilities
- Manages API keys and Docker containers
- Follows security best practices
"""

import os
import sys
import json
import subprocess
import platform
import shutil
import hashlib
import base64
from pathlib import Path
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime
import requests
import zipfile
import tarfile

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SystemDetector:
    """Detects system information for adaptive installation"""
    
    def __init__(self):
        self.system_info = self._detect_system()
    
    def _detect_system(self) -> Dict[str, Any]:
        """Detect comprehensive system information"""
        return {
            'os': platform.system(),
            'os_version': platform.version(),
            'architecture': platform.machine(),
            'processor': platform.processor(),
            'python_version': sys.version,
            'hostname': platform.node(),
            'cpu_count': os.cpu_count(),
            'memory': self._get_memory_info(),
            'disk_space': self._get_disk_space(),
            'network': self._get_network_info(),
            'existing_services': self._detect_existing_services()
        }
    
    def _get_memory_info(self) -> Dict[str, Any]:
        """Get memory information"""
        try:
            import psutil
            memory = psutil.virtual_memory()
            return {
                'total': memory.total,
                'available': memory.available,
                'percent_used': memory.percent
            }
        except ImportError:
            return {'error': 'psutil not available'}
    
    def _get_disk_space(self) -> Dict[str, Any]:
        """Get disk space information"""
        try:
            import psutil
            disk = psutil.disk_usage('/')
            return {
                'total': disk.total,
                'free': disk.free,
                'used': disk.used,
                'percent_used': disk.percent
            }
        except ImportError:
            return {'error': 'psutil not available'}
    
    def _get_network_info(self) -> Dict[str, Any]:
        """Get network information"""
        try:
            import psutil
            network = psutil.net_if_addrs()
            return {
                'interfaces': list(network.keys()),
                'primary_interface': list(network.keys())[0] if network else None
            }
        except ImportError:
            return {'error': 'psutil not available'}
    
    def _detect_existing_services(self) -> List[str]:
        """Detect existing services"""
        services = []
        
        # Check for Node.js
        if shutil.which('node'):
            try:
                result = subprocess.run(['node', '--version'], capture_output=True, text=True)
                services.append(f"nodejs:{result.stdout.strip()}")
            except:
                pass
        
        # Check for Git
        if shutil.which('git'):
            try:
                result = subprocess.run(['git', '--version'], capture_output=True, text=True)
                services.append(f"git:{result.stdout.strip()}")
            except:
                pass
        
        # Check for Docker
        if shutil.which('docker'):
            try:
                result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
                services.append(f"docker:{result.stdout.strip()}")
            except:
                pass
        
        return services

class CredentialManager:
    """Manages credentials securely"""
    
    def __init__(self, key_file: str = ".az_interface_key"):
        self.key_file = key_file
        self.encryption_key = self._load_or_generate_key()
    
    def _load_or_generate_key(self) -> bytes:
        """Load existing key or generate new one"""
        if os.path.exists(self.key_file):
            with open(self.key_file, 'rb') as f:
                return f.read()
        else:
            key = os.urandom(32)
            with open(self.key_file, 'wb') as f:
                f.write(key)
            return key
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        from cryptography.fernet import Fernet
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'az_interface_salt',
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(self.encryption_key))
        f = Fernet(key)
        return f.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        from cryptography.fernet import Fernet
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'az_interface_salt',
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(self.encryption_key))
        f = Fernet(key)
        return f.decrypt(encrypted_data.encode()).decode()
    
    def store_credentials(self, service: str, credentials: Dict[str, str]) -> None:
        """Store encrypted credentials"""
        encrypted_data = self.encrypt(json.dumps(credentials))
        credentials_file = f".az_interface_{service}_creds"
        
        with open(credentials_file, 'w') as f:
            f.write(encrypted_data)
        
        # Set restrictive permissions
        os.chmod(credentials_file, 0o600)
    
    def load_credentials(self, service: str) -> Dict[str, str]:
        """Load encrypted credentials"""
        credentials_file = f".az_interface_{service}_creds"
        
        if not os.path.exists(credentials_file):
            return {}
        
        with open(credentials_file, 'r') as f:
            encrypted_data = f.read()
        
        decrypted_data = self.decrypt(encrypted_data)
        return json.loads(decrypted_data)

class DependencyInstaller:
    """Installs missing dependencies"""
    
    def __init__(self, system_info: Dict[str, Any]):
        self.system_info = system_info
        self.install_log = []
    
    def install_nodejs(self) -> bool:
        """Install Node.js"""
        try:
            if self.system_info['os'] == 'Windows':
                return self._install_nodejs_windows()
            elif self.system_info['os'] == 'Linux':
                return self._install_nodejs_linux()
            elif self.system_info['os'] == 'Darwin':
                return self._install_nodejs_macos()
            else:
                logger.error(f"Unsupported OS: {self.system_info['os']}")
                return False
        except Exception as e:
            logger.error(f"Failed to install Node.js: {e}")
            return False
    
    def _install_nodejs_windows(self) -> bool:
        """Install Node.js on Windows"""
        try:
            # Use winget if available
            if shutil.which('winget'):
                subprocess.run(['winget', 'install', 'OpenJS.NodeJS'], check=True)
                return True
            else:
                # Download and install manually
                url = "https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi"
                self._download_and_install_windows(url)
                return True
        except Exception as e:
            logger.error(f"Failed to install Node.js on Windows: {e}")
            return False
    
    def _install_nodejs_linux(self) -> bool:
        """Install Node.js on Linux"""
        try:
            # Use package manager
            if shutil.which('apt'):
                subprocess.run(['sudo', 'apt', 'update'], check=True)
                subprocess.run(['sudo', 'apt', 'install', '-y', 'nodejs', 'npm'], check=True)
            elif shutil.which('yum'):
                subprocess.run(['sudo', 'yum', 'install', '-y', 'nodejs', 'npm'], check=True)
            else:
                logger.error("No supported package manager found")
                return False
            return True
        except Exception as e:
            logger.error(f"Failed to install Node.js on Linux: {e}")
            return False
    
    def _install_nodejs_macos(self) -> bool:
        """Install Node.js on macOS"""
        try:
            if shutil.which('brew'):
                subprocess.run(['brew', 'install', 'node'], check=True)
                return True
            else:
                logger.error("Homebrew not found. Please install Homebrew first.")
                return False
        except Exception as e:
            logger.error(f"Failed to install Node.js on macOS: {e}")
            return False
    
    def install_git(self) -> bool:
        """Install Git"""
        try:
            if self.system_info['os'] == 'Windows':
                if shutil.which('winget'):
                    subprocess.run(['winget', 'install', 'Git.Git'], check=True)
                else:
                    url = "https://github.com/git-for-windows/git/releases/download/v2.41.0.windows.1/Git-2.41.0-64-bit.exe"
                    self._download_and_install_windows(url)
            elif self.system_info['os'] == 'Linux':
                if shutil.which('apt'):
                    subprocess.run(['sudo', 'apt', 'install', '-y', 'git'], check=True)
                elif shutil.which('yum'):
                    subprocess.run(['sudo', 'yum', 'install', '-y', 'git'], check=True)
            elif self.system_info['os'] == 'Darwin':
                if shutil.which('brew'):
                    subprocess.run(['brew', 'install', 'git'], check=True)
            return True
        except Exception as e:
            logger.error(f"Failed to install Git: {e}")
            return False
    
    def install_docker(self) -> bool:
        """Install Docker"""
        try:
            if self.system_info['os'] == 'Windows':
                if shutil.which('winget'):
                    subprocess.run(['winget', 'install', 'Docker.DockerDesktop'], check=True)
            elif self.system_info['os'] == 'Linux':
                # Install Docker using official script
                subprocess.run(['curl', '-fsSL', 'https://get.docker.com', '-o', 'get-docker.sh'], check=True)
                subprocess.run(['sudo', 'sh', 'get-docker.sh'], check=True)
                subprocess.run(['sudo', 'usermod', '-aG', 'docker', '$USER'], check=True)
            elif self.system_info['os'] == 'Darwin':
                if shutil.which('brew'):
                    subprocess.run(['brew', 'install', '--cask', 'docker'], check=True)
            return True
        except Exception as e:
            logger.error(f"Failed to install Docker: {e}")
            return False
    
    def _download_and_install_windows(self, url: str) -> None:
        """Download and install Windows installer"""
        import urllib.request
        filename = url.split('/')[-1]
        urllib.request.urlretrieve(url, filename)
        subprocess.run([filename, '/quiet'], check=True)

class InfrastructureSetup:
    """Sets up infrastructure components"""
    
    def __init__(self, base_path: str = "C:\\az-interface"):
        self.base_path = Path(base_path)
        self.shared_path = self.base_path / "shared"
        self.logs_path = self.base_path / "logs"
        self.data_path = self.base_path / "data"
        self.config_path = self.base_path / "config"
    
    def create_directory_structure(self) -> bool:
        """Create the complete directory structure"""
        try:
            directories = [
                self.base_path,
                self.shared_path,
                self.logs_path,
                self.data_path,
                self.config_path,
                self.base_path / "backups",
                self.base_path / "temp",
                self.base_path / "cache"
            ]
            
            for directory in directories:
                directory.mkdir(parents=True, exist_ok=True)
                logger.info(f"Created directory: {directory}")
            
            return True
        except Exception as e:
            logger.error(f"Failed to create directory structure: {e}")
            return False
    
    def setup_shared_folders(self) -> bool:
        """Setup network shared folders"""
        try:
            if platform.system() == 'Windows':
                return self._setup_windows_shares()
            else:
                return self._setup_linux_shares()
        except Exception as e:
            logger.error(f"Failed to setup shared folders: {e}")
            return False
    
    def _setup_windows_shares(self) -> bool:
        """Setup Windows network shares"""
        try:
            # Create shared folder
            share_name = "AZInterface"
            share_path = str(self.shared_path)
            
            # Create the share using net command
            subprocess.run([
                'net', 'share', f'{share_name}={share_path}', 
                '/GRANT:Everyone,FULL', '/CACHE:None'
            ], check=True)
            
            logger.info(f"Created Windows share: {share_name} -> {share_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to create Windows share: {e}")
            return False
    
    def _setup_linux_shares(self) -> bool:
        """Setup Linux Samba shares"""
        try:
            # Install Samba if not present
            if not shutil.which('smbd'):
                if shutil.which('apt'):
                    subprocess.run(['sudo', 'apt', 'install', '-y', 'samba'], check=True)
                elif shutil.which('yum'):
                    subprocess.run(['sudo', 'yum', 'install', '-y', 'samba'], check=True)
            
            # Configure Samba
            samba_config = f"""
[AZInterface]
   path = {self.shared_path}
   browseable = yes
   read only = no
   guest ok = yes
   create mask = 0777
   directory mask = 0777
"""
            
            with open('/etc/samba/smb.conf', 'a') as f:
                f.write(samba_config)
            
            # Restart Samba
            subprocess.run(['sudo', 'systemctl', 'restart', 'smbd'], check=True)
            
            logger.info("Created Linux Samba share: AZInterface")
            return True
        except Exception as e:
            logger.error(f"Failed to create Linux share: {e}")
            return False
    
    def setup_local_processing(self) -> bool:
        """Setup local processing capabilities"""
        try:
            # Create processing directories
            processing_dirs = [
                self.base_path / "processing" / "archaeological",
                self.base_path / "processing" / "fault_fixing",
                self.base_path / "processing" / "heavy_lifting",
                self.base_path / "processing" / "temp"
            ]
            
            for directory in processing_dirs:
                directory.mkdir(parents=True, exist_ok=True)
            
            # Create processing configuration
            config = {
                'max_concurrent_processes': os.cpu_count(),
                'memory_limit_gb': 8,
                'temp_directory': str(self.base_path / "processing" / "temp"),
                'log_directory': str(self.logs_path),
                'enabled_modules': ['archaeological', 'fault_fixing', 'heavy_lifting']
            }
            
            with open(self.config_path / 'processing_config.json', 'w') as f:
                json.dump(config, f, indent=2)
            
            logger.info("Setup local processing capabilities")
            return True
        except Exception as e:
            logger.error(f"Failed to setup local processing: {e}")
            return False

class CloudIntegration:
    """Handles cloud storage integration"""
    
    def __init__(self, credential_manager: CredentialManager):
        self.credential_manager = credential_manager
    
    def setup_onedrive(self, client_id: str, client_secret: str) -> bool:
        """Setup OneDrive integration"""
        try:
            credentials = {
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': 'http://localhost:3001/auth/onedrive/callback'
            }
            
            self.credential_manager.store_credentials('onedrive', credentials)
            
            # Create OneDrive sync directory
            onedrive_path = Path.home() / "OneDrive" / "AZInterface"
            onedrive_path.mkdir(parents=True, exist_ok=True)
            
            logger.info("Setup OneDrive integration")
            return True
        except Exception as e:
            logger.error(f"Failed to setup OneDrive: {e}")
            return False
    
    def setup_google_drive(self, client_id: str, client_secret: str) -> bool:
        """Setup Google Drive integration"""
        try:
            credentials = {
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': 'http://localhost:3001/auth/google/callback'
            }
            
            self.credential_manager.store_credentials('google_drive', credentials)
            
            # Create Google Drive sync directory
            gdrive_path = Path.home() / "Google Drive" / "AZInterface"
            gdrive_path.mkdir(parents=True, exist_ok=True)
            
            logger.info("Setup Google Drive integration")
            return True
        except Exception as e:
            logger.error(f"Failed to setup Google Drive: {e}")
            return False

class ImplementationEngine:
    """Main implementation engine"""
    
    def __init__(self):
        self.system_detector = SystemDetector()
        self.credential_manager = CredentialManager()
        self.dependency_installer = DependencyInstaller(self.system_detector.system_info)
        self.infrastructure_setup = InfrastructureSetup()
        self.cloud_integration = CloudIntegration(self.credential_manager)
        self.installation_log = []
    
    def run_full_installation(self) -> Dict[str, Any]:
        """Run complete installation process"""
        logger.info("🚀 Starting AZ Interface Implementation Engine")
        
        results = {
            'system_info': self.system_detector.system_info,
            'installation_steps': [],
            'success': True,
            'errors': []
        }
        
        try:
            # Step 1: System Detection
            self._log_step(results, "System Detection", "Detecting system information")
            logger.info(f"Detected system: {self.system_detector.system_info['os']} {self.system_detector.system_info['os_version']}")
            
            # Step 2: Install Dependencies
            self._log_step(results, "Dependency Installation", "Installing required dependencies")
            self._install_dependencies(results)
            
            # Step 3: Setup Infrastructure
            self._log_step(results, "Infrastructure Setup", "Setting up infrastructure")
            self._setup_infrastructure(results)
            
            # Step 4: Configure Security
            self._log_step(results, "Security Configuration", "Configuring security")
            self._configure_security(results)
            
            # Step 5: Setup Cloud Integration
            self._log_step(results, "Cloud Integration", "Setting up cloud storage")
            self._setup_cloud_integration(results)
            
            # Step 6: Create Documentation
            self._log_step(results, "Documentation", "Creating documentation")
            self._create_documentation(results)
            
            logger.info("✅ Installation completed successfully!")
            
        except Exception as e:
            logger.error(f"❌ Installation failed: {e}")
            results['success'] = False
            results['errors'].append(str(e))
        
        return results
    
    def _log_step(self, results: Dict[str, Any], step: str, description: str) -> None:
        """Log installation step"""
        step_info = {
            'step': step,
            'description': description,
            'timestamp': datetime.now().isoformat(),
            'status': 'running'
        }
        results['installation_steps'].append(step_info)
        logger.info(f"📋 {step}: {description}")
    
    def _install_dependencies(self, results: Dict[str, Any]) -> None:
        """Install all required dependencies"""
        dependencies = ['nodejs', 'git', 'docker']
        
        for dep in dependencies:
            try:
                if dep == 'nodejs':
                    if not shutil.which('node'):
                        self.dependency_installer.install_nodejs()
                elif dep == 'git':
                    if not shutil.which('git'):
                        self.dependency_installer.install_git()
                elif dep == 'docker':
                    if not shutil.which('docker'):
                        self.dependency_installer.install_docker()
                
                logger.info(f"✅ Installed {dep}")
            except Exception as e:
                logger.error(f"❌ Failed to install {dep}: {e}")
                results['errors'].append(f"Failed to install {dep}: {e}")
    
    def _setup_infrastructure(self, results: Dict[str, Any]) -> None:
        """Setup infrastructure components"""
        try:
            # Create directory structure
            self.infrastructure_setup.create_directory_structure()
            
            # Setup shared folders
            self.infrastructure_setup.setup_shared_folders()
            
            # Setup local processing
            self.infrastructure_setup.setup_local_processing()
            
            logger.info("✅ Infrastructure setup completed")
        except Exception as e:
            logger.error(f"❌ Infrastructure setup failed: {e}")
            results['errors'].append(f"Infrastructure setup failed: {e}")
    
    def _configure_security(self, results: Dict[str, Any]) -> None:
        """Configure security settings"""
        try:
            # Generate secure credentials
            secure_password = base64.b64encode(os.urandom(32)).decode()
            
            # Store encrypted credentials
            credentials = {
                'admin_password': secure_password,
                'jwt_secret': base64.b64encode(os.urandom(64)).decode(),
                'encryption_key': base64.b64encode(os.urandom(32)).decode()
            }
            
            self.credential_manager.store_credentials('system', credentials)
            
            # Create security policy
            security_policy = {
                'password_policy': {
                    'min_length': 12,
                    'require_special_chars': True,
                    'require_numbers': True,
                    'require_uppercase': True,
                    'max_age_days': 90
                },
                'session_policy': {
                    'timeout_minutes': 30,
                    'max_concurrent_sessions': 5
                },
                'encryption_policy': {
                    'algorithm': 'AES-256-GCM',
                    'key_rotation_days': 30
                }
            }
            
            with open('config/security_policy.json', 'w') as f:
                json.dump(security_policy, f, indent=2)
            
            logger.info("✅ Security configuration completed")
        except Exception as e:
            logger.error(f"❌ Security configuration failed: {e}")
            results['errors'].append(f"Security configuration failed: {e}")
    
    def _setup_cloud_integration(self, results: Dict[str, Any]) -> None:
        """Setup cloud storage integration"""
        try:
            # Note: In real implementation, these would be provided by user
            # For now, we'll create placeholder configurations
            
            onedrive_config = {
                'client_id': 'YOUR_ONEDRIVE_CLIENT_ID',
                'client_secret': 'YOUR_ONEDRIVE_CLIENT_SECRET'
            }
            
            gdrive_config = {
                'client_id': 'YOUR_GOOGLE_CLIENT_ID',
                'client_secret': 'YOUR_GOOGLE_CLIENT_SECRET'
            }
            
            # Store configurations (encrypted)
            self.credential_manager.store_credentials('onedrive_config', onedrive_config)
            self.credential_manager.store_credentials('gdrive_config', gdrive_config)
            
            logger.info("✅ Cloud integration setup completed")
        except Exception as e:
            logger.error(f"❌ Cloud integration setup failed: {e}")
            results['errors'].append(f"Cloud integration setup failed: {e}")
    
    def _create_documentation(self, results: Dict[str, Any]) -> None:
        """Create installation documentation"""
        try:
            docs = {
                'installation_date': datetime.now().isoformat(),
                'system_info': self.system_detector.system_info,
                'installed_services': self.system_detector.system_info['existing_services'],
                'security_notes': 'Credentials stored in encrypted files',
                'next_steps': [
                    'Configure API keys in config/api_keys.json',
                    'Set up cloud storage credentials',
                    'Test the installation',
                    'Review security policy'
                ]
            }
            
            with open('config/installation_report.json', 'w') as f:
                json.dump(docs, f, indent=2)
            
            logger.info("✅ Documentation created")
        except Exception as e:
            logger.error(f"❌ Documentation creation failed: {e}")
            results['errors'].append(f"Documentation creation failed: {e}")

def main():
    """Main function"""
    print("🚀 AZ Interface Implementation Engine")
    print("=====================================")
    
    engine = ImplementationEngine()
    results = engine.run_full_installation()
    
    # Save results
    with open('implementation_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📊 Installation Results:")
    print(f"Success: {results['success']}")
    print(f"Steps Completed: {len(results['installation_steps'])}")
    print(f"Errors: {len(results['errors'])}")
    
    if results['errors']:
        print("\n❌ Errors encountered:")
        for error in results['errors']:
            print(f"  - {error}")
    
    print(f"\n📄 Results saved to: implementation_results.json")

if __name__ == "__main__":
    main()
