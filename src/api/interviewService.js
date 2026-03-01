/**
 * Interview Service API
 * Handles all interview-related API calls to FastAPI backend
 */
import { fastApiClient, API_CONFIG } from './client';
import { getAuthToken } from '../utils/auth';
import { v4 as uuidv4 } from 'uuid';

/**
 * Start a new interview session
 * @param {Object} params - Interview parameters
 * @param {string} params.interviewType - 'Technical' | 'HR' | 'Company' | 'Subject' | 'CaseStudy'
 * @param {string} params.userId - User ID
 * @param {Object} params.payload - Interview-specific configuration
 * @param {string} params.sessionId - Optional session ID (generated if not provided)
 * @returns {Promise<Object>} { sessionId, taskId, status }
 */


export const startInterview = async ({ interviewType, userId, payload, sessionId }) => {
  try {
    // Generate session ID if not provided
    const finalSessionId = sessionId || uuidv4();
    
    console.log('[FastAPI] Starting interview with:', {
      interview_type: interviewType,
      session_id: finalSessionId,
      user_id: userId,
      payload_keys: Object.keys(payload || {})
    });
    
    const response = await fastApiClient.post('/interview/start', {
      interview_type: interviewType,
      session_id: finalSessionId,  // ← Now included!
      user_id: userId,
      payload: payload || {}
    });

    const { session_id, task_id, status, message } = response.data;
    
    console.log('[FastAPI] Interview started:', { session_id, task_id, status, message });
    
    return {
      sessionId: session_id || finalSessionId,
      taskId: task_id,
      status: status,  // 'pending' | 'queued'
      message: message
    };
  } catch (error) {
    console.error('[FastAPI] Error starting interview:', error);
    
    // Enhanced error handling for 422 validation errors
    if (error.response?.status === 422) {
      const detail = error.response.data?.detail;
      console.error('[FastAPI] Validation error:', detail);
      
      if (Array.isArray(detail)) {
        const errors = detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join('; ');
        throw new Error(`Validation error: ${errors}`);
      }
      throw new Error(detail || 'Invalid request format');
    }
    
    throw new Error(error.response?.data?.detail || 'Failed to start interview');
  }
};


/**
 * Poll status of the start interview task (Celery task from POST /interview/start).
 * @param {string} taskId - Task ID returned from startInterview
 * @returns {Promise<Object>} { status, result, error, progress }
 */
export const getStartTaskStatus = async (taskId) => {
  try {
    const response = await fastApiClient.get(`/interview/start-status/${taskId}`);
    const { status, result, error, progress } = response.data;
    return {
      status: status || 'processing',
      result: result ?? null,
      error: error ?? null,
      progress: progress ?? 0
    };
  } catch (error) {
    console.error('[FastAPI] Error getting start task status:', error);
    throw new Error(error.response?.data?.detail || 'Failed to get start status');
  }
};


/**
 * Poll status of the respond task (Celery task from POST /respond).
 * @param {string} sessionId - Interview session ID
 * @param {string} taskId - Task ID returned from submitResponse
 * @returns {Promise<Object>} { taskId, sessionId, status, result, error }
 *   status: 'queued' | 'processing' | 'completed' | 'failed'
 *   result: when completed, { status, message, last_node } (or null)
 *   error: when failed, string (or null)
 */
export const getRespondTaskStatus = async (sessionId, taskId) => {
  try {
    const response = await fastApiClient.get(
      `/interview/${sessionId}/respond-status/${taskId}`
    );

    // const { task_id, session_id, status, result, error } = response.data;

      return response.data;
  } catch (error) {
    console.error('Error getting respond task status:', error);
    throw new Error(error.response?.data?.detail || 'Failed to get respond task status');
  }
};

/**
 * Post video telemetry for a session (behavioral + Big5).
 * Payload: { type: "video_quality", data: { face, gaze, confidence, nervousness, engagement, distraction, big5_features } }
 * @param {string} sessionId - Interview session ID
 * @param {Object} payload - { type: "video_quality", data: { ... } }
 * @returns {Promise<void>}
 */
export const postVideoTelemetry = async (sessionId, payload) => {
  try {
    await fastApiClient.post(
      `/interview/${sessionId}/video-telemetry`,
      payload
    );
  } catch (error) {
    console.error('Failed to post video telemetry:', error);
    // Don't throw - telemetry failure shouldn't break the interview
  }
};

