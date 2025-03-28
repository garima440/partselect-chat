// Message types
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
  }
  
  // Product types
  export interface Product {
    id: string;
    partNumber: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    discount: number;
    category: string;
    subcategory: string;
    brand: string;
    imageUrl: string;
    inStock: boolean;
    stockCount: number;
    rating: number;
    reviewCount: number;
    compatibleModels: string[];
    deliveryEstimate: string;
    specifications: Record<string, string>;
    installationSteps?: string[];
    troubleshootingTips?: string[];
    vectorEmbedding?: number[];
  }
  
  export interface ProductResult extends Omit<Product, 'vectorEmbedding'> {
    score?: number;
    modelCompatibilityUnknown?: boolean;
  }
  
  // Chat state interface
  export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    productResults: ProductResult[];
  }
  
  // API request and response types
  export interface ChatRequest {
    messages: Message[];
    searchQuery?: string;
    modelNumber?: string;
    partNumber?: string;
    userInfo?: UserInfo;
  }
  
  export interface ChatResponse {
    message: Message;
    productResults?: ProductResult[];
    sources?: string[];
  }
  
  export interface SearchProductsRequest {
    query: string;
    category?: string;
    brand?: string;
    modelNumber?: string;
    partNumber?: string;
    limit?: number;
  }
  
  export interface SearchProductsResponse {
    products: ProductResult[];
    totalCount: number;
  }
  
  // User information
  export interface UserInfo {
    previousPurchases?: Product[];
    appliances?: UserAppliance[];
    location?: string;
  }
  
  export interface UserAppliance {
    type: string;
    brand: string;
    model: string;
    purchaseDate?: string;
  }
  
  // Vector database types
  export interface VectorSearchResult {
    id: string;
    score: number;
    metadata: Omit<Product, 'vectorEmbedding'>;
  }
  
  // LLM types
  export interface ToolCall {
    type: string;
    name: string;
    args: Record<string, any>;
  }
  
  export interface LLMResponse {
    content: string;
    toolCalls?: ToolCall[];
  }
  
  // Tool types
  export interface Tool {
    type: string;
    name: string;
    description: string;
    parameters: Record<string, any>;
  }