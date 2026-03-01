import React, { useState } from 'react';

const IndentableTextarea = () => {
  const [value, setValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Stop focus change

      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const lines = value.split('\n');
      const tab = '  '; // Two spaces or "\t" for actual tab character

      // Find line indexes
      const startLine = value.slice(0, start).split('\n').length - 1;
      const endLine = value.slice(0, end).split('\n').length - 1;

      // Right indent (Tab)
      if (!e.shiftKey) {
        // Add tab to each selected line
        for (let i = startLine; i <= endLine; i++) {
          lines[i] = tab + lines[i];
        }

        const newValue = lines.join('\n');
        const newStart = start + tab.length;
        const newEnd = end + (endLine - startLine + 1) * tab.length;

        setValue(newValue);

        // Update cursor/selection after re-render
        requestAnimationFrame(() => {
          textarea.selectionStart = newStart;
          textarea.selectionEnd = newEnd;
        });
      }

      // Left indent (Shift + Tab)
      else {
        let removed = 0;
        for (let i = startLine; i <= endLine; i++) {
          if (lines[i].startsWith(tab)) {
            lines[i] = lines[i].slice(tab.length);
            removed += tab.length;
          } else if (lines[i].startsWith(' ')) {
            // Handle one space if mixed indentation
            lines[i] = lines[i].slice(1);
            removed += 1;
          }
        }

        const newValue = lines.join('\n');
        const newStart = Math.max(start - tab.length, 0);
        const newEnd = Math.max(end - removed, newStart);

        setValue(newValue);

        requestAnimationFrame(() => {
          textarea.selectionStart = newStart;
          textarea.selectionEnd = newEnd;
        });
      }
    }
  };

  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      rows={10}
      cols={60}
      style={{
        fontFamily: 'monospace',
        whiteSpace: 'pre',
      }}
      placeholder="Type here... Press Tab or Shift+Tab to indent"
    />
  );
}

export default IndentableTextarea;
