import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatRequest, ChatResponse, ToolCall, ProductResult } from '@/lib/types';
import { searchProducts } from '@/services/vectorDb';
import { callLLM, createCompletion } from '@/services/llm';
import { getPartInstallationSteps, checkCompatibility, getTroubleshootingTips } from '@/services/products';

// Set the server type and maximum time for request processing
export const runtime = 'edge';
export const maxDuration = 30; // 30 seconds maximum duration

/**
 * Checks if the user's question is about appliances we don't support
 * (This chatbot only helps with refrigerators and dishwashers)
 */
function isOutOfScope(query: string): boolean {
  const queryLower = query.toLowerCase();
  
  // List of appliances we don't support
  const unsupportedAppliances = [
    'oven', 'microwave', 'washing machine', 'washer', 'dryer', 
    'stove', 'range', 'air conditioner', 'blender', 'toaster'
  ];
  
  // Look for patterns that indicate the question is about unsupported appliances
  for (const appliance of unsupportedAppliances) {
    const patterns = [
      new RegExp(`\\b${appliance}\\b`, 'i'),
      new RegExp(`my\\s+${appliance}`, 'i'),
      new RegExp(`recommend.*\\s+${appliance}`, 'i'),
      new RegExp(`best\\s+${appliance}`, 'i'),
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(queryLower)) {
        // If it also mentions supported appliances, it might be a comparison
        if (/(refrigerator|fridge|dishwasher)/i.test(queryLower)) {
          continue; // Not clearly out of scope
        }
        return true; // Definitely out of scope
      }
    }
  }
  
  return false;
}

/**
 * Checks if the AI's response accidentally talks about appliances we don't support
 */
function containsOutOfScopeContent(content: string): boolean {
  const contentLower = content.toLowerCase();
  const patterns = [
    /recommend.*\b(oven|microwave|washer|dryer|stove)\b/i,
    /best\s+(oven|microwave|washer|dryer|stove)\b/i,
    /information.*\b(oven|microwave|washer|dryer|stove)\b/i,
    /can.*help.*\b(oven|microwave|washer|dryer|stove)\b/i
  ];
  
  return patterns.some(pattern => pattern.test(contentLower));
}

/**
 * Makes sure product information is accurate in the AI's response
 * If there are errors, it replaces the response with correct information
 */
function verifyProductResponse(content: string, productResults: ProductResult[]): string {
  // Skip verification if no products or empty content
  if (!productResults.length || !content.trim()) {
    return content;
  }
  
  let verifiedContent = content;
  let hasErrors = false;
  
  // Check each product for inaccurate descriptions
  for (const product of productResults) {
    const partNumberRegex = new RegExp(`\\b${product.partNumber}\\b`, 'i');
    
    // Only check if the part number is mentioned in the response
    if (partNumberRegex.test(content)) {
      // Define product types to check for
      const productTypes = [
        "water filter", "ice maker", "drawer", "fan", "motor", 
        "thermostat", "valve", "pump", "door", "seal", "gasket",
        "light", "bulb", "dispenser", "shelf", "element"
      ];
      
      // Get the actual product type from name or subcategory
      const actualType = product.subcategory || 
        productTypes.find(type => product.name.toLowerCase().includes(type)) || 
        "part";
      
      // Check for incorrect product type descriptions
      for (const type of productTypes) {
        // Skip if this is the actual product type
        if (product.name.toLowerCase().includes(type) || 
            product.subcategory?.toLowerCase().includes(type)) {
          continue;
        }
        
        // Look for incorrect associations
        const typeRegex = new RegExp(`${product.partNumber}[^.]*?\\b${type}\\b`, 'i');
        if (typeRegex.test(content)) {
          console.log(`ERROR: Part ${product.partNumber} incorrectly described as "${type}" instead of "${product.name}"`);
          hasErrors = true;
          break;
        }
      }
      
      if (hasErrors) {
        // Generate corrected response with accurate product information
        verifiedContent = `I found information about part number ${product.partNumber}:

This is a ${product.brand} ${product.name} for ${product.category}s${product.subcategory ? ` (${product.subcategory})` : ''}.

Price: $${product.price.toFixed(2)}
${product.inStock ? `✅ This part is currently in stock (${product.stockCount} available).` : '❌ This part is currently out of stock.'}

${product.description}

${product.compatibleModels && product.compatibleModels.length > 0 ? 
`This part is compatible with models: ${product.compatibleModels.slice(0, 3).join(', ')}${product.compatibleModels.length > 3 ? ' and more' : ''}` : ''}

Would you like more information about this part or help with anything else?`;
        break;
      }
    }
  }
  
  return verifiedContent;
}

/**
 * Narrows down product search results to the most relevant ones
 * Makes the response more focused and helpful
 */
