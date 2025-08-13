use tauri::command;
use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    pub size: Option<u64>,
    pub modified: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct FileContent {
    pub content: String,
    pub encoding: String,
    pub size: u64,
}

#[command]
pub async fn read_file_content(path: String) -> Result<FileContent, String> {
    let file_path = Path::new(&path);
    
    if !file_path.exists() {
        return Err(format!("File not found: {}", path));
    }
    
    if !file_path.is_file() {
        return Err(format!("Path is not a file: {}", path));
    }
    
    match fs::read_to_string(&path) {
        Ok(content) => {
            let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
            Ok(FileContent {
                content,
                encoding: "utf-8".to_string(),
                size: metadata.len(),
            })
        }
        Err(e) => Err(e.to_string()),
    }
}

#[command]
pub async fn write_file_content(path: String, content: String) -> Result<(), String> {
    let file_path = Path::new(&path);
    
    // Create parent directories if they don't exist
    if let Some(parent) = file_path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
    }
    
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[command]
pub async fn list_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let dir_path = Path::new(&path);
    
    if !dir_path.exists() {
        return Err(format!("Directory not found: {}", path));
    }
    
    if !dir_path.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }
    
    let mut entries = Vec::new();
    
    match fs::read_dir(&path) {
        Ok(entries_iter) => {
            for entry in entries_iter {
                match entry {
                    Ok(entry) => {
                        let path = entry.path();
                        let name = path.file_name()
                            .and_then(|n| n.to_str())
                            .unwrap_or("unknown")
                            .to_string();
                        
                        let full_path = path.to_string_lossy().to_string();
                        let is_directory = path.is_dir();
                        
                        let metadata = fs::metadata(&path).ok();
                        let size = if is_directory { None } else { metadata.map(|m| m.len()) };
                        let modified = metadata
                            .and_then(|m| m.modified().ok())
                            .map(|t| format!("{:?}", t));
                        
                        entries.push(FileEntry {
                            name,
                            path: full_path,
                            is_directory,
                            size,
                            modified,
                        });
                    }
                    Err(e) => {
                        eprintln!("Error reading directory entry: {}", e);
                    }
                }
            }
        }
        Err(e) => return Err(e.to_string()),
    }
    
    // Sort entries: directories first, then files
    entries.sort_by(|a, b| {
        if a.is_directory != b.is_directory {
            b.is_directory.cmp(&a.is_directory)
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });
    
    Ok(entries)
}

#[command]
pub async fn create_directory(path: String) -> Result<(), String> {
    fs::create_dir_all(&path).map_err(|e| e.to_string())
}

#[command]
pub async fn delete_file(path: String) -> Result<(), String> {
    let file_path = Path::new(&path);
    
    if !file_path.exists() {
        return Err(format!("File not found: {}", path));
    }
    
    if file_path.is_dir() {
        fs::remove_dir_all(&path).map_err(|e| e.to_string())
    } else {
        fs::remove_file(&path).map_err(|e| e.to_string())
    }
}

#[command]
pub async fn file_exists(path: String) -> Result<bool, String> {
    Ok(Path::new(&path).exists())
}

#[command]
pub async fn get_file_info(path: String) -> Result<FileEntry, String> {
    let file_path = Path::new(&path);
    
    if !file_path.exists() {
        return Err(format!("File not found: {}", path));
    }
    
    let name = file_path.file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("unknown")
        .to_string();
    
    let is_directory = file_path.is_dir();
    let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
    let size = if is_directory { None } else { Some(metadata.len()) };
    let modified = metadata
        .modified()
        .ok()
        .map(|t| format!("{:?}", t));
    
    Ok(FileEntry {
        name,
        path: path.clone(),
        is_directory,
        size,
        modified,
    })
}
