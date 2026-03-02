// customHooks/useMediaStream.js
import { useState, useEffect, useRef } from 'react';

export function useMediaStream(enabled = true) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    console.log("[INFO] useMediaStream effect triggered. Enabled:", enabled);
    if (!enabled) {
      // If the hook is disabled, clean up any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        setStream(null);
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;

    async function getMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true, // Request both at the same time
        });

        if (isMounted) {
          console.log("[INFO] Media stream acquired:", mediaStream);
          // if (webcamRef.current) {
          //   webcamRef.current.srcObject = mediaStream;
          // }
          setStream(mediaStream);
          streamRef.current = mediaStream;
          setError(null);
        }
      } catch (err) {
        console.error("[ERROR] Error accessing media devices:", err);
        if (isMounted) {
          console.error("Error accessing media devices:", err);
          setError(err);
        }
      }
    }

    getMedia();

    // The crucial cleanup function
    return () => {
      isMounted = false;
      if (streamRef.current) {
        console.log("Cleaning up media stream.");
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [enabled]); // Re-run the effect if the `enabled` prop changes

  return { stream, error };
}
