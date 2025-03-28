import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatRequest, ChatResponse, ToolCall, ProductResult } from '@/lib/types';
import { searchProducts } from '@/services/vectorDb';
import { callLLM, createCompletion } from '@/services/llm';
import { getPartInstallationSteps, checkCompatibility, getTroubleshootingTips } from '@/services/products';

export const runtime = 'edge';
export const maxDuration = 30; // 30 seconds maximum duration

export interface SearchProductsRequest {
    query: string;
    category?: string;
    brand?: string;
    modelNumber?: string;
    partNumber?: string;
    limit?: number;
}

// Define available tools
const tools = [
  {
    type: 'function',
    name: 'search_products',
    description: 'Search for products based on part number, model compatibility, keywords, or description',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query, can include part numbers, model numbers, or descriptive terms',
        },
        partNumber: {
          type: 'string',
          description: 'Specific part number to search for',
        },
        modelNumber: {
          type: 'string',
          description: 'Appliance model number to check compatibility with',
        },
        category: {
          type: 'string',
          description: 'Product category (e.g., "refrigerator", "dishwasher")',
          enum: ['refrigerator', 'dishwasher'],
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 3,
        },
      },
      required: ['query'],
    },
  },
  {
    type: 'function',
    name: 'get_installation_steps',
    description: 'Get installation instructions for a specific part',
    parameters: {
      type: 'object',
      properties: {
        partNumber: {
          type: 'string',
          description: 'Part number to get installation instructions for',
        },
      },
      required: ['partNumber'],
    },
  },
  {
    type: 'function',
    name: 'check_compatibility',
    description: 'Check if a part is compatible with a specific model',
    parameters: {
      type: 'object',
      properties: {
        partNumber: {
          type: 'string',
          description: 'Part number to check compatibility for',
        },
        modelNumber: {
          type: 'string',
          description: 'Model number to check compatibility with',
        },
      },
      required: ['partNumber', 'modelNumber'],
    },
  },
  {
    type: 'function',
    name: 'get_troubleshooting_tips',
    description: 'Get troubleshooting tips for a specific issue',
    parameters: {
      type: 'object',
      properties: {
        issue: {
          type: 'string',
          description: 'Description of the issue to troubleshoot',
        },
        applianceType: {
          type: 'string',
          description: 'Type of appliance with the issue',
          enum: ['refrigerator', 'dishwasher'],
        },
        modelNumber: {
          type: 'string',
          description: 'Model number of the appliance (optional)',
        },
      },
      required: ['issue', 'applianceType'],
    },
  },
];

