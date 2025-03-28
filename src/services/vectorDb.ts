import { Pinecone } from '@pinecone-database/pinecone';
import { ProductResult, SearchProductsRequest } from '@/lib/types';
import { createEmbedding } from './embedding';

// Environment variables
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '';
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'partselect-products';
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'default';

// Initialize Pinecone client
let pinecone: Pinecone | null = null;

async function getPineconeClient(): Promise<Pinecone> {
    if (!pinecone) {
        if (!PINECONE_API_KEY) {
        throw new Error('Pinecone API key not set');
        }

        pinecone = new Pinecone({
        apiKey: PINECONE_API_KEY,
        });
    }
    
    return pinecone;
}

// Search products in Pinecone
export async function searchProducts(request: SearchProductsRequest): Promise<{ products: ProductResult[], totalCount: number }> {
    try {
      const { query, category, brand, modelNumber, partNumber, limit = 3 } = request;
      
      // Generate embedding for search query
      const embedding = await createEmbedding(query);
      
      // Get Pinecone client and index
      const pc = await getPineconeClient();
      const index = pc.index(PINECONE_INDEX_NAME);
      
      // Build filter condition - add proper typing with index signature
      const filter: Record<string, any> = {};
      
      if (category) {
        filter.category = { $eq: category };
      }
      
      if (brand) {
        filter.brand = { $eq: brand };
      }
      
      // MODIFY THIS PART: Make model number matching optional
      // Only filter by model number if explicitly searching for compatibility
      if (partNumber && modelNumber) {
        // When checking compatibility, keep strict model matching
        filter['compatibleModels'] = { $in: [modelNumber] };
      }
      
      if (partNumber) {
        filter.partNumber = { $eq: partNumber };
      }
      
      // Perform vector search
      const searchResults = await index.query({
        vector: embedding,
        topK: limit,
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        includeMetadata: true,
      });
      
      // Convert search results to product results
      const products: ProductResult[] = searchResults.matches.map((match: any) => ({
        ...match.metadata,
        score: match.score,
      }));
      
      // If no exact matches found but modelNumber was provided, return top results with a note
      if (products.length === 0 && modelNumber && query) {
        console.log(`No exact matches for model ${modelNumber}, performing general search for "${query}"`);
        
        // Create new filter without compatibleModels constraint
        const generalFilter: Record<string, any> = {};
        
        // Only copy over the filters that aren't related to model compatibility
        Object.keys(filter).forEach(key => {
          if (key !== 'compatibleModels') {
            generalFilter[key] = filter[key];
          }
        });
        
        // Do a second search without the model number constraint
        const generalResults = await index.query({
          vector: embedding,
          topK: limit,
          filter: Object.keys(generalFilter).length > 0 ? generalFilter : undefined,
          includeMetadata: true,
        });
        
        const generalProducts = generalResults.matches.map((match: any) => ({
          ...match.metadata,
          score: match.score,
          modelCompatibilityUnknown: true // Flag to indicate compatibility wasn't confirmed
        }));
        
        return { products: generalProducts, totalCount: generalProducts.length };
      }
      
      return { products, totalCount: products.length };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
}

// Index a product in Pinecone
export async function indexProduct(product: Record<string, any>, embedding: number[]): Promise<void> {
    try {
      const pc = await getPineconeClient();
      const index = pc.index(PINECONE_INDEX_NAME);
      
      // Create a simplified version of the product for metadata
      // Converting any objects to strings to comply with Pinecone's requirements
      const metadata: Record<string, any> = {};
      
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'vectorEmbedding') {
          // Skip the embedding itself
          return;
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Convert objects to JSON strings
          metadata[key] = JSON.stringify(value);
        } else {
          // Keep simple types as is
          metadata[key] = value;
        }
      });
      
      await index.upsert([
        {
          id: product.id,
          values: embedding,
          metadata,
        },
      ]);
      
      console.log(`Indexed product ${product.id} in Pinecone`);
    } catch (error) {
      console.error(`Error indexing product ${product.id}:`, error);
      throw error;
    }
}

// Delete a product from Pinecone
export async function deleteProduct(productId: string): Promise<void> {
  try {
    const pc = await getPineconeClient();
    const index = pc.index(PINECONE_INDEX_NAME);
    
    await index.namespace(PINECONE_NAMESPACE).deleteOne(productId);
    
    console.log(`Deleted product ${productId} from Pinecone`);
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
}

/**
 * Delete all vectors in the namespace to start fresh
 */
export async function deleteNamespace(): Promise<void> {
    try {
      const pc = await getPineconeClient();
      const index = pc.index(PINECONE_INDEX_NAME);
      
      // Delete all vectors in the namespace
      await index.namespace(PINECONE_NAMESPACE).deleteAll();
      
      console.log(`Deleted all vectors in namespace ${PINECONE_NAMESPACE}`);
    } catch (error) {
      console.error('Error deleting namespace:', error);
      throw error;
    }
  }