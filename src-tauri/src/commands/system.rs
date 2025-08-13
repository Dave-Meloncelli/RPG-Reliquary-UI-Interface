use tauri::command;
use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
    pub cpu_usage: f32,
    pub memory_usage: u64,
    pub status: String,
}

#[derive(Serialize, Deserialize)]
pub struct SystemStatus {
    pub total_processes: usize,
    pub cpu_usage: f32,
    pub memory_usage: f32,
    pub disk_usage: f32,
    pub uptime: u64,
}

#[command]
pub async fn execute_command(command: String) -> Result<String, String> {
    let output = if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(["/C", &command])
            .output()
    } else {
        Command::new("sh")
            .arg("-c")
            .arg(&command)
            .output()
    };

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let stderr = String::from_utf8_lossy(&output.stderr);
            if !stderr.is_empty() {
                Err(stderr.to_string())
            } else {
                Ok(stdout.to_string())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}

#[command]
pub async fn list_processes() -> Result<Vec<ProcessInfo>, String> {
    // For now, return a mock implementation
    // In a real implementation, you'd use sysinfo crate
    let mock_processes = vec![
        ProcessInfo {
            pid: 1,
            name: "System".to_string(),
            cpu_usage: 0.5,
            memory_usage: 1024 * 1024,
            status: "Running".to_string(),
        },
        ProcessInfo {
            pid: 1234,
            name: "az-interface".to_string(),
            cpu_usage: 2.1,
            memory_usage: 50 * 1024 * 1024,
            status: "Running".to_string(),
        },
    ];
    
    Ok(mock_processes)
}

#[command]
pub async fn get_system_status() -> Result<SystemStatus, String> {
    // Mock system status - in real implementation, use sysinfo
    Ok(SystemStatus {
        total_processes: 150,
        cpu_usage: 25.5,
        memory_usage: 60.2,
        disk_usage: 45.8,
        uptime: 86400, // 24 hours in seconds
    })
}

#[command]
pub async fn manage_docker_containers(action: String, container_name: Option<String>) -> Result<String, String> {
    let mut docker_cmd = Command::new("docker");
    
    match action.as_str() {
        "ps" => {
            docker_cmd.arg("ps");
        }
        "start" => {
            if let Some(name) = container_name {
                docker_cmd.args(["start", &name]);
            } else {
                return Err("Container name required for start action".to_string());
            }
        }
        "stop" => {
            if let Some(name) = container_name {
                docker_cmd.args(["stop", &name]);
            } else {
                return Err("Container name required for stop action".to_string());
            }
        }
        "logs" => {
            if let Some(name) = container_name {
                docker_cmd.args(["logs", &name]);
            } else {
                return Err("Container name required for logs action".to_string());
            }
        }
        _ => {
            return Err(format!("Unknown Docker action: {}", action));
        }
    }
    
    let output = docker_cmd.output().map_err(|e| e.to_string())?;
    let result = String::from_utf8_lossy(&output.stdout);
    
    if !output.stderr.is_empty() {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(error.to_string())
    } else {
        Ok(result.to_string())
    }
}

#[command]
pub async fn restart_service(service_name: String) -> Result<String, String> {
    let command = if cfg!(target_os = "windows") {
        format!("net stop {} && net start {}", service_name, service_name)
    } else {
        format!("sudo systemctl restart {}", service_name)
    };
    
    execute_command(command).await
}
