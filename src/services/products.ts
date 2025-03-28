import { Product, ProductResult } from '@/lib/types';
import { searchProducts as searchProductsInVectorDb } from './vectorDb';


interface InstallationStepsMap {
[partNumber: string]: string[];
}

interface TroubleshootingIssuesMap {
[issue: string]: string[];
}

interface TroubleshootingApplianceMap {
[applianceType: string]: TroubleshootingIssuesMap;
}

// Simulated product database - in a real application, this would be a database call
const SAMPLE_INSTALLATION_STEPS: InstallationStepsMap =  {
  'PS11752778': [
    'Turn off the refrigerator and unplug it from the power outlet.',
    'Locate the water filter housing in the upper right corner of the refrigerator interior.',
    'Press the release button on the old filter and pull it out.',
    'Remove the protective cap from the new filter.',
    'Align the new filter with the filter housing and push it in until it clicks.',
    'Run 4 gallons of water through the dispenser to purge air and contaminants from the system.'
  ],
  'PS11748915': [
    'Turn off the dishwasher and disconnect power.',
    'Remove the lower dish rack to access the bottom of the dishwasher.',
    'Locate the pump assembly at the bottom center of the tub.',
    'Remove any standing water using a towel or sponge.',
    'Unscrew the old pump assembly by turning counterclockwise.',
    'Install the new pump assembly and turn clockwise to secure.',
    'Reconnect power and run a test cycle with the dishwasher empty.'
  ],
  // Add more installation steps for other parts as needed
};

const SAMPLE_TROUBLESHOOTING_TIPS: TroubleshootingApplianceMap = {
  'refrigerator': {
    'ice maker not working': [
      'Check if the ice maker arm is in the down position.',
      'Ensure the water supply line to the refrigerator is not kinked or frozen.',
      'Verify the water filter is not clogged and is installed correctly.',
      'Check the freezer temperature (should be between 0-5°F or -18 to -15°C).',
      'Inspect the water inlet valve for proper operation.',
      'Look for ice buildup in the ice maker assembly.'
    ],
    'not cooling': [
      'Check if the refrigerator is plugged in and receiving power.',
      'Verify the temperature controls are set correctly.',
      'Ensure vents inside the refrigerator are not blocked by food items.',
      'Clean the condenser coils located at the bottom or back of the unit.',
      'Check if the evaporator fan is running.',
      'Inspect the door gaskets for proper sealing.'
    ],
  },
  'dishwasher': {
    'not draining': [
      'Remove and clean the drain filter at the bottom of the dishwasher.',
      'Check for clogs in the drain hose.',
      'Ensure the air gap (if present) is not blocked.',
      'Verify the garbage disposal (if connected) is clear and working.',
      'Inspect the drain pump for proper operation.',
      'Check for kinks in the drain line.'
    ],
    'dishes not clean': [
      'Check and clean the spray arms for any clogs.',
      'Ensure proper loading of dishes without overcrowding.',
      'Verify water temperature is hot enough (120-125°F or 49-52°C).',
      'Check and clean the filter system.',
      'Use the appropriate amount and type of detergent.',
      'Inspect water inlet valve for proper flow.'
    ],
  },
};

// Function to get installation steps for a part
export async function getPartInstallationSteps(partNumber: string): Promise<{ steps: string[] }> {
  try {
    // First try to get the part from the vector database
    const searchRequest = {
      query: '',
      partNumber: partNumber,
      limit: 1,
    };
    
    const { products } = await searchProductsInVectorDb(searchRequest);
    
    // If product found in vector DB and has installation steps
    if (products.length > 0 && products[0].installationSteps && products[0].installationSteps.length > 0) {
      console.log(`Found installation steps for part ${partNumber} in vector DB`);
      return { steps: products[0].installationSteps };
    }
    
    // Fallback to sample data if not found in vector DB
    const sampleSteps = SAMPLE_INSTALLATION_STEPS[partNumber] || [];
    if (sampleSteps.length > 0) {
      console.log(`Found installation steps for part ${partNumber} in sample data`);
      return { steps: sampleSteps };
    }
    
    // No steps found anywhere
    console.log(`No installation steps found for part ${partNumber}`);
    return { steps: [] };
  } catch (error) {
    console.error(`Error getting installation steps for part ${partNumber}:`, error);
    return { steps: [] };
  }
}

