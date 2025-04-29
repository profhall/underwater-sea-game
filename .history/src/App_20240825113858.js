import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import UnderwaterScene from './comps/UnderwaterScene';

function GameMenu({ onStart }) {
  return (
    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
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
    <Box>
      {isGameStarted ? (
        <UnderwaterScene />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bgcolor="lightblue"
        >
          <GameMenu onStart={startGame} />
        </Box>
      )}
    </Box>
  );
}

export default App;
