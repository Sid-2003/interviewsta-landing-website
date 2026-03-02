// export class AudioMetricsExtractor {
//   constructor(stream, metricsInterval = 100) {
//     this.audioContext = new AudioContext({ sampleRate: 16000 });
//     this.analyser = this.audioContext.createAnalyser();
//     this.analyser.fftSize = 2048;
//     this.analyser.smoothingTimeConstant = 0.3;
    
//     this.source = this.audioContext.createMediaStreamSource(stream);
//     this.source.connect(this.analyser);
    
//     this.bufferLength = this.analyser.frequencyBinCount;
//     this.dataArray = new Uint8Array(this.bufferLength);
//     this.timeDataArray = new Uint8Array(this.bufferLength);
    
//     // For noise floor estimation
//     this.noiseFloorSamples = [];
//     this.noiseFloorWindowSize = 50; // Rolling window for noise floor
    
//     // TIME-BASED CALIBRATION (works with any interval)
//     this.isCalibrating = true;
//     this.calibrationStartTime = Date.now();
//     this.metricsInterval = metricsInterval;
    
//     // Calculate adaptive calibration settings
//     const targetSamples = 10; // Aim to collect 10 samples
//     this.calibrationDuration = metricsInterval * targetSamples; // e.g., 100ms * 10 = 1s
//     this.minCalibrationSamples = Math.max(2, Math.floor(targetSamples * 0.5)); // At least 50% of target
//     this.maxCalibrationDuration = 15000; // Force complete after 15 seconds
    
//     console.log(`AudioMetricsExtractor initialized:
//       - Metrics interval: ${metricsInterval}ms
//       - Calibration duration: ${this.calibrationDuration}ms
//       - Min samples needed: ${this.minCalibrationSamples}
//       - Max calibration: ${this.maxCalibrationDuration}ms`);
//   }

//   // Calculate RMS (Root Mean Square) energy
//   calculateRMS() {
//     this.analyser.getByteTimeDomainData(this.timeDataArray);
    
//     let sum = 0;
//     for (let i = 0; i < this.timeDataArray.length; i++) {
//       const normalized = (this.timeDataArray[i] - 128) / 128;
//       sum += normalized * normalized;
//     }
    
//     const rms = Math.sqrt(sum / this.timeDataArray.length);
//     return Math.min(1, rms * 2); // Normalize to 0-1
//   }

//   // Calculate frequency centroid (weighted average frequency)
//   calculateFrequencyCentroid() {
//     this.analyser.getByteFrequencyData(this.dataArray);
    
//     let weightedSum = 0;
//     let magnitudeSum = 0;
    
//     const nyquist = this.audioContext.sampleRate / 2;
//     const frequencyStep = nyquist / this.bufferLength;
    
//     for (let i = 0; i < this.bufferLength; i++) {
//       const magnitude = this.dataArray[i];
//       const frequency = i * frequencyStep;
      
//       weightedSum += frequency * magnitude;
//       magnitudeSum += magnitude;
//     }
    
//     return magnitudeSum > 0 ? Math.round(weightedSum / magnitudeSum) : 0;
//   }

//   // Calculate zero-crossing rate
//   calculateZeroCrossingRate() {
//     this.analyser.getByteTimeDomainData(this.timeDataArray);
    
//     let crossings = 0; 
//     for (let i = 1; i < this.timeDataArray.length; i++) {
//       if (
//         (this.timeDataArray[i] >= 128 && this.timeDataArray[i - 1] < 128) ||
//         (this.timeDataArray[i] < 128 && this.timeDataArray[i - 1] >= 128)
//       ) {
//         crossings++;
//       }
//     }
    
//     return crossings;
//   }

//   // Estimate SNR (Signal-to-Noise Ratio) - TIME-BASED CALIBRATION
//   calculateSNR(currentRMS) {
//     const now = Date.now();
//     const calibrationElapsed = now - this.calibrationStartTime;
    
//     // During calibration period
//     if (this.isCalibrating) {
//       this.noiseFloorSamples.push(currentRMS);
      
//       // Log calibration progress (optional - comment out for production)
//       if (this.noiseFloorSamples.length % 5 === 0) {
//         console.log(`Calibration progress: ${(calibrationElapsed/1000).toFixed(1)}s, ${this.noiseFloorSamples.length} samples`);
//       }
      
