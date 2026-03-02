// MessageBubble.tsx
import React from "react";
import { useTypewriter } from "./useTypeWriter";

export function MessageBubble({ text, isStreaming }) {
  const shown = useTypewriter(text, { speed: 200, enabled: isStreaming ?? false });
  console.log("We are also re-rendering shit!");
  return (
    <div className="rounded-lg bg-slate-100 p-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
      <span>{shown}</span>
      {isStreaming && <span className="ml-0.5 inline-block h-[1em] w-px align-[-0.2em] bg-slate-500 animate-caret" />}
    </div>
  );
}
