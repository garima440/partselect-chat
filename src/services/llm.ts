import { Message, LLMResponse, Tool, ToolCall } from '@/lib/types';

/**
 * Type definition for environment variables
 * This ensures we have the right types for each variable
 */
interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_API_URL: string;
  OPENAI_API_KEY: string;
  MODEL_NAME: string;
}

/**
 * Load configuration from environment variables
 * These control which AI model and API endpoint to use
 */
const env: Env = {
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
  DEEPSEEK_API_URL: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  MODEL_NAME: process.env.MODEL_NAME || 'deepseek-chat',
};

// Check if required API key is set
if (!env.DEEPSEEK_API_KEY) {
  console.error('DEEPSEEK_API_KEY is not set. Please set it in your environment variables.');
}

/**
 * Converts our internal message format to the format expected by Deepseek's API
 * Strips out extra information like IDs and timestamps
 */
function mapMessagesToDeepseekFormat(messages: Message[]): any[] {
  return messages.map(message => ({
    role: message.role,
    content: message.content,
  }));
}

/**
 * Main function to call the AI model with messages and optional tools
 * Returns both the text response and any tool calls the AI decided to make
 */
export async function callLLM(
    messages: Message[], 
    tools?: Tool[]
  ): Promise<LLMResponse> {
    try {
      // Convert messages to format expected by Deepseek
      const deepseekMessages = mapMessagesToDeepseekFormat(messages);
      
      // Prepare the API request payload
      const payload: any = {
        model: env.MODEL_NAME,
        messages: deepseekMessages,
        temperature: 0.7,           // Controls randomness (higher = more creative)
        max_tokens: 1500,           // Maximum length of the response
      };
      
      // Add tools to the request if provided
      if (tools && tools.length > 0) {
        // Transform tools to match Deepseek's expected format
        const formattedTools = tools.map(tool => {
          if (tool.type === 'function') {
            return {
              type: 'function',
              function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
              }
            };
          }
          return tool;
        });
        
        payload.tools = formattedTools;
        payload.tool_choice = 'auto';  // Let the AI decide when to use tools
      }
      
      // Log basic information about the request (for debugging)
      console.log('Calling Deepseek LLM:', { 
        messages: payload.messages.length,
        hasTools: Boolean(tools && tools.length > 0)
      });
      
      // Make the API request
      const response = await fetch(env.DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      
      // Handle API errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Deepseek API error: ${response.status} - ${errorText}`);
      }
      
      // Parse the API response
      const data = await response.json();
      
      // Extract the text response and any tool calls from the API response
      const assistantResponse = data.choices[0].message;
      const content = assistantResponse.content || '';
      
      let toolCalls: ToolCall[] = [];
      
      // Process any tool calls that the AI decided to make
      if (assistantResponse.tool_calls && assistantResponse.tool_calls.length > 0) {
        toolCalls = assistantResponse.tool_calls.map((tc: any) => {
          let args: Record<string, any> = {};
          
          try {
            args = JSON.parse(tc.function.arguments);
          } catch (error) {
            console.error('Error parsing tool call arguments:', error);
          }
          
          return {
            type: 'function',
            name: tc.function.name,
            args,
          };
        });
      }
      
      return { content, toolCalls };
    } catch (error) {
      console.error('Error calling Deepseek LLM:', error);
      throw error;
    }
}

/**
 * Simplified function for getting just a text response (no tools)
 * Useful for follow-up responses after tool calls
 */
export async function createCompletion(messages: Message[]): Promise<string> {
  try {
    const response = await callLLM(messages);
    return response.content;
  } catch (error) {
    console.error('Error creating completion:', error);
    return 'I apologize, but I encountered an issue generating a response. Please try again.';
  }
}