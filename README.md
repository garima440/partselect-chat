# PartSelect AI Shopping Assistant

A specialized AI-powered chat agent designed to help customers find refrigerator and dishwasher parts, check compatibility, and provide installation guidance.



## 🌟 Features

- **Natural Language Understanding**: Understands user queries in plain language
- **Semantic Search**: Finds products based on meaning, not just keywords
- **Compatibility Checking**: Verifies if parts work with specific appliance models
- **Installation Guidance**: Provides step-by-step installation instructions
- **Troubleshooting Help**: Suggests parts based on described issues
- **Product Recommendations**: Displays detailed product cards with images, pricing, and availability
- **Scope Enforcement**: Maintains focus on refrigerator and dishwasher parts only
- **Conversation Memory**: Maintains context across multiple messages
- **Mobile Responsive**: Works seamlessly across devices

## 🏗️ Architecture

The application follows a modular architecture with four key layers:

1. **Frontend Layer**: React components for the user interface
2. **API Layer**: Next.js Edge functions for request processing
3. **Service Layer**: Specialized services for vector search and LLM interactions
4. **Data Layer**: Pinecone vector database for product information storage

### Request Flow

1. User sends a question through the chat interface
2. Frontend extracts part/model numbers and sends request to API
3. API adds system prompt and forwards to Deepseek LLM
4. LLM selects appropriate tool (search, compatibility, installation, troubleshooting)
5. Selected tool queries Pinecone vector database using OpenAI embeddings
6. Results return to the LLM which generates a natural language response
7. Response and any product cards are displayed to the user

## 🧠 AI Integration

- Integrated with **Deepseek** language model as specified in project requirements
- Uses **OpenAI's text-embedding-3-small** model for creating vector embeddings
- Custom system prompts ensure accurate, helpful, and focused responses
- Tool-based approach allows the LLM to use specialized functions based on query type

## 🔍 Vector Search

- Built with **Pinecone** vector database for efficient similarity search
- Products are indexed with rich text representations combining all product attributes
- Search uses cosine similarity to find semantically relevant matches
- Fallback mechanism for cases with no exact model matches
- Filter system to narrow results based on category, brand, and compatibility

## 🚀 Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Next.js (Edge Runtime), Deepseek API
- **Vector Database**: Pinecone
- **Embeddings**: OpenAI Embeddings API
- **Styling**: TailwindCSS with custom components
- **Storage**: Browser localStorage for conversation persistence
- **Development**: Node.js, TypeScript, ESLint

## 📋 Project Structure

```
partselect-chat/
├── .env.local              # Environment variables (not in git)
├── .gitignore
├── README.md
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
├── public/                 # Static assets
│   ├── logo.svg
│   └── favicon.ico
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Homepage with chat interface
│   │   └── globals.css
│   ├── components/         # React components
│   │   ├── ui/             # UI components
│   │   ├── Chat.tsx        # Main chat component
│   │   ├── ChatInput.tsx   # User input component
│   │   ├── ChatMessage.tsx # Message display component
│   │   └── ProductCard.tsx # Display product info
│   ├── lib/                # Shared utilities
│   │   ├── types.ts        # TypeScript interfaces
│   ├── hooks/              # React hooks
│   │   └── useChat.ts      # Chat functionality hook
│   ├── styles/             # Styling
│   │   └── theme.ts        # Theme configuration
│   ├── services/           # Service integrations
│   │   ├── llm.ts          # Deepseek LLM integration
│   │   ├── embedding.ts    # OpenAI embedding service
│   │   ├── products.ts     # Product data service
│   │   └── vectorDb.ts     # Vector database service
│   └── app/                # API routes
│       └── api/            
│           ├── chat/       
│           │   └── route.ts # Chat API endpoint
│           └── products/    
│               └── route.ts # Products API endpoint
└── scripts/               # Utility scripts
    └── indexProducts.ts   # Script to index products in Pinecone
```

## 🛠️ Key Components

- **Chat.tsx**: Main component that orchestrates the entire chat interface
- **ChatInput.tsx**: Handles user input with auto-expanding capabilities
- **ChatMessage.tsx**: Renders message bubbles with markdown support
- **ProductCard.tsx**: Displays product information in visually appealing cards
- **useChat.ts**: Custom hook for chat state management and message handling
- **chat.route.ts**: API endpoint that processes requests and manages LLM interactions
- **vectorDb.ts**: Handles interactions with Pinecone vector database
- **products.ts**: Provides specialized product information services
- **embedding.ts**: Creates and manages vector embeddings

## 📊 Performance Optimizations

- Context window management for efficient API usage
- Singleton pattern for database clients to minimize connection overhead
- Lazy loading of product information
- Filtering of search results for highest relevance
- Caching of chat history in browser storage

## 🔧 Setup and Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Deepseek API key
- OpenAI API key
- Pinecone API key and index

### Environment Variables

Create a `.env.local` file with:

```
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
OPENAI_API_KEY=your_openai_api_key 
MODEL_NAME=deepseek-chat
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=partselect-products
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/partselect-chat.git
cd partselect-chat

# Install dependencies
npm install

# Index product data (only needed once)
npm run index-products

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the application.

## 🧪 Testing Scenarios

The chatbot has been tested with various query types:

### Basic Functionality
- "What is the price of the EveryDrop Refrigerator Water Filter 1?"
- "Tell me about part number W10295370A"
- "Show me refrigerator water filters"
- "Is the Samsung Refrigerator Ice Maker Assembly in stock?"

### Compatibility Queries
- "Is the EveryDrop filter compatible with model WRF535SMBM00?"
- "Will part number WPW10730972 work with my LFSS2612TF0 refrigerator?"
- "What parts are compatible with my WDT750SAHZ0 dishwasher?"

### Installation & Troubleshooting
- "How do I install a W10295370A water filter?"
- "My Samsung refrigerator isn't making ice. How can I fix it?"
- "Troubleshooting tips for dishwasher not draining"

### Edge Cases
- "Can you recommend a good oven for my kitchen?" (Out of scope)
- "How do I repair my washing machine?" (Out of scope)
- "I need a filter" (Ambiguous query)
- "Is part number FAKE12345 in stock?" (Non-existent part)

## 🔮 Future Enhancements

- **Expanded Coverage**: Adding more appliance types
- **Order Integration**: Connecting to PartSelect's order system
- **Image-Based Search**: Allowing users to upload photos of broken parts
- **Personalization**: Remembering user's appliances for better recommendations
- **Voice Interface**: Adding speech input/output for hands-free operation

## 📝 License

This project is proprietary and developed for Instalily's case study.

## 👏 Acknowledgements

- PartSelect for the product data and branding inspiration
- Deepseek for the language model capabilities
- Pinecone for vector database technology
- OpenAI for embedding generation

---

Developed with ❤️ for the Instalily Software Engineering Case Study