/**
 * Submit user response (text, audio, or code)
 * @param {Object} params - Response parameters
 * @param {string} params.sessionId - Interview session ID
 * @param {string} params.textResponse - Text response (optional)
 * @param {string} params.audioData - Base64 encoded audio (optional)
 * @param {string} params.codeInput - Code input (optional)
 * @param {number} params.sampleRate - Audio sample rate (optional, default 16000)
 * @returns {Promise<Object>} { taskId, status }
 */
export const submitResponse = async ({
  sessionId,
  textResponse = null,
  audioData = null,
  codeInput = null,
  sampleRate = 16000
}) => {
  try {
    // Build body with only provided fields (e.g. comprehension sends only text_response, not audio/code)
    const body = {};
    if (textResponse != null && textResponse !== '') body.text_response = textResponse;
    if (audioData != null && audioData !== '') body.audio_data = audioData;
    if (codeInput != null && codeInput !== '') body.code_input = codeInput;
    if (body.audio_data && sampleRate != null) body.sample_rate = sampleRate;

    const response = await fastApiClient.post(
      `/interview/${sessionId}/respond`,
      body
    );

    const { task_id, status } = response.data;
    
    return {
      taskId: task_id,
      status: status  // 'processing'
    };
  } catch (error) {
    console.error('Error submitting response:', error);
    throw new Error(error.response?.data?.detail || 'Failed to submit response');
  }
};

/**
 * Poll for interview status
 * @param {string} sessionId - Interview session ID
 * @returns {Promise<Object>} Interview status and AI response
 */
export const pollInterviewStatus = async (sessionId) => {
  try {
    const response = await fastApiClient.get(
      `/interview/${sessionId}/status`
    );

    const { 
      status, 
      ai_response, 
      transcript, 
      is_complete,
      last_node,
      error
    } = response.data;
    
    return {
      status,           // 'waiting' | 'processing' | 'ready' | 'completed'
      aiResponse: ai_response ? {
        message: ai_response.message,
        audioBase64: ai_response.audio_base64,
        questionNumber: ai_response.question_number,
        totalQuestions: ai_response.total_questions,
        lastNode: ai_response.last_node
      } : null,
      transcript: transcript,
      isComplete: is_complete,
      lastNode: last_node,
      error: error
    };
  } catch (error) {
    console.error('Error polling status:', error);
    throw new Error(error.response?.data?.detail || 'Failed to get interview status');
  }
};

/**
 * Connect to Server-Sent Events (SSE) stream for real-time updates
 * @param {string} sessionId - Interview session ID
 * @param {Object} callbacks - Event callbacks
 * @param {Function} callbacks.onStatusUpdate - Called when status changes
 * @param {Function} callbacks.onAIResponse - Called when AI responds
 * @param {Function} callbacks.onTranscript - Called when transcript is ready
 * @param {Function} callbacks.onComplete - Called when interview completes
 * @param {Function} callbacks.onError - Called on error
 * @param {Function} callbacks.onQualityWarning - Called for quality warnings
 * @returns {Object} { close: Function } - Object with close method
 */


