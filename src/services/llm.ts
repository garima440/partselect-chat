import { Message, LLMResponse, Tool, ToolCall } from '@/lib/types';

// Define environment variables interface for type safety
interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_API_URL: string;
  OPENAI_API_KEY: string;
  MODEL_NAME: string;
}

// Get environment variables
const env: Env = {
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
  DEEPSEEK_API_URL: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  MODEL_NAME: process.env.MODEL_NAME || 'deepseek-chat',
};

// Validate required environment variables
if (!env.DEEPSEEK_API_KEY) {
  console.error('DEEPSEEK_API_KEY is not set. Please set it in your environment variables.');
}

// Map our message format to Deepseek format
function mapMessagesToDeepseekFormat(messages: Message[]): any[] {
  return messages.map(message => ({
    role: message.role,
    content: message.content,
  }));
}

// Call the Deepseek LLM with tools
export async function callLLM(
    messages: Message[], 
    tools?: Tool[]
  ): Promise<LLMResponse> {
    try {
      const deepseekMessages = mapMessagesToDeepseekFormat(messages);
      
      const payload: any = {
        model: env.MODEL_NAME,
        messages: deepseekMessages,
        temperature: 0.7,
        max_tokens: 1500,
      };
      
      // Add tools if provided, making sure they're in the format Deepseek expects
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
        payload.tool_choice = 'auto';
      }
      
      console.log('Calling Deepseek LLM:', { 
        messages: payload.messages.length,
        hasTools: Boolean(tools && tools.length > 0)
      });
      
      const response = await fetch(env.DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Deepseek API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Extract content and tool calls from response
      const assistantResponse = data.choices[0].message;
      const content = assistantResponse.content || '';
      
      let toolCalls: ToolCall[] = [];
      
      // Handle tool calls if present
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

// Simple completion without tools
export async function createCompletion(messages: Message[]): Promise<string> {
  try {
    const response = await callLLM(messages);
    return response.content;
  } catch (error) {
    console.error('Error creating completion:', error);
    return 'I apologize, but I encountered an issue generating a response. Please try again.';
  }
}