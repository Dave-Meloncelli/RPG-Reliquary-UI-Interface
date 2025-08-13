// Temporarily disabled for build

// Mock exports for build compatibility
export const streamErduEvents = () => {
  console.log("streamErduEvents called - temporarily disabled");
  return () => {}; // Return cleanup function
};

export const runIncidentResponse = () => {
  console.log("runIncidentResponse called - temporarily disabled");
  return Promise.resolve();
};