// Handle function calls based on tool name
async function executeToolCall(toolCall: ToolCall): Promise<any> {
    const { name, args } = toolCall;
    
    console.log(`Executing tool call: ${name}`, args);
    
    switch (name) {
      case 'search_products':
        // Ensure args has the required query property
        const searchArgs: SearchProductsRequest = {
          query: args.query || '', // Default to empty string if not provided
          ...args // Spread the rest of the arguments
        };
        return await searchProducts(searchArgs);
        
      case 'get_installation_steps':
        return await getPartInstallationSteps(args.partNumber);
        
      case 'check_compatibility':
        return await checkCompatibility(args.partNumber, args.modelNumber);
        
      case 'get_troubleshooting_tips':
        return await getTroubleshootingTips(args.issue, args.applianceType, args.modelNumber);
        
      default:
        throw new Error(`Unknown tool call: ${name}`);
    }
  }

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request
    const requestData: ChatRequest = await request.json();
    const { messages, partNumber, modelNumber } = requestData;
    
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }
    
    // Check if the request is specifically about appliance parts
    const isAboutAppliances = /refrigerator|dishwasher|appliance|part|model|ice maker|water filter|freezer|[A-Z0-9]{8,12}/i.test(
      lastUserMessage.content
    );
    
    // If query is clearly not about appliance parts, provide a redirection response
    if (!isAboutAppliances && messages.length > 1) {
      const redirectMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm specialized in helping with refrigerator and dishwasher parts. If you have questions about parts, compatibility, installation, or troubleshooting for these appliances, I'd be happy to assist. What specific refrigerator or dishwasher part question can I help you with?",
        timestamp: Date.now(),
      };
      
      return NextResponse.json({
        message: redirectMessage,
        productResults: [],
      });
    }
    
    // Prepare messages for LLM, including the system message
    let llmMessages = messages;
    
    // Add information about detected part/model numbers if found
    if (partNumber || modelNumber) {
      const infoMessage = `
    I've detected the following information:
    ${partNumber ? `- Part Number: ${partNumber}` : ''}
    ${modelNumber ? `- Model Number: ${modelNumber}` : ''}

    Please use this information to provide relevant assistance.
        `.trim();
        
      console.log('Info for LLM:', infoMessage);
    }
    
    // Call the LLM
    const llmResponse = await callLLM(llmMessages, tools);
    
    // Process any tool calls
    let productResults: ProductResult[] = [];
    let additionalContext = '';
    
    if (llmResponse.toolCalls && llmResponse.toolCalls.length > 0) {
      // Execute each tool call and collect results
      const toolCallResults = await Promise.all(
        llmResponse.toolCalls.map(async (toolCall) => {
          try {
            const result = await executeToolCall(toolCall);
            return { toolCall, result, error: null };
          } catch (error) {
            console.error(`Error executing tool call ${toolCall.name}:`, error);
            return {
              toolCall,
              result: null,
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
        })
      );
      
      // Process results from tool calls
      for (const { toolCall, result, error } of toolCallResults) {
        if (error) {
          additionalContext += `\n\nError executing ${toolCall.name}: ${error}`;
          continue;
        }
        
        switch (toolCall.name) {
            case 'search_products':
                if (result.products && result.products.length > 0) {
                    productResults = result.products;
                    if (productResults.some(p => p.modelCompatibilityUnknown)) {
                    additionalContext += `\n\nFound ${result.products.length} products that might help, but compatibility with model ${toolCall.args.modelNumber} couldn't be confirmed. These are our most relevant products for "${toolCall.args.query}".`;
                    } else {
                    additionalContext += `\n\nFound ${result.products.length} relevant products.`;
                    }
                } else {
                    additionalContext += `\n\nNo products found matching the search criteria.`;
                }
                break;
            
            case 'get_installation_steps':
                if (result.steps && result.steps.length > 0) {
                additionalContext += `\n\nInstallation Steps for Part ${toolCall.args.partNumber}:\n`;
                result.steps.forEach((step: string, index: number) => {
                    additionalContext += `${index + 1}. ${step}\n`;
                });
                } else {
                additionalContext += `\n\nNo installation steps found for part ${toolCall.args.partNumber}.`;
                }
                break;
                
            case 'check_compatibility':
                additionalContext += `\n\nCompatibility Check Result: ${result.compatible ? 'Compatible' : 'Not compatible'}.`;
                if (result.details) {
                additionalContext += ` ${result.details}`;
                }
                break;
                
            case 'get_troubleshooting_tips':
                if (result.tips && result.tips.length > 0) {
                additionalContext += `\n\nTroubleshooting Tips:\n`;
                result.tips.forEach((tip: string, index: number) => {
                    additionalContext += `${index + 1}. ${tip}\n`;
                });
                } else {
                additionalContext += `\n\nNo troubleshooting tips found for this issue.`;
                }
                break;
            }
        }
        
        // If we have additional context, do a final LLM call to incorporate it
        if (additionalContext) {
            console.log('Additional context:', additionalContext);
            
            // Add a system message with the additional context
            const contextMessage: Message = {
            id: uuidv4(),
            role: 'system',
            content: `Use the following information to enhance your response:${additionalContext}\n\nIncorporate this information naturally into your response without explicitly mentioning that you received this additional context.`,
            timestamp: Date.now(),
            };
            
            // Generate a final response with the additional context
            const finalResponse = await createCompletion([...llmMessages, contextMessage]);
            llmResponse.content = finalResponse;
        }
    }
    
    // Create the assistant message
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: llmResponse.content,
      timestamp: Date.now(),
    };
    
    // Return the response
    const response: ChatResponse = {
      message: assistantMessage,
      productResults,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        message: {
          id: uuidv4(),
          role: 'assistant',
          content: "I'm sorry, I encountered an error while processing your request. Please try again or rephrase your question.",
          timestamp: Date.now(),
        }
      },
      { status: 500 }
    );
  }
}