function filterProductResults(
  productResults: ProductResult[], 
  toolCall: ToolCall, 
  userMessage: string
): ProductResult[] {
  if (!productResults || productResults.length === 0) {
    return [];
  }
  
  const { args } = toolCall;
  
  // Case 1: If searching by specific part number, return only exact matches
  if (args.partNumber && productResults.some(p => p.partNumber === args.partNumber)) {
    return productResults.filter(p => p.partNumber === args.partNumber);
  }
  
  // Case 2: If searching by model number, return only compatible products
  if (args.modelNumber) {
    const modelCompatible = productResults.filter(product => 
      product.compatibleModels?.some(model => 
        model.toLowerCase().includes(args.modelNumber.toLowerCase())
      )
    );
    
    if (modelCompatible.length > 0) {
      return modelCompatible;
    }
  }
  
  // Case 3: If searching with query terms and model number, try to find products that match both
  if (args.query && args.modelNumber) {
    // Extract key terms from the query
    const queryTerms = args.query.toLowerCase().split(/\s+/);
    const significantTerms = queryTerms.filter((term: string) => 
      term.length > 3 && 
      !['the', 'and', 'with', 'for', 'this', 'that', 'what', 'have', 'does'].includes(term)
    );
    
    if (significantTerms.length > 0) {
      // Find products that match both query terms AND model compatibility
      const matchingProducts = productResults.filter(product => {
        // Check for term matches in name or description
        const termMatches = significantTerms.some((term: string) => 
          product.name.toLowerCase().includes(term) || 
          (product.subcategory && product.subcategory.toLowerCase().includes(term)) ||
          product.description.toLowerCase().includes(term)
        );
        
        // Check for model compatibility
        const modelMatch = product.compatibleModels?.some(model => 
          model.toLowerCase().includes(args.modelNumber.toLowerCase())
        );
        
        return termMatches && modelMatch;
      });
      
      if (matchingProducts.length > 0) {
        return matchingProducts;
      }
    }
  }
  
  // Case 4: If limited number of results and scores are very different, return only the highest scoring
  if (productResults.length > 1) {
    // Sort by score (higher is better)
    const sortedProducts = [...productResults].sort((a, b) => (b.score || 0) - (a.score || 0));
    
    // If top score is significantly better than second score, only return the top
    if (sortedProducts.length >= 2 && 
        (sortedProducts[0].score || 0) > (sortedProducts[1].score || 0) * 1.5) {
      return [sortedProducts[0]];
    }
    
    // If we have a lot of results, limit to highest similarity
    if (sortedProducts.length > 2) {
      // Get highest score
      const highestScore = sortedProducts[0].score || 0;
      
      // Return only products with scores close to the highest
      return sortedProducts.filter(p => (p.score || 0) >= highestScore * 0.7);
    }
  }
  
  // Default: return all products as they came from search
  return productResults;
}

// Define what the search product request looks like
export interface SearchProductsRequest {
    query: string;
    category?: string;
    brand?: string;
    modelNumber?: string;
    partNumber?: string;
    limit?: number;
}

// List of tools the AI assistant can use to help customers
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

/**
 * Runs the tool that the AI assistant decided to use
 * Tools help find products, check compatibility, etc.
 */