// Function to check if a part is compatible with a model
export async function checkCompatibility(
  partNumberOrDescription: string, 
  modelNumber: string
): Promise<{ compatible: boolean, details?: string }> {
  try {
    // Use the description as a search query rather than an exact part number
    const searchRequest = {
      query: `${partNumberOrDescription} ${modelNumber}`,
      modelNumber: modelNumber,
      // Don't filter by part number directly if it's not in the right format
      partNumber: partNumberOrDescription.match(/^[A-Z0-9\-]+$/) ? partNumberOrDescription : undefined,
      limit: 5, // Increase to find more potential matches
    };
    
    const { products } = await searchProductsInVectorDb(searchRequest);
    
    if (products.length === 0) {
      return { 
        compatible: false, 
        details: `No compatibility information found for part ${partNumberOrDescription} with model ${modelNumber}.` 
      };
    }
    
    // Check all returned products for compatibility
    const compatibleProducts = products.filter(product => 
      product.compatibleModels?.some(model => 
        model.toLowerCase() === modelNumber.toLowerCase()
      )
    );
    
    if (compatibleProducts.length > 0) {
      const product = compatibleProducts[0];
      return {
        compatible: true,
        details: `Part ${product.partNumber} (${product.name}) is compatible with model ${modelNumber}.`
      };
    } else {
      const product = products[0];
      return {
        compatible: false,
        details: `Part ${product.partNumber} (${product.name}) is NOT compatible with model ${modelNumber}.`
      };
    }
  } catch (error) {
    console.error('Error checking compatibility:', error);
    return { 
      compatible: false, 
      details: 'An error occurred while checking compatibility.' 
    };
  }
}

// Function to get troubleshooting tips
export async function getTroubleshootingTips(
  issue: string,
  applianceType: string,
  modelNumber?: string
): Promise<{ tips: string[] }> {
  try {
    // First try to find products that might address this issue
    const searchRequest = {
      query: `${applianceType} ${issue}`,
      category: applianceType.toLowerCase(),
      limit: 3,
    };
    
    const { products } = await searchProductsInVectorDb(searchRequest);
    
    // If relevant products found with troubleshooting tips
    const allTips: string[] = [];
    for (const product of products) {
      if (product.troubleshootingTips && product.troubleshootingTips.length > 0) {
        allTips.push(...product.troubleshootingTips);
      }
    }
    
    if (allTips.length > 0) {
      console.log(`Found ${allTips.length} troubleshooting tips in product data`);
      return { tips: allTips };
    }
    
    // Fallback to sample data
    const type = applianceType.toLowerCase();
    const appliance = SAMPLE_TROUBLESHOOTING_TIPS[type];
    
    if (!appliance) {
      return { tips: [] };
    }
    
    // Find the most relevant issue
    let bestMatch = '';
    let bestScore = 0;
    
    for (const key in appliance) {
      const score = calculateSimilarity(issue.toLowerCase(), key.toLowerCase());
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    }
    
    // Only return if we have a decent match
    if (bestScore > 0.3 && bestMatch) {
      return { tips: appliance[bestMatch] };
    }
    
    return { tips: [] };
  } catch (error) {
    console.error('Error getting troubleshooting tips:', error);
    return { tips: [] };
  }
}

// Simple string similarity function (Jaccard index)
function calculateSimilarity(a: string, b: string): number {
  // For a real app, use a proper string similarity algorithm like Levenshtein
  const setA = new Set(a.split(' '));
  const setB = new Set(b.split(' '));
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}