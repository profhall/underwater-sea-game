import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UnderwaterScene from './comps/UnderwaterScene';
import ErrorBoundary from './ErrorBoundary';
import MovingSpriteStage from './comps/SurvivalStage/SurvivalStage'; // Import your new component

const menuOptions = {
  aquariumMode: {
    label: "Aquarium Mode",
    action: "startAquariumMode"
  },
  survivalMode: {
    label: "Survival Mode",
    action: "startSurvivalMode"
  },
  freeRoam: {
    label: "Free Roam",
    action: "startFreeRoam"
  },
  howToPlay: {
    label: "How To Play",
    action: "showHowToPlay"
  },
  settings: {
    label: "Settings",
    action: "openSettings"
  }
};

function GameMenu({onStart}) {

  const handleGameStart = () => {
    on()
  }
  return (
    <Paper 
      elevation={3} 
      sx={{
        padding: '20px',
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
        borderRadius: '15px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Typography variant="h4" gutterBottom color="primary">
        Underwater Sea Game
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        {Object.entries(menuOptions).map(([key, option]) => (
          <Button 
            key={key}
            onClick={handleGameStart}
            variant="contained" 
            color="primary" 
            component={Link} 
            to={option.action === "startSurvivalMode" ? "/survival-mode" : "#"}
            sx={{ 
              minWidth: '200px',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            {option.label}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    setIsGameStarted(true);
  };
  return (
    <Router>
      <ErrorBoundary>
        <Box position="relative" height="100vh">
          <Routes>
            <Route path="/" element={<UnderwaterScene />} />
            <Route path="/survival-mode" element={<MovingSpriteStage />} />
          </Routes>
        </Box>
    {/* <img src={`${process.env.PUBLIC_URL}/assets/underwaterBackground.jpg`} alt="Test Background" /> */}

      {/* <UnderwaterScene /> */}
      {!isGameStarted && (
        <GameMenu onStart={startGame} />
      )}


      </ErrorBoundary>
    </Router>
  );
}

export default App;