//       // Check completion conditions
//       const timeComplete = calibrationElapsed >= this.calibrationDuration;
//       const samplesComplete = this.noiseFloorSamples.length >= this.minCalibrationSamples;
//       const forceComplete = calibrationElapsed >= this.maxCalibrationDuration;
      
//       if ((timeComplete && samplesComplete) || forceComplete) {
//         this.isCalibrating = false;
        
//         // Handle edge case: no samples collected
//         if (this.noiseFloorSamples.length === 0) {
//           console.warn("⚠️ No calibration samples collected, using default noise floor");
//           this.noiseFloorSamples = [0.01];
//           return null;
//         }
        
//         // Calculate noise floor from collected samples
//         const sorted = [...this.noiseFloorSamples].sort((a, b) => a - b);
        
//         // Use different percentiles based on sample count
//         let noiseFloorIndex;
//         if (sorted.length < 5) {
//           noiseFloorIndex = Math.floor(sorted.length * 0.5); // Median for few samples
//         } else {
//           noiseFloorIndex = Math.floor(sorted.length * 0.25); // 25th percentile
//         }
        
//         const noiseFloor = sorted[noiseFloorIndex];
        
//         // Store baseline noise floor (ensure it's never zero)
//         this.noiseFloorSamples = [Math.max(0.001, noiseFloor)];
        
//         console.log(`✓ Calibration complete!
//           - Duration: ${(calibrationElapsed/1000).toFixed(2)}s
//           - Samples: ${sorted.length}
//           - Noise floor: ${noiseFloor.toFixed(4)}
//           - Method: ${forceComplete ? 'forced' : 'normal'}`);
//       }
      
//       return null; // No SNR during calibration
//     }
    
//     // After calibration - maintain rolling window of noise estimates
//     if (currentRMS < 0.1) { // Likely silence/noise
//       this.noiseFloorSamples.push(currentRMS);
//       if (this.noiseFloorSamples.length > this.noiseFloorWindowSize) {
//         this.noiseFloorSamples.shift();
//       }
//     }
    
//     // Calculate average noise floor
//     const noiseFloor = this.noiseFloorSamples.length > 0
//       ? this.noiseFloorSamples.reduce((a, b) => a + b) / this.noiseFloorSamples.length
//       : 0.001;
    
//     // Ensure noise floor is never too small
//     const effectiveNoiseFloor = Math.max(0.001, noiseFloor);
    
//     // Calculate SNR
//     const snrLinear = currentRMS / effectiveNoiseFloor;
    
//     // Handle case where signal is weaker than noise
//     if (snrLinear < 1.0) {
//       return 0; // 0 dB means signal equals noise
//     }
    
//     const snrDB = 20 * Math.log10(snrLinear);
    
//     // Clamp to reasonable range (0-60 dB)
//     return Math.max(0, Math.min(60, snrDB));
//   }

//   // Get all metrics at once
//   getMetrics(vadState) {
//     const rms = this.calculateRMS();
//     const snr = this.calculateSNR(rms);
    
//     return {
//       rms_energy: parseFloat(rms.toFixed(3)),
//       frequency_centroid: this.calculateFrequencyCentroid(),
//       snr_db: snr !== null ? parseFloat(snr.toFixed(2)) : null,
//       zero_crossing_rate: this.calculateZeroCrossingRate(),
//       is_speech_detected: vadState.isSpeaking,
//       vad_confidence: vadState.confidence || 0,
//       is_calibrating: this.isCalibrating
//     };
//   }

//   destroy() {
//     if (this.source) {
//       this.source.disconnect();
//     }
//     if (this.audioContext) {
//       this.audioContext.close();
//     }
//     console.log("AudioMetricsExtractor destroyed");
//   }
// }





