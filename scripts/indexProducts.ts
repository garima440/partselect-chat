/**
 * Script to index product data into Pinecone
 * 
 * Usage:
 * 1. Make sure your .env file is set up with PINECONE and OPENAI API keys
 * 2. Run: npx tsx scripts/indexProducts.ts
 */

import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { createProductEmbedding } from '../src/services/embedding';
import { indexProduct, deleteNamespace } from '../src/services/vectorDb';
import { realProducts } from '../data/realProducts';

// Load environment variables
dotenv.config({ path: '.env' });
console.log('OpenAI API Key exists:', Boolean(process.env.OPENAI_API_KEY));

// Function to save products to a JSON file
async function saveProductsToFile(products: any[]) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    
    // Ensure data directory exists
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    
    console.log(`Saved ${products.length} products to ${filePath}`);
  } catch (error) {
    console.error('Error saving products to file:', error);
  }
}

// Function to clear existing data in Pinecone namespace
async function clearExistingData() {
  try {
    console.log('Clearing existing product data from Pinecone...');
    await deleteNamespace();
    console.log('Successfully cleared previous product data.');
  } catch (error) {
    console.error('Error clearing Pinecone data:', error);
  }
}

// Main function to index products
async function indexProducts() {
  // Use the comprehensive products list from realProducts.ts
  const PRODUCTS_TO_INDEX = realProducts;
  
  console.log(`Starting to index ${PRODUCTS_TO_INDEX.length} products...`);
  
  // Save products to file for reference
  await saveProductsToFile(PRODUCTS_TO_INDEX);
  
  // Clear existing data first
  await clearExistingData();
  
  // Process each product
  for (const product of PRODUCTS_TO_INDEX) {
    try {
      console.log(`Processing product: ${product.partNumber} - ${product.name}`);
      
      // Generate embedding for product
      const embedding = await createProductEmbedding(product);
      
      // Index product in Pinecone
      await indexProduct(product, embedding);
      
      console.log(`Successfully indexed product: ${product.partNumber}`);
    } catch (error) {
      console.error(`Error processing product ${product.partNumber}:`, error);
    }
  }
  
  console.log('Finished indexing products!');
}

// Run the indexing process
indexProducts().catch(error => {
  console.error('Error in indexing script:', error);
  process.exit(1);
});