import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleMenuAction = (action) => {
    if (action === "startAquariumMode") {
      // Navigate to aquarium mode (home page with UnderwaterScene)
      navigate("/");
      onStart(); // Hide menu
    } else if (action === "startSurvivalMode") {
      // Navigate to survival mode
      navigate("/survival-mode");
      onStart(); // Hide menu
    } else if (action === "startFreeRoam") {
      // For now, same as aquarium mode - can be expanded later
      navigate("/");
      onStart(); // Hide menu
    } else {
      // For other options (How To Play, Settings), just start the game for now
      onStart();
    }
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
            onClick={() => handleMenuAction(option.action)}
            variant="contained" 
            color="primary" 
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

// Main App content component that knows about route changes
function AppContent() {
  const [showMenu, setShowMenu] = useState(true);

  const startGame = () => {
    setShowMenu(false);
  };

  const showMainMenu = () => {
    setShowMenu(true);
  };

  return (
    <ErrorBoundary>
      <Box position="relative" height="100vh">
        <Routes>
          <Route path="/" element={<UnderwaterScene onShowMenu={showMainMenu} />} />
          <Route path="/survival-mode" element={<MovingSpriteStage onShowMenu={showMainMenu} />} />
        </Routes>
        
        {/* Show menu overlay */}
        {showMenu && (
          <GameMenu onStart={startGame} />
        )}
      </Box>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