export const connectToInterviewStream = async (sessionId, callbacks) => {
  const token = await getAuthToken();
  
  // Note: EventSource doesn't support custom headers in standard implementation
  // Pass token as query parameter for backend authentication
  const baseUrl = API_CONFIG.FASTAPI_BASE_URL || 'http://localhost:8001/api/v1';
  const url = `${baseUrl}/interview/${sessionId}/stream?token=${encodeURIComponent(token)}`;
  
  console.log('[SSE] Connecting to stream:', url.replace(/token=([^&]+)/, 'token=***'));
  
  let eventSource = null;
  let reconnectAttempts = 0;
  let maxReconnectAttempts = 10;
  let reconnectDelay = 1000; // Start with 1 second
  let reconnectTimer = null;
  let isManuallyClosed = false;
  
  // Helper to process AI response data
  const processAIResponse = (data) => {
    // Check for audio in multiple possible field names
    const audioBase64 = data.audio_base64 || data.audio || data.audioBase64;
    const hasAudio = !!audioBase64;
    
    console.log('[SSE] Processing AI response:', { 
      hasMessage: !!data.message, 
      hasAudio: hasAudio,
      audioField: audioBase64 ? (data.audio_base64 ? 'audio_base64' : data.audio ? 'audio' : 'audioBase64') : 'none',
      lastNode: data.last_node 
    });
    
    callbacks.onAIResponse?.({
      message: data.message,
      audioBase64: audioBase64,  // Use the detected audio field
      questionNumber: data.question_number,
      totalQuestions: data.total_questions,
      lastNode: data.last_node
    });
  };
  
  const setupEventHandlers = (es) => {
    // Handle unnamed events (messages with type field)
    es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      console.log('[SSE] Received unnamed message:', data);
      
      // If backend sends the full response directly (status: 'ai_responded')
      if (data.status === 'ai_responded' && data.message) {
        processAIResponse({
          message: data.message,
          audio_base64: data.audio,
          last_node: data.last_node
        });
        return;
      }
      
      // If backend sends messages with type field
      switch (data.type) {
        case 'status':
          callbacks.onStatusUpdate?.(data.status);
          break;
          
        case 'ai_response':
          processAIResponse(data);
          break;
          
        case 'transcription':
          callbacks.onTranscript?.(data.transcript);
          break;
          
        case 'quality_warning':
          callbacks.onQualityWarning?.({
            type: data.warning_type,
            message: data.message
          });
          break;
          
        case 'complete':
          callbacks.onComplete?.(data);
          eventSource.close();
          break;
          
        case 'error':
          callbacks.onError?.(data.message);
          if (data.fatal) {
            eventSource.close();
          }
          break;
          
        default:
          console.log('[SSE] Unknown message type:', data.type);
      }
      } catch (error) {
        console.error('[SSE] Error parsing message:', error, event.data);
      }
    };

    // Handle named SSE events (event: ai_response format)
    es.addEventListener('ai_response', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('[SSE] Received named event "ai_response":', data);
      processAIResponse(data);
      } catch (error) {
        console.error('[SSE] Error parsing ai_response event:', error);
      }
    });

    es.addEventListener('transcription', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('[SSE] Received named event "transcription":', data);
      callbacks.onTranscript?.(data.transcript || data.text);
      } catch (error) {
        console.error('[SSE] Error parsing transcription event:', error);
      }
    });

    es.addEventListener('status', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('[SSE] Received named event "status":', data);
      callbacks.onStatusUpdate?.(data.status);
      } catch (error) {
        console.error('[SSE] Error parsing status event:', error);
      }
    });

    es.addEventListener('complete', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('[SSE] Received named event "complete":', data);
      callbacks.onComplete?.(data);
      eventSource.close();
      } catch (error) {
        console.error('[SSE] Error parsing complete event:', error);
      }
    });

    es.addEventListener('error', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('[SSE] Received named event "error":', data);
      callbacks.onError?.(data.message);
      if (data.fatal) {
        eventSource.close();
      }
      } catch (error) {
        console.error('[SSE] Error parsing error event:', error);
      }
    });

    es.onerror = (error) => {
      console.error('[SSE] Connection error:', error);
      console.error('[SSE] ReadyState:', es.readyState);
      console.error('[SSE] URL:', url.replace(/token=([^&]+)/, 'token=***'));
      
      // EventSource readyState: 0 = CONNECTING, 1 = OPEN, 2 = CLOSED
      if (es.readyState === EventSource.CLOSED) {
        console.error('[SSE] Connection closed by server');
        
        // Don't reconnect if manually closed
        if (isManuallyClosed) {
          return;
        }
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = Math.min(reconnectDelay * Math.pow(2, reconnectAttempts - 1), 30000); // Max 30 seconds
          
          console.log(`[SSE] Attempting reconnection ${reconnectAttempts}/${maxReconnectAttempts} in ${delay}ms`);
          
          callbacks.onConnectionIssue?.({
            type: 'reconnecting',
            message: `Reconnecting in ${Math.round(delay / 1000)} seconds... (${reconnectAttempts}/${maxReconnectAttempts})`,
            attempt: reconnectAttempts,
            maxAttempts: maxReconnectAttempts
          });
          
          reconnectTimer = setTimeout(() => {
            if (eventSource) {
              eventSource.close();
            }
            connect();
          }, delay);
        } else {
          console.error('[SSE] Max reconnection attempts reached');
          callbacks.onConnectionIssue?.({
            type: 'connection_failed',
            message: 'Failed to reconnect after multiple attempts. Please refresh the page.'
          });
          callbacks.onError?.('Connection failed - please refresh the page');
        }
      }
    };
    
    // Add open event for debugging and reset reconnect attempts on successful connection
    es.onopen = () => {
      console.log('[SSE] Connection opened successfully');
      reconnectAttempts = 0; // Reset on successful connection
      reconnectDelay = 1000; // Reset delay
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      callbacks.onConnectionIssue?.({
        type: 'connected',
        message: 'Connection established'
      });
    };
  };
  
  const connect = () => {
    if (isManuallyClosed) {
      console.log('[SSE] Connection manually closed, not reconnecting');
      return;
    }
    
    eventSource = new EventSource(url);
    setupEventHandlers(eventSource);
  };
  
  // Initial connection
  connect();

  // Return object with close method
  return {
    close: () => {
      console.log('[SSE] Closing connection');
      isManuallyClosed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (eventSource) {
        eventSource.close();
      }
    }
  };
};



