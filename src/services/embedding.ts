import OpenAI from 'openai';


// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

console.log("Embedding API Key:", OPENAI_API_KEY ? "Loaded" : "Not Loaded");

// Initialize OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not set');
    }
    
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }
  
  return openai;
}

// Create embedding for text
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const client = getOpenAIClient();
    
    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

// Create embeddings for batch of texts
export async function createEmbeddingBatch(texts: string[]): Promise<number[][]> {
  try {
    const client = getOpenAIClient();
    
    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });
    
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error creating embedding batch:', error);
    throw error;
  }
}

// Create embedding for a product
export async function createProductEmbedding(product: Record<string, any>): Promise<number[]> {
  // Create a rich text representation of the product for embedding
  const textToEmbed = [
    `Product: ${product.name}`,
    `Part Number: ${product.partNumber}`,
    `Description: ${product.description}`,
    `Category: ${product.category}`,
    `Subcategory: ${product.subcategory}`,
    `Brand: ${product.brand}`,
    `Compatible Models: ${(product.compatibleModels || []).join(', ')}`,
    // Add specifications
    ...(product.specifications 
      ? Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`)
      : []),
    // Add installation steps if available
    ...(product.installationSteps 
      ? [`Installation Steps: ${product.installationSteps.join('. ')}`] 
      : []),
    // Add troubleshooting tips if available
    ...(product.troubleshootingTips 
      ? [`Troubleshooting Tips: ${product.troubleshootingTips.join('. ')}`] 
      : []),
  ].filter(Boolean).join('\n');
  
  return await createEmbedding(textToEmbed);
}