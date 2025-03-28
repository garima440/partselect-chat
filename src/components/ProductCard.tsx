import React, { useState } from 'react';
import { ProductResult } from '@/lib/types';

interface ProductCardProps {
  product: ProductResult;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image with hover effect */}
      <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`h-full w-auto object-contain transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            No image available
          </div>
        )}
        
        {/* Discount badge with animation */}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-md animate-pulse opacity-50"></div>
              <div className="bg-yellow-500 text-gray-900 px-2 py-1 text-xs font-bold rounded-md relative">
                {product.discount}% OFF
              </div>
            </div>
          </div>
        )}
        
        {/* Part number badge */}
        <div className="absolute bottom-2 left-2 bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-md">
          Part #: {product.partNumber}
        </div>
      </div>
      
      {/* Product info */}
      <div className="flex flex-col p-4 flex-grow">
        <div className="mb-2 flex-grow">
          <h3 className="text-sm font-medium line-clamp-2 text-gray-900" title={product.name}>
            {product.name}
          </h3>
          
          {/* Compatible models */}
          {product.compatibleModels && product.compatibleModels.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Compatible with: 
              <span className="ml-1 font-medium">
                {product.compatibleModels.slice(0, 2).join(", ")}
                {product.compatibleModels.length > 2 && (
                  <span className="relative inline-block ml-1 group">
                    <span className="text-teal-600 cursor-pointer">+{product.compatibleModels.length - 2} more</span>
                    <div className="absolute left-0 bottom-full mb-2 w-48 bg-white shadow-lg rounded-md p-2 text-xs invisible group-hover:visible z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      {product.compatibleModels.slice(2).join(", ")}
                    </div>
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
        
        {/* Price area with animation */}
        <div className="mt-1 mb-2">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.originalPrice > product.price && (
              <span className="ml-2 text-xs font-medium text-green-600">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        {/* Stock status with indicator */}
        <div className="mt-1 mb-3 flex items-center">
          {product.inStock ? (
            <div className="flex items-center">
              <span className="relative flex h-3 w-3 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-green-600">
                In Stock
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Out of Stock
            </span>
          )}
          {product.deliveryEstimate && (
            <span className="text-xs text-gray-500 ml-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {product.deliveryEstimate}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <a
            href={`/product/${product.id}`}
            className="flex-1 text-center text-sm py-2 px-3 bg-white border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </a>
          <button
            disabled={!product.inStock}
            className={`flex-1 text-center text-sm py-2 px-3 rounded-md transition flex items-center justify-center
              ${product.inStock 
                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`
            }
          >
            {product.inStock ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Sold Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;