async function executeToolCall(toolCall: ToolCall): Promise<any> {
    const { name, args } = toolCall;
    
    console.log(`Executing tool call: ${name}`, args);
    
    switch (name) {
      case 'search_products':
        // Ensure args has the required query property
        const searchArgs: SearchProductsRequest = {
          query: args.query || '', // Default to empty string if not provided
          partNumber: args.partNumber,
          modelNumber: args.modelNumber,
          category: args.category,
          brand: args.brand,
          limit: args.limit,
        };
        
        const result = await searchProducts(searchArgs);
        
        // Enhanced logging for debugging
        if (result.products && result.products.length > 0) {
          console.log(`Found ${result.products.length} products:`, 
            result.products.map(p => ({
              partNumber: p.partNumber,
              name: p.name,
              category: p.category
            }))
          );
        } else {
          console.log('No products found for query:', searchArgs);
        }
        
        return result;
        
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

/**
 * Main function that handles all chat requests
 * This is the entry point for the API
 */
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
    
    // Check if the query is explicitly about unsupported appliances
    if (isOutOfScope(lastUserMessage.content)) {
      const outOfScopeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I'm only able to assist with refrigerator and dishwasher parts at this time. I'd be happy to help you find parts, check compatibility, or troubleshoot issues with these specific appliances.",
        timestamp: Date.now(),
      };
      
      return NextResponse.json({
        message: outOfScopeMessage,
        productResults: [],
      });
    }
    
    // Prepare messages for LLM, including the system message
    let llmMessages = messages;
    
    // Make sure there's a system message (instructions for the AI)
    if (!llmMessages.some(m => m.role === 'system')) {
      // Enhanced system message with product information accuracy guidelines
      const systemMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: `You are the PartSelect customer service assistant, specialized in helping customers with refrigerator and dishwasher parts and issues.

        YOUR CORE CAPABILITIES:
        1. Provide information about refrigerator and dishwasher parts, including compatibility, pricing, and availability
        2. Assist with troubleshooting common refrigerator and dishwasher problems
        3. Offer installation guidance for replacement parts
        4. Explain how different parts function within appliances
        5. Recommend appropriate parts based on symptoms or issues described
        
        RESPONSE GUIDELINES:
        1. Be DIRECT and CONCISE - Answer the user's specific question first before asking for additional information
        2. For product queries, provide the most relevant information IMMEDIATELY (price, compatibility, availability)
        3. Only ask for model numbers when NECESSARY for compatibility verification
        4. Use SIMPLE formatting with minimal bold text - only highlight the most important details
        5. Focus on ANSWERING THE QUESTION rather than demonstrating your knowledge
        
        PRODUCT INFORMATION ACCURACY:
        - When a specific part number is mentioned, ALWAYS describe it according to its EXACT product type from the database
        - NEVER change the product type or category from what is in the database
        - If you're uncertain about a specific part, acknowledge the limitation of your information rather than making assumptions
        
        GENERAL KNOWLEDGE ABOUT APPLIANCES:
        - You CAN provide general information about how refrigerators and dishwashers work
        - You CAN offer general troubleshooting steps for common issues
        - You CAN explain the function of different components within these appliances
        - You CAN suggest DIY fixes for simple problems that don't require replacement parts
        
        OUT OF SCOPE:
        - If a user asks about ANY other appliance like ovens, microwaves, washing machines, stoves, or topics completely unrelated to refrigerators and dishwashers, politely redirect:
          "I'm sorry, I'm specialized in refrigerator and dishwasher information. I'd be happy to help with any questions about those appliances."
        
        CONVERSATION STYLE:
        - Be helpful, friendly, and knowledgeable
        - Use everyday language, avoiding overly technical terms unless necessary
        - When explaining complex concepts, use analogies or simplified explanations
        - For troubleshooting, use step-by-step instructions
        - For part information, be precise and factual`,
        timestamp: Date.now(),
      };
      
      llmMessages = [systemMessage, ...llmMessages];
    }
    
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
    
    // Call the AI (LLM) to generate a response
    const llmResponse = await callLLM(llmMessages, tools);
    
    // Process any tool calls that the AI decided to use
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

            const filteredProducts = filterProductResults(
              result.products, 
              toolCall, 
              lastUserMessage.content
              );
              
              // Use the filtered products instead of all results
              productResults = filteredProducts;

              if (toolCall.args.modelNumber) {
                // Check if any products explicitly list this model as compatible
                const exactCompatMatch = productResults.some(product => 
                    product.compatibleModels?.some(model => 
                        model.toLowerCase() === toolCall.args.modelNumber.toLowerCase()
                    )
                );
                
                if (!exactCompatMatch) {
                    additionalContext += `\n\nIMPORTANT: None of the found products explicitly list model ${toolCall.args.modelNumber} as compatible. These are the most relevant parts based on your search, but confirm compatibility before purchasing.\n`;
                }
            }
            
              if (result.products && result.products.length > 0) {
                  productResults = result.products;
                  
                  // Provide VERY explicit product information with strong guardrails
                  additionalContext += `\n\n### RETRIEVED PRODUCT INFORMATION ###\n`;
                  
                  result.products.forEach((product: ProductResult, index: number) => {
                    additionalContext += `\nProduct ${index + 1}:
                    PART NUMBER: ${product.partNumber}
                    EXACT PRODUCT TYPE: ${product.name}
                    CATEGORY: ${product.category}
                    SUBCATEGORY: ${product.subcategory || 'N/A'}
                    BRAND: ${product.brand}
                    PRICE: $${product.price.toFixed(2)}
                    STOCK STATUS: ${product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                    DESCRIPTION: ${product.description}
                    ${product.compatibleModels ? `COMPATIBLE MODELS: ${product.compatibleModels.join(', ')}` : ''}

                    IMPORTANT: When referring to part ${product.partNumber}, you MUST describe it as a "${product.name}" and NEVER as any other type of product.
                    `;
                                        });
                    
                    additionalContext += `\n### END PRODUCT INFORMATION ###\n`;
                    
                    if (productResults.some(p => p.modelCompatibilityUnknown)) {
                      additionalContext += `\nNOTE: Compatibility with model ${toolCall.args.modelNumber} couldn't be confirmed. The listed products are our most relevant options for "${toolCall.args.query}".\n`;
                    }
                } else {
                    additionalContext += `\n\nNo products found matching the search criteria.\n`;
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
        
        // If we have additional context, do a final AI call to incorporate it
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
    
    // Check if the AI response inappropriately discusses out-of-scope appliances
    if (containsOutOfScopeContent(llmResponse.content)) {
      llmResponse.content = "I'm sorry, I'm only able to assist with refrigerator and dishwasher parts at this time. I'd be happy to help you find parts, check compatibility, or troubleshoot issues with these specific appliances.";
    }
    
    // Verify product information in the response
    if (productResults.length > 0) {
      llmResponse.content = verifyProductResponse(llmResponse.content, productResults);
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
    
    // Handle errors gracefully
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