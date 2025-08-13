mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      // System commands
      execute_command,
      list_processes,
      get_system_status,
      manage_docker_containers,
      restart_service,
      
      // File operations
      read_file_content,
      write_file_content,
      list_directory,
      create_directory,
      delete_file,
      file_exists,
      get_file_info,
      
      // AI integration
      call_gemini_api,
      generate_image,
      analyze_system_state,
      get_ai_models,
      save_api_key,
      test_api_connection,
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
