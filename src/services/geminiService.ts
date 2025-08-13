import { generateText, generateImageFromPrompt } from "./geminiClient";

/**
 * Gets a simulated terminal response for a given command.
 * This acts as a facade over the central geminiClient.
 */
export const getTerminalResponse = async (command: string): Promise<string> => {
  const config = {
    systemInstruction:
      "You are a helpful assistant simulating a terminal response. Be concise and format your output as if it were in a real command-line interface. For 'ls', list some creative, fictional files. For 'cat <filename>', show some fictional content.",
    thinkingConfig: { thinkingBudget: 0 }, // low latency
  };
  return generateText(command, config);
};

/**
 * Generates an image from a text prompt.
 * This acts as a facade over the central geminiClient.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  return generateImageFromPrompt(prompt);
};
