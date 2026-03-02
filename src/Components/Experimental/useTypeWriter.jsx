// useTypewriter.tsx
import { useEffect, useRef, useState } from "react";

export function useTypewriter(text, opts) {
  // console.log("text->",text);
  // console.log("opts->",opts);
  const speed = opts?.speed ?? 50; // ms per character
  const enabled = opts?.enabled ?? true;
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const textRef = useRef(text);
  console.log("Text is",textRef.current);

  

  useEffect(() => {
    textRef.current = text;
    if (!enabled) {
      setDisplayed(text);
      indexRef.current = text.length;
      return;
    }
    // If new text comes in, restart from current displayed prefix (supports streaming)
    if (indexRef.current > text.length) indexRef.current = displayed.length;
  }, [text, enabled]); // eslint-disable-line

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now) => {
      // console.log(now);
      if (indexRef.current >= textRef.current.length) return;
      if (now - last >= speed) {
        indexRef.current += 1;
        setDisplayed(textRef.current.slice(0, indexRef.current));
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
     }, [enabled, speed]);

  return displayed;
}
