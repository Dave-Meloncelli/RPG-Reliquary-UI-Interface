// Temporarily disabled for build

// Mock export for build compatibility
export const fileSystemService = {
  readFile: () => Promise.resolve(""),
  writeFile: () => Promise.resolve(),
  listFiles: () => Promise.resolve([]),
  createDirectory: () => Promise.resolve(),
  deleteFile: () => Promise.resolve(),
  moveFile: () => Promise.resolve(),
};
