import React from 'react';

const AudioQualityIndicator = ({ metrics }) => {
  if (!metrics) return null;
  
  const getQualityStatus = () => {
    if (metrics.is_calibrating) {
      return { 
        color: 'bg-yellow-500', 
        text: 'Calibrating...', 
        icon: '🔄' 
      };
    }
    
    if (metrics.snr_db === null) {
      return { 
        color: 'bg-gray-500', 
        text: 'Initializing', 
        icon: '⏳' 
      };
    }
    
    if (metrics.rms_energy < 0.05) {
      return { 
        color: 'bg-red-500', 
        text: 'Very Low Volume', 
        icon: '🔇' 
      };
    }
    
    if (metrics.snr_db < 10) {
      return { 
        color: 'bg-orange-500', 
        text: 'Noisy Environment', 
        icon: '⚠️' 
      };
    }
    
    if (metrics.rms_energy > 0.15 && metrics.snr_db > 15) {
      return { 
        color: 'bg-green-500', 
        text: 'Good Quality', 
        icon: '✓' 
      };
    }
    
    return { 
      color: 'bg-blue-500', 
      text: 'Fair Quality', 
      icon: 'ℹ️' 
    };
  };
  
  const status = getQualityStatus();
  
  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${status.color} animate-pulse`}></div>
      <span className="text-gray-700 font-medium">{status.text}</span>
      {!metrics.is_calibrating && metrics.snr_db !== null && (
        <span className="text-gray-500">
          (Vol: {metrics.rms_energy.toFixed(2)} / SNR: {metrics.snr_db.toFixed(1)}dB)
        </span>
      )}
    </div>
  );
};

export default AudioQualityIndicator;
