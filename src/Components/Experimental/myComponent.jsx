import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  let regularVariable = 0;

  useEffect(() => {
    // This function runs after every render
    console.log(`useEffect: The count is ${count}. The regularVariable is ${regularVariable}.`);
  });

  const handleClick = () => {
    regularVariable += 1;
    setCount(count + 1);
    console.log(`handleClick: The regularVariable is now ${regularVariable}.`);
  };

  console.log('Component rendered');
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}

export default MyComponent;