export class AudioMetricsExtractor {
  constructor(stream, metricsInterval = 100) {
    this.audioContext = new AudioContext({ sampleRate: 16000 });
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.0; // No smoothing for accurate noise profiling
    
    this.source = this.audioContext.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
    
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.timeDataArray = new Uint8Array(this.bufferLength);
    
    // Frequency band definitions for noise characterization
    this.nyquist = this.audioContext.sampleRate / 2;
    this.frequencyStep = this.nyquist / this.bufferLength;
    
    // Define frequency bands (Hz ranges)
    this.bands = {
      lowRumble: { min: 0, max: 200, name: 'Low Rumble' },        // HVAC, traffic
      midNoise: { min: 200, max: 1000, name: 'Mid Noise' },       // General ambient
      speech: { min: 1000, max: 3000, name: 'Speech Range' },     // Human voice
      highHiss: { min: 3000, max: 8000, name: 'High Hiss' }       // Electronics, air
    };
    
    // Calculate bin ranges for each band
    this.bandBins = {};
    for (const [key, band] of Object.entries(this.bands)) {
      this.bandBins[key] = {
        start: Math.floor(band.min / this.frequencyStep),
        end: Math.min(Math.ceil(band.max / this.frequencyStep), this.bufferLength - 1),
        ...band
      };
    }
    
    // Calibration state
    this.isCalibrating = true;
    this.calibrationStartTime = Date.now();
    this.metricsInterval = metricsInterval;
    
    // Time-based calibration settings
    const targetSamples = 100; // 10 seconds worth at 100ms interval
    this.calibrationDuration = metricsInterval * targetSamples;
    this.minCalibrationSamples = Math.max(20, Math.floor(targetSamples * 0.2));
    this.maxCalibrationDuration = 15000;
    
    // Store calibration samples for noise profiling
    this.calibrationSamples = {
      rms: [],
      bandEnergies: { lowRumble: [], midNoise: [], speech: [], highHiss: [] },
      centroids: [],
      rmsVariances: [] // Track variance for temporal consistency
    };
    
    // Baseline noise profile (set after calibration)
    this.noiseProfile = null;
    
    // Rolling window for adaptive noise tracking
    this.noiseFloorWindow = [];
    this.noiseFloorWindowSize = 50;
    
    console.log(`AudioMetricsExtractor initialized:
      - Metrics interval: ${metricsInterval}ms
      - Calibration duration: ${this.calibrationDuration}ms (${targetSamples} samples)
      - Min samples needed: ${this.minCalibrationSamples}
      - Frequency resolution: ${this.frequencyStep.toFixed(2)} Hz/bin
      - Band bins calculated: ${Object.keys(this.bandBins).length} bands`);
  }

