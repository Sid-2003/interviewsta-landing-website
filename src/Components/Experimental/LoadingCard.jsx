import React, { useState, useEffect } from 'react';

const LoadingCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    title: "Beautiful Mountain View",
    description: "A stunning landscape photograph showcasing the natural beauty of mountain ranges during golden hour.",
    author: "John Photographer",
    date: "Sept 8, 2025"
  });

  useEffect(() => {
    // Simulate data loading with timeout
    const timer = setTimeout(() => {
      setData({
        title: "Beautiful Mountain View",
        description: "A stunning landscape photograph showcasing the natural beauty of mountain ranges during golden hour.",
        author: "John Photographer",
        date: "Sept 8, 2025"
      });
      setIsLoading(false);
    }, 3000); // 3 second loading simulation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48">
        {isLoading ? (
        //   <div className="absolute inset-0 bg-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
        //   </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold animate-fade-in">
            📸 Image Loaded
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {isLoading ? (
          // Skeleton Loading State
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ) : (
          // Actual Content with Fade-in Animation
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{data.title}</h3>
            <p className="text-gray-600 mb-4">{data.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {data.author}</span>
              <span>{data.date}</span>
            </div>
          </div>
        )}
      </div>

      {/* Reload Button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => {
            setIsLoading(true);
            setData(null);
            setTimeout(() => {
              setData({
                title: "New Content Loaded",
                description: "This demonstrates the smooth loading transition with fresh data.",
                author: "Demo User",
                date: new Date().toLocaleDateString()
              });
              setIsLoading(false);
            }, 2000);
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Reload Data
        </button>
      </div>
    </div>
  );
};

export default LoadingCard;
