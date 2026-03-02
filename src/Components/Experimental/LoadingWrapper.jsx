import React, { useState, useEffect } from 'react';

const LoadingWrapper = ({ children, isLoading }) => {
    return (
      <div className="space-y-4">
        {isLoading ? (
          // Only target the text spans, not the entire container
          <div className="space-y-2">
            <span className="relative inline-block">
                <span className="invisible">{children}</span>
                <span className="absolute inset-0 bg-gray-200 animate-pulse"></span>
            </span>

            
            <br />

          </div>
        ) : (
          <div className="animate-fade-in">
            {children}
          </div>
        )}
      </div>
    );
  };
  

// Usage
// const MyComponent = () => {
//   const [isLoading, setIsLoading] = useState(true);
  
//   useEffect(() => {
//     setTimeout(() => setIsLoading(false), 3000);
//   }, []);

//   return (
//     <LoadingWrapper isLoading={isLoading} animationType="shimmer">
//       <div className="p-4 bg-white rounded-lg shadow">
//         <h3 className="text-xl font-bold">Content Title</h3>
//         <p>This content will be wrapped with loading animation</p>
//       </div>
//     </LoadingWrapper>
//   );
// };

export default LoadingWrapper;