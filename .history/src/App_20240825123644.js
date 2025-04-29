import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import UnderwaterScene from './UnderwaterScene';

function App() {
  return (
    <ErrorBoundary>
      <UnderwaterScene />
    </ErrorBoundary>
  );
}

export default App;
