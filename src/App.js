import React, { useState } from 'react';
import { Box, Button, Paper, Typography, List, ListItem, ListItemText, Slider, FormControl, FormLabel } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UnderwaterScene from './comps/UnderwaterScene';
import ErrorBoundary from './ErrorBoundary';
import MovingSpriteStage from './comps/SurvivalStage/SurvivalStage'; // Import your new component
import MenuButton from './comps/MenuButton/MenuButton';

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

// How To Play component
function HowToPlay({ onShowMenu }) {
  return (
    <Box position="relative" height="100vh" style={{
      background: 'linear-gradient(180deg, #1e88e5 0%, #0d47a1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <MenuButton onClick={onShowMenu} />
      <Paper elevation={3} sx={{
        padding: '30px',
        maxWidth: '600px',
        margin: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px'
      }}>
        <Typography variant="h4" gutterBottom color="primary" textAlign="center">
          How To Play
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 3, mb: 1 }}>
          🌊 Aquarium Mode
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Relax and watch the underwater ecosystem. Move your mouse to create currents that affect sea life movement.
        </Typography>

        <Typography variant="h6" color="primary" sx={{ mt: 3, mb: 1 }}>
          🦈 Survival Mode
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="🎯 Choose your character: Shark, Orca, or Sperm Whale" />
          </ListItem>
          <ListItem>
            <ListItemText primary="⬆️⬇️⬅️➡️ Use arrow keys to move your character" />
          </ListItem>
          <ListItem>
            <ListItemText primary="🐟 Eat smaller creatures to increase your score" />
          </ListItem>
          <ListItem>
            <ListItemText primary="❤️ Monitor your health bar - avoid dangerous creatures" />
          </ListItem>
          <ListItem>
            <ListItemText primary="📈 Difficulty increases as you eat more creatures" />
          </ListItem>
        </List>

        <Typography variant="h6" color="primary" sx={{ mt: 3, mb: 1 }}>
          🎮 Free Roam Mode
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Explore the aquarium with interactive controls. Click and move around the underwater world freely.
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 3, textAlign: 'center' }}>
          Tip: Each character type faces different creatures - choose wisely!
        </Typography>
      </Paper>
    </Box>
  );
}

// Settings component
function Settings({ onShowMenu }) {
  const [volume, setVolume] = useState(70);
  const [difficulty, setDifficulty] = useState(50);
  const [fishCount, setFishCount] = useState(30);

  return (
    <Box position="relative" height="100vh" style={{
      background: 'linear-gradient(180deg, #1e88e5 0%, #0d47a1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <MenuButton onClick={onShowMenu} />
      <Paper elevation={3} sx={{
        padding: '30px',
        maxWidth: '500px',
        margin: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px'
      }}>
        <Typography variant="h4" gutterBottom color="primary" textAlign="center">
          Settings
        </Typography>

        <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
          <FormLabel>🔊 Master Volume: {volume}%</FormLabel>
          <Slider
            value={volume}
            onChange={(e, newValue) => setVolume(newValue)}
            min={0}
            max={100}
            marks={[
              { value: 0, label: 'Mute' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' }
            ]}
            sx={{ mt: 2 }}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
          <FormLabel>⚡ Game Difficulty: {difficulty > 75 ? 'Hard' : difficulty > 25 ? 'Medium' : 'Easy'}</FormLabel>
          <Slider
            value={difficulty}
            onChange={(e, newValue) => setDifficulty(newValue)}
            min={0}
            max={100}
            marks={[
              { value: 0, label: 'Easy' },
              { value: 50, label: 'Medium' },
              { value: 100, label: 'Hard' }
            ]}
            sx={{ mt: 2 }}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
          <FormLabel>🐟 Max Fish Count: {fishCount}</FormLabel>
          <Slider
            value={fishCount}
            onChange={(e, newValue) => setFishCount(newValue)}
            min={10}
            max={100}
            marks={[
              { value: 10, label: '10' },
              { value: 50, label: '50' },
              { value: 100, label: '100' }
            ]}
            sx={{ mt: 2 }}
          />
        </FormControl>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" color="primary">
            Save Settings
          </Button>
          <Button variant="outlined" color="primary">
            Reset to Default
          </Button>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 3, textAlign: 'center' }}>
          Settings are saved locally in your browser
        </Typography>
      </Paper>
    </Box>
  );
}

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
      // Navigate to free roam mode (enhanced aquarium with interaction)
      navigate("/free-roam");
      onStart(); // Hide menu
    } else if (action === "showHowToPlay") {
      // Navigate to tutorial/instructions
      navigate("/how-to-play");
      onStart(); // Hide menu
    } else if (action === "openSettings") {
      // Navigate to settings page
      navigate("/settings");
      onStart(); // Hide menu
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
          <Route path="/free-roam" element={<UnderwaterScene onShowMenu={showMainMenu} interactive={true} />} />
          <Route path="/how-to-play" element={<HowToPlay onShowMenu={showMainMenu} />} />
          <Route path="/settings" element={<Settings onShowMenu={showMainMenu} />} />
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
