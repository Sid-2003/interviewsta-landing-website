import React, { useState, useRef, useEffect } from 'react';

const DraggableCodeEditor = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(200);
  const [code, setCode] = useState('// Your code here\nconsole.log("Hello World!");');
  const [initialMouseY, setInitialMouseY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);
  const editorRef = useRef(null);
  const resizeHandleRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
    //   if (!isDragging) return;
      
      const deltaY = e.clientY - initialMouseY;
      const newHeight = Math.max(100, initialHeight + deltaY); // Minimum height of 100px
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      console.log("Mouse is up");
      setIsDragging(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, initialMouseY, initialHeight]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setInitialMouseY(e.clientY);
    setInitialHeight(height);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Draggable Code Editor</h2>
      
      <div 
        style={{
          border: '2px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#1e1e1e',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Editor Header */}
        <div style={{
          backgroundColor: '#2d2d2d',
          padding: '8px 12px',
          borderBottom: '1px solid #444',
          color: '#fff',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>JavaScript</span>
          <span style={{ fontSize: '10px', opacity: 0.7 }}>
            Height: {height}px
          </span>
        </div>

        {/* Code Editor */}
        <textarea
        //   ref={editorRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '100%',
            height: `${height}px`,
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            border: 'none',
            outline: 'none',
            padding: '12px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'none',
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'auto'
          }}
          placeholder="Enter your code here..."
        />

        {/* Resize Handle */}
        <div
        //   ref={resizeHandleRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: isDragging ? '#007acc' : '#444',
            cursor: 'ns-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: isDragging ? 'none' : 'background-color 0.2s'
          }}
        >
          {/* Resize indicator */}
          <div style={{
            width: '30px',
            height: '2px',
            backgroundColor: isDragging ? '#fff' : '#888',
            borderRadius: '1px'
          }} />
        </div>
      </div>

      {/* Status indicator */}
      <div style={{ 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#666',
        textAlign: 'center'
      }}>
        {isDragging ? 'Resizing...' : 'Click and drag the bottom edge to resize'}
      </div>
    </div>
  );
};

export default DraggableCodeEditor;