  // Calculate RMS (Root Mean Square) energy
  calculateRMS() {
    this.analyser.getByteTimeDomainData(this.timeDataArray);
    
    let sum = 0;
    for (let i = 0; i < this.timeDataArray.length; i++) {
      const normalized = (this.timeDataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    
    const rms = Math.sqrt(sum / this.timeDataArray.length);
    return Math.min(1, rms * 2);
  }

  // Calculate energy in specific frequency bands
  calculateBandEnergies() {
    this.analyser.getByteFrequencyData(this.dataArray);
    
    const energies = {};
    
    for (const [key, band] of Object.entries(this.bandBins)) {
      let sum = 0;
      let count = 0;
      
      for (let i = band.start; i <= band.end; i++) {
        sum += this.dataArray[i];
        count++;
      }
      
      // Normalize to 0-1 range
      energies[key] = count > 0 ? (sum / count) / 255 : 0;
    }
    
    return energies;
  }

  // Calculate frequency centroid (weighted average frequency)
  calculateFrequencyCentroid() {
    this.analyser.getByteFrequencyData(this.dataArray);
    
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < this.bufferLength; i++) {
      const magnitude = this.dataArray[i];
      const frequency = i * this.frequencyStep;
      
      weightedSum += frequency * magnitude;
      magnitudeSum += magnitude;
    }
    
    return magnitudeSum > 0 ? Math.round(weightedSum / magnitudeSum) : 0;
  }

  // Calculate zero-crossing rate
  calculateZeroCrossingRate() {
    this.analyser.getByteTimeDomainData(this.timeDataArray);
    
    let crossings = 0;
    for (let i = 1; i < this.timeDataArray.length; i++) {
      if (
        (this.timeDataArray[i] >= 128 && this.timeDataArray[i - 1] < 128) ||
        (this.timeDataArray[i] < 128 && this.timeDataArray[i - 1] >= 128)
      ) {
        crossings++;
      }
    }
    
    return crossings;
  }

  // Calculate variance for temporal consistency analysis
  calculateVariance(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  // Calibration logic - build noise profile
  updateCalibration(rms, bandEnergies, centroid) {
    const now = Date.now();
    const calibrationElapsed = now - this.calibrationStartTime;
    
    // Store calibration samples
    this.calibrationSamples.rms.push(rms);
    this.calibrationSamples.centroids.push(centroid);
    
    for (const [band, energy] of Object.entries(bandEnergies)) {
      this.calibrationSamples.bandEnergies[band].push(energy);
    }
    
    // Log progress every 1 second
    if (this.calibrationSamples.rms.length % (1000 / this.metricsInterval) === 0) {
      console.log(`Calibration: ${(calibrationElapsed/1000).toFixed(1)}s, ${this.calibrationSamples.rms.length} samples`);
    }
    
    // Check completion conditions
    const timeComplete = calibrationElapsed >= this.calibrationDuration;
    const samplesComplete = this.calibrationSamples.rms.length >= this.minCalibrationSamples;
    const forceComplete = calibrationElapsed >= this.maxCalibrationDuration;
    
    if ((timeComplete && samplesComplete) || forceComplete) {
      this.finalizeCalibration();
    }
  }

  // Finalize calibration and create noise profile
  finalizeCalibration() {
    this.isCalibrating = false;
    
    const samples = this.calibrationSamples;
    
    if (samples.rms.length === 0) {
      console.warn("⚠️ No calibration samples collected, using defaults");
      this.noiseProfile = this.getDefaultNoiseProfile();
      return;
    }
    
    // Calculate baseline noise characteristics
    const sortedRMS = [...samples.rms].sort((a, b) => a - b);
    const noiseFloorRMS = sortedRMS[Math.floor(sortedRMS.length * 0.25)]; // 25th percentile
    
    // Calculate spectral shape (average energy distribution across bands)
    const spectralShape = {};
    for (const [band, energies] of Object.entries(samples.bandEnergies)) {
      const sorted = [...energies].sort((a, b) => a - b);
      spectralShape[band] = {
        baseline: sorted[Math.floor(sorted.length * 0.25)],
        median: sorted[Math.floor(sorted.length * 0.5)],
        mean: energies.reduce((a, b) => a + b, 0) / energies.length,
        stdDev: this.calculateVariance(energies)
      };
    }
    
    // Calculate temporal consistency
    const rmsVariance = this.calculateVariance(samples.rms);
    const centroidVariance = this.calculateVariance(samples.centroids);
    
    this.noiseProfile = {
      rmsFloor: Math.max(0.001, noiseFloorRMS),
      rmsVariance,
      spectralShape,
      centroidMean: samples.centroids.reduce((a, b) => a + b, 0) / samples.centroids.length,
      centroidVariance,
      sampleCount: samples.rms.length
    };
    
    // Initialize rolling window with baseline
    this.noiseFloorWindow = [noiseFloorRMS];
    
    console.log(`✓ Calibration complete!
      - Samples: ${samples.rms.length}
      - Noise floor (RMS): ${noiseFloorRMS.toFixed(4)}
      - RMS variance: ${rmsVariance.toFixed(4)}
      - Spectral profile:`, spectralShape);
  }

  // Default noise profile fallback
  getDefaultNoiseProfile() {
    return {
      rmsFloor: 0.01,
      rmsVariance: 0.005,
      spectralShape: {
        lowRumble: { baseline: 0.02, median: 0.03, mean: 0.03, stdDev: 0.01 },
        midNoise: { baseline: 0.02, median: 0.03, mean: 0.03, stdDev: 0.01 },
        speech: { baseline: 0.01, median: 0.02, mean: 0.02, stdDev: 0.01 },
        highHiss: { baseline: 0.01, median: 0.02, mean: 0.02, stdDev: 0.01 }
      },
      centroidMean: 1000,
      centroidVariance: 500,
      sampleCount: 0
    };
  }

  // Classify noise characteristics
  classifyNoise(rms, bandEnergies, centroid) {
    if (!this.noiseProfile) {
      return { type: 'unknown', confidence: 0, details: {} };
    }
    
    const profile = this.noiseProfile;
    
    // Calculate adaptive thresholds based on noise profile
    const rmsThreshold = profile.rmsFloor + (2 * profile.rmsVariance);
    
    // Check if current audio matches background noise profile
    let spectralMatchScore = 0;
    let spectralDetails = {};
    
    for (const [band, energy] of Object.entries(bandEnergies)) {
      const bandProfile = profile.spectralShape[band];
      const threshold = bandProfile.baseline + (2 * bandProfile.stdDev);
      const deviation = Math.abs(energy - bandProfile.mean);
      
      // Normalized deviation (0 = perfect match, 1 = far from baseline)
      const normalizedDev = Math.min(1, deviation / Math.max(0.01, bandProfile.stdDev));
      spectralMatchScore += (1 - normalizedDev);
      
      spectralDetails[band] = {
        current: energy.toFixed(3),
        baseline: bandProfile.baseline.toFixed(3),
        isElevated: energy > threshold
      };
    }
    
    spectralMatchScore /= Object.keys(bandEnergies).length;
    
    // Determine noise type based on spectral characteristics
    let noiseType = 'silence';
    let confidence = 0;
    
    if (rms < rmsThreshold) {
      // Matches background noise level
      if (spectralMatchScore > 0.7) {
        noiseType = 'background_noise';
        confidence = spectralMatchScore;
      } else if (bandEnergies.lowRumble > 0.1) {
        noiseType = 'low_frequency_rumble'; // HVAC, traffic
        confidence = bandEnergies.lowRumble;
      } else if (bandEnergies.highHiss > 0.1) {
        noiseType = 'high_frequency_hiss'; // Electronics, air
        confidence = bandEnergies.highHiss;
      } else {
        noiseType = 'silence';
        confidence = 1 - rms;
      }
    } else {
      // Above noise floor - likely speech or transient sound
      if (bandEnergies.speech > bandEnergies.lowRumble && bandEnergies.speech > bandEnergies.highHiss) {
        noiseType = 'speech_or_voice';
        confidence = bandEnergies.speech;
      } else {
        noiseType = 'transient_sound';
        confidence = rms;
      }
    }
    
    return {
      type: noiseType,
      confidence: parseFloat(confidence.toFixed(3)),
      details: {
        rmsVsThreshold: `${rms.toFixed(3)} / ${rmsThreshold.toFixed(3)}`,
        spectralMatch: spectralMatchScore.toFixed(3),
        bands: spectralDetails
      }
    };
  }

  // Calculate SNR with adaptive noise floor
  calculateSNR(currentRMS) {
    if (!this.noiseProfile) {
      return null; // Still calibrating
    }
    
    // Update rolling noise floor window for low-energy frames
    if (currentRMS < 0.1) {
      this.noiseFloorWindow.push(currentRMS);
      if (this.noiseFloorWindow.length > this.noiseFloorWindowSize) {
        this.noiseFloorWindow.shift();
      }
    }
    
    // Calculate current noise floor estimate
    const noiseFloor = this.noiseFloorWindow.length > 0
      ? this.noiseFloorWindow.reduce((a, b) => a + b) / this.noiseFloorWindow.length
      : this.noiseProfile.rmsFloor;
    
    const effectiveNoiseFloor = Math.max(0.001, noiseFloor);
    const snrLinear = currentRMS / effectiveNoiseFloor;
    
    if (snrLinear < 1.0) return 0;
    
    const snrDB = 20 * Math.log10(snrLinear);
    return Math.max(0, Math.min(60, snrDB));
  }

  // Get comprehensive metrics
  getMetrics(vadState) {
    const rms = this.calculateRMS();
    const bandEnergies = this.calculateBandEnergies();
    const centroid = this.calculateFrequencyCentroid();
    
    // During calibration, just collect data
    if (this.isCalibrating) {
      this.updateCalibration(rms, bandEnergies, centroid);
      
      return {
        rms_energy: parseFloat(rms.toFixed(3)),
        frequency_centroid: centroid,
        band_energies: bandEnergies,
        snr_db: null,
        zero_crossing_rate: this.calculateZeroCrossingRate(),
        noise_classification: { type: 'calibrating', confidence: 0 },
        is_speech_detected: vadState?.isSpeaking || false,
        vad_confidence: vadState?.confidence || 0,
        is_calibrating: true
      };
    }
    
    // Post-calibration - full analysis
    const noiseClassification = this.classifyNoise(rms, bandEnergies, centroid);
    const snr = this.calculateSNR(rms);
    
    return {
      rms_energy: parseFloat(rms.toFixed(3)),
      frequency_centroid: centroid,
      band_energies: bandEnergies,
      snr_db: snr !== null ? parseFloat(snr.toFixed(2)) : null,
      zero_crossing_rate: this.calculateZeroCrossingRate(),
      noise_classification: noiseClassification,
      is_speech_detected: vadState?.isSpeaking || false,
      vad_confidence: vadState?.confidence || 0,
      is_calibrating: false
    };
  }

  // Get current noise profile for inspection
  getNoiseProfile() {
    return this.noiseProfile;
  }

  destroy() {
    if (this.source) {
      this.source.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    console.log("AudioMetricsExtractor destroyed");
  }
}
