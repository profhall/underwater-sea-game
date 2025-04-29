import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import UnderwaterScene from './comps/UnderwaterScene';

function GameMenu({ onStart }) {
  return (
    <Paper 
      elevation={3} 
      style={{
        padding: '20px',
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2 // Ensures that the menu is on top of the background
      }}
    >
      <Typography variant="h4" gutterBottom>
        Underwater Sea Game
      </Typography>
      <Button variant="contained" color="primary" onClick={onStart}>
        Start Game
      </Button>
    </Paper>
  );
}

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    setIsGameStarted(true);
  };

  return (
    <Box position="relative" height="100vh">
      <UnderwaterScene />
      {!isGameStarted && (
        <GameMenu onStart={startGame} />
      )}
    </Box>
  );
}

export default App;

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

