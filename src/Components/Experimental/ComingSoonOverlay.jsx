import React from "react";
import { Lock } from "lucide-react";

const ComingSoonOverlay = ({ children }) => {
  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-not-allowed">
      {/* Tile content */}
      <div className="opacity-60">
        {children}
      </div>

      {/* Muted overlay with lock icon */}
      <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Lock className="h-4 w-4 text-gray-500" />
          </div>
          <span className="text-xs text-gray-500 font-medium">Unlock Soon</span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonOverlay;
