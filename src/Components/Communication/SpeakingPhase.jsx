import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, MicOff, Send, Square } from 'lucide-react';

const TARGET_SAMPLE_RATE = 16000;

/**
 * Convert MediaRecorder blob (webm/opus) to proper WAV with RIFF header, 16kHz mono,
 * matching the format sent by InterviewInterface (VAD path).
 */
async function blobToWavBase64(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
  const channel = audioBuffer.numberOfChannels > 0 ? audioBuffer.getChannelData(0) : new Float32Array(0);
  const sourceRate = audioBuffer.sampleRate;

  let float32 = channel;
  if (sourceRate !== TARGET_SAMPLE_RATE) {
    const ratio = sourceRate / TARGET_SAMPLE_RATE;
    const newLength = Math.round(channel.length / ratio);
    float32 = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const idx = Math.floor(srcIndex);
      const frac = srcIndex - idx;
      const next = Math.min(idx + 1, channel.length - 1);
      float32[i] = channel[idx] * (1 - frac) + channel[next] * frac;
    }
  }

  const numSamples = float32.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, TARGET_SAMPLE_RATE, true);
  view.setUint32(28, TARGET_SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  const wavBlob = new Blob([buffer], { type: 'audio/wav' });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result.split(',')[1];
      resolve(b64 || '');
    };
    reader.onerror = () => reject(new Error('Failed to read WAV'));
    reader.readAsDataURL(wavBlob);
  });
}

const SpeakingPhase = ({ instruction, paragraph, onSpeakingSubmit, onSendResponse, isRecording, setIsRecording, isProcessing, feedback }) => {
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        setRecordedAudio(new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!recordedAudio) {
      alert('Please record your speaking first.');
      return;
    }
    if (!onSendResponse) {
      alert('Connection error. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const base64Wav = await blobToWavBase64(recordedAudio);
      if (!base64Wav) {
        alert('Failed to prepare audio. Please try again.');
        return;
      }
      onSendResponse({ audioData: base64Wav, sampleRate: TARGET_SAMPLE_RATE });
      if (onSpeakingSubmit) onSpeakingSubmit();
      setIsAnalyzing(true);
      setRecordedAudio(null);
    } catch (error) {
      console.error('Error submitting speaking:', error);
      alert('Error preparing or submitting audio. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-4 border-2 border-green-200"
    >
      <div className="bg-white rounded-lg p-6 border-2 border-green-300 shadow-sm mb-4">
        <div className="flex items-center space-x-2 mb-4">
          <Volume2 className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold text-gray-900">Paragraph to Speak</h4>
        </div>
        {paragraph && (
          <p className="text-gray-800 leading-relaxed text-lg">{paragraph}</p>
        )}
        {!paragraph && (
          <p className="text-gray-500 italic">Waiting for paragraph...</p>
        )}
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
        <p className="text-sm text-gray-600 mb-4">
          <strong>Instructions:</strong> Please read the paragraph above and speak it word for word using the record button below.
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Mic className="h-5 w-5" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Square className="h-5 w-5" />
              <span>Stop Recording</span>
            </button>
          )}
          
          {recordedAudio && !isRecording && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Speaking'}</span>
            </button>
          )}
        </div>
        
        {isRecording && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Recording...</span>
          </div>
        )}
        
        {recordedAudio && !isRecording && !isAnalyzing && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600 font-medium">✓ Recording complete. Click Submit to send.</p>
          </div>
        )}
        
        {(isAnalyzing || isProcessing) && !feedback && (
          <div className="mt-4 flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-blue-600 font-medium">Analyzing your speaking...</span>
            </div>
            <p className="text-xs text-gray-500">Please wait while we process your submission</p>
          </div>
        )}
        
        {/* Feedback Section - Only show if feedback exists and it's not the paragraph instruction */}
        {feedback && !feedback.includes("Please read the following paragraph") && !feedback.includes(paragraph || "") && (
          <div className="mt-4 bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <h5 className="font-semibold text-blue-900">Feedback</h5>
            </div>
            <p className="text-gray-800 leading-relaxed">{feedback}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SpeakingPhase;
