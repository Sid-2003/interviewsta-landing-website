import React from 'react';
import ComingSoonOverlay from './ComingSoonOverlay';

const TryMesh = () => {
  return (
    <ComingSoonOverlay>
        <div className="p-4 space-y-3">
            <h2 className="font-semibold text-gray-900">Study Plans</h2>
            <div className="text-sm text-gray-500">Progress tracking for your upcoming modules</div>
            {/* other tile elements */}
        </div>
    </ComingSoonOverlay>

  )
}

export default TryMesh