/**
 * Submit video quality metrics
 * @param {string} sessionId - Interview session ID
 * @param {Object} metrics - Video quality metrics
 * @returns {Promise<void>}
 */
export const submitVideoQuality = async (sessionId, metrics) => {
  try {
    await fastApiClient.post(
      `/interview/${sessionId}/video-quality`,
      {
        eye_contact_score: metrics.eyeContact,
        posture_score: metrics.posture,
        facial_expression_score: metrics.expression,
        engagement_level: metrics.engagement,
        camera_quality: metrics.cameraQuality,
        lighting_quality: metrics.lightingQuality,
        background_appropriateness: metrics.background,
        frame_present: metrics.framePresent,
        timestamp: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error('Failed to submit video quality metrics:', error);
    // Don't throw - metrics submission failure shouldn't break interview
  }
};

/**
 * End interview session
 * @param {Object} params - End interview parameters
 * @param {string} params.sessionId - Interview session ID
 * @param {string} params.interviewType - Interview type
 * @param {number} params.interviewTestId - Interview test ID
 * @param {number} params.duration - Session duration in seconds
 * @param {boolean} params.sessionFinished - Whether session was completed naturally
 * @returns {Promise<Object>} End interview response
 */
export const endInterview = async ({
  sessionId,
  interviewType,
  interviewTestId,
  duration,
  sessionFinished = false
}) => {
  try {
    const response = await fastApiClient.post('/interview/end', {
      session_id: sessionId,
      interview_type: interviewType,
      interview_test_id: interviewTestId,
      duration: duration.toString(),
      session_finished: sessionFinished
    });

    return response.data;
  } catch (error) {
    console.error('Error ending interview:', error);
    throw new Error(error.response?.data?.detail || 'Failed to end interview');
  }
};

/**
 * Get status of feedback generation task (queued after end_interview)
 * Poll this with the task_id returned from POST /end when feedback was queued.
 * @param {string} taskId - Celery task ID from end interview response
 * @returns {Promise<Object>} { taskId, sessionId, status, progress, result, error }
 */
export const getInterviewFeedbackStatus = async (taskId) => {
  try {
    const response = await fastApiClient.get(
      `/interview/feedback-status/${taskId}`
    );

    const { task_id, session_id, status, progress, result, error } = response.data;

    return {
      taskId: task_id,
      sessionId: session_id,
      status, // 'queued' | 'processing' | 'completed' | 'failed'
      progress: progress ?? 0,
      result,
      error
    };
  } catch (error) {
    console.error('Error fetching interview feedback status:', error);
    throw new Error(error.response?.data?.detail || 'Failed to get feedback status');
  }
};

/**
 * Wait for AI response with polling
 * @param {string} sessionId - Interview session ID
 * @param {number} maxAttempts - Maximum polling attempts (default: 60)
 * @param {number} interval - Polling interval in ms (default: 5000)
 * @returns {Promise<Object>} AI response
 */
export const waitForAIResponse = async (sessionId, maxAttempts = 60, interval = 5000) => {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await pollInterviewStatus(sessionId);
    
    if (status.aiResponse) {
      return status;
    }
    
    if (status.isComplete) {
      return status;
    }
    
    if (status.error) {
      throw new Error(status.error);
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error('Interview response timeout');
};
