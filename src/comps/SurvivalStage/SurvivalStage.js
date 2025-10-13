import React, { useState, useEffect } from 'react';
import { Sprite, Stage } from '@pixi/react';
import MovingSprite from '../Sprites/MovingFish/MovingFish';
import Fish from '../Sprites/Fish/Fish';
import Squid from '../Sprites/Squid/Squid';
import Krill from '../Sprites/Krill/Krill';
import PoisonFish from '../Sprites/PoisonFish/PoisonFish';
import LifeFish from '../Sprites/LifeFish/LifeFish';
import MadFish from '../Sprites/MadFish/MadFish';
import MenuButton from '../MenuButton/MenuButton';

const BASE_MAX_CREATURES = 30; // Base number of creatures
const MAX_CREATURES_LIMIT = 80; // Maximum creatures regardless of difficulty
const PLAYER_MOVEMENT_SPEED = 4; // Player movement speed (lower = slower, higher = faster)

// Character selection component - now shown before game starts
const CharacterSelect = ({ onSelect, currentCharacter, onStartGame }) => {
  const characters = [
    { id: 'shark', name: 'Shark', image: '/assets/shark.png', description: 'Default balance of creatures' },
    { id: 'orca', name: 'Orca', image: '/assets/orca.png', description: '50% fish, 50% squid' },
    { id: 'sperm', name: 'Sperm Whale', image: '/assets/sperm.png', description: '50% fish, 25% squid, 25% krill' }
  ];

  return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        background: 'rgba(0,0,0,0.8)',
        padding: '30px',
        borderRadius: '15px',
        width: '400px'
      }}>
        <h2 style={{ color: 'white', margin: 0 }}>Choose Your Character</h2>

        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          {characters.map(char => (
              <div
                  key={char.id}
                  onClick={() => onSelect(char.id)}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '8px',
                    background: currentCharacter === char.id ? 'rgba(255,255,0,0.2)' : 'rgba(0,0,0,0.3)',
                    border: currentCharacter === char.id ? '2px solid yellow' : '2px solid transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100px',
                    transition: 'all 0.3s ease'
                  }}
              >
                <img
                    src={`${process.env.PUBLIC_URL}${char.image}`}
                    alt={char.name}
                    width="70"
                    height="70"
                    style={{ objectFit: 'contain', marginBottom: '8px' }}
                />
                <div style={{ color: 'white', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{char.name}</div>
              </div>
          ))}
        </div>

        <div style={{ color: '#aaa', textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>
          {characters.find(c => c.id === currentCharacter)?.description}
        </div>

        <button
            onClick={onStartGame}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '80%'
            }}
        >
          Start Game
        </button>
      </div>
  );
};

// Level Complete component
const LevelCompleteScreen = ({ stats, onNextLevel, onRestart, onMainMenu }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      background: 'rgba(0,50,0,0.9)',
      padding: '40px',
      borderRadius: '15px',
      width: '400px',
      zIndex: 10,
      border: '3px solid #00ff00'
    }}>
      <h1 style={{ color: '#00ff00', margin: 0, fontSize: '32px' }}>
        {stats?.perfectClear ? '🏆 PERFECT CLEAR!' : '✅ LEVEL COMPLETE!'}
      </h1>

      <div style={{ textAlign: 'center', color: 'white', fontSize: '18px' }}>
        <div style={{ marginBottom: '12px' }}>
          🎯 <strong>Final Score: {stats?.score || 0}</strong>
        </div>
        <div style={{ marginBottom: '8px', fontSize: '16px' }}>
          ⚡ Level Completed: {stats?.level || 1}
        </div>
        <div style={{ marginBottom: '8px', fontSize: '16px' }}>
          ⏱️ Completion Time: {Math.floor((stats?.time || 0) / 60)}:{((stats?.time || 0) % 60).toString().padStart(2, '0')}
        </div>
        <div style={{ fontSize: '16px', color: '#aaa' }}>
          🦈 Character: {stats?.character === 'shark' ? 'Shark' : stats?.character === 'orca' ? 'Orca' : 'Sperm Whale'}
        </div>
        {stats?.perfectClear && (
          <div style={{ fontSize: '14px', color: '#gold', marginTop: '10px', fontWeight: 'bold' }}>
            🌟 No dangerous fish left! Perfect execution!
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
        <button
          onClick={onNextLevel}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#00AA00',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ⬆️ Next Level
        </button>
        <button
          onClick={onRestart}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔄 Restart Level
        </button>
        <button
          onClick={onMainMenu}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🏠 Main Menu
        </button>
      </div>

      <div style={{ fontSize: '14px', color: '#888', textAlign: 'center', marginTop: '10px' }}>
        Great job! Ready for the next challenge?
      </div>
    </div>
  );
};

// Game Over component
const GameOverScreen = ({ stats, onRestart, onMainMenu }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      background: 'rgba(0,0,0,0.9)',
      padding: '40px',
      borderRadius: '15px',
      width: '400px',
      zIndex: 10,
      border: '2px solid #ff4444'
    }}>
      <h1 style={{ color: '#ff4444', margin: 0, fontSize: '32px' }}>Game Over!</h1>

      <div style={{ textAlign: 'center', color: 'white', fontSize: '18px' }}>
        <div style={{ marginBottom: '12px' }}>
          🎯 <strong>Final Score: {stats?.score || 0}</strong>
        </div>
        <div style={{ marginBottom: '8px', fontSize: '16px' }}>
          ⚡ Level Reached: {stats?.level || 1}
        </div>
        <div style={{ marginBottom: '8px', fontSize: '16px' }}>
          ⏱️ Time Survived: {Math.floor((stats?.time || 0) / 60)}:{((stats?.time || 0) % 60).toString().padStart(2, '0')}
        </div>
        <div style={{ fontSize: '16px', color: '#aaa' }}>
          🦈 Character: {stats?.character === 'shark' ? 'Shark' : stats?.character === 'orca' ? 'Orca' : 'Sperm Whale'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
        <button
          onClick={onRestart}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔄 Play Again
        </button>
        <button
          onClick={onMainMenu}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🏠 Main Menu
        </button>
      </div>

      <div style={{ fontSize: '14px', color: '#888', textAlign: 'center', marginTop: '10px' }}>
        Tip: Try a different character for varied gameplay!
      </div>
    </div>
  );
};

const SurvivalStage = ({ onShowMenu }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [position, setPosition] = useState({
    x: 50, // Start near the left side
    y: window.innerHeight / 2, // Centered vertically
  });

  const [moving, setMoving] = useState(null); // Movement state
  const [fishList, setFishList] = useState([]); // List of fish
  const [squidList, setSquidList] = useState([]); // List of squid
  const [krillList, setKrillList] = useState([]); // List of krill
  const [poisonFishList, setPoisonFishList] = useState([]); // List of poison fish
  const [lifeFish1List, setLifeFish1List] = useState([]); // List of lifefish1 (+5% health)
  const [lifeFish2List, setLifeFish2List] = useState([]); // List of lifefish2 (+100% health)
  const [madFishList, setMadFishList] = useState([]); // List of madfish (instant death)
  const [creaturesEaten, setCreaturesEaten] = useState(0); // Creatures eaten counter
  const [gameStarted, setGameStarted] = useState(false); // Game start state
  const [selectedCharacter, setSelectedCharacter] = useState('shark'); // Default character
  const [characterSelected, setCharacterSelected] = useState(false); // Flag to track if character selection is complete
  const [health, setHealth] = useState(100); // Player health (0-100)
  const [maxHealth] = useState(100); // Maximum health
  const [difficultyLevel, setDifficultyLevel] = useState(1); // Current difficulty level
  const [gameTime, setGameTime] = useState(0); // Time since game started (in seconds)
  const [gameOver, setGameOver] = useState(false); // Game over state
  const [levelComplete, setLevelComplete] = useState(false); // Level completion state
  const [finalStats, setFinalStats] = useState(null); // Final game statistics

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle keyboard input for character movement
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') setMoving('up');
      else if (e.key === 'ArrowDown') setMoving('down');
      else if (e.key === 'ArrowRight') setMoving('right');
      else if (e.key === 'ArrowLeft') setMoving('left');
      else if (e.key === 'g' || e.key === 'G') {
        // Test game over (remove in production)
        takeDamage(health);
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(e.key)) {
        setMoving(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted]);

  // Function to spawn initial creatures based on the selected character
  const spawnCreatures = () => {
    const totalCreatures = BASE_MAX_CREATURES;
    let fishCount, squidCount, krillCount, poisonFishCount, lifeFish1Count, lifeFish2Count, madFishCount;

    // Calculate poison fish count based on difficulty level
    if (difficultyLevel <= 2) {
      poisonFishCount = Math.floor(Math.random() * 4) + 2; // 2-5 poison fish on easy (ensure at least 2)
    } else if (difficultyLevel <= 5) {
      poisonFishCount = Math.floor(Math.random() * 6) + 5; // 5-10 poison fish on medium
    } else {
      poisonFishCount = Math.floor(Math.random() * 11) + 10; // 10-20 poison fish on hard
    }

    // Calculate lifefish count based on difficulty level (rare spawns)
    if (difficultyLevel <= 2) {
      lifeFish1Count = Math.random() < 0.3 ? 1 : 0; // 30% chance for 1 lifefish1 on easy
      lifeFish2Count = Math.random() < 0.1 ? 1 : 0; // 10% chance for 1 lifefish2 on easy
    } else if (difficultyLevel <= 5) {
      lifeFish1Count = Math.floor(Math.random() * 3); // 0-2 lifefish1 on medium
      lifeFish2Count = Math.random() < 0.2 ? 1 : 0; // 20% chance for 1 lifefish2 on medium
    } else {
      lifeFish1Count = Math.floor(Math.random() * 4) + 1; // 1-4 lifefish1 on hard
      lifeFish2Count = Math.floor(Math.random() * 3); // 0-2 lifefish2 on hard
    }

    // Calculate madfish count based on difficulty level (extremely rare but deadly)
    if (difficultyLevel <= 1) {
      madFishCount = Math.random() < 0.3 ? 1 : 0; // 30% chance for testing on level 1
    } else if (difficultyLevel <= 2) {
      madFishCount = Math.random() < 0.5 ? 1 : 0; // 50% chance on level 2
    } else if (difficultyLevel <= 5) {
      madFishCount = Math.floor(Math.random() * 2) + 1; // 1-2 madfish on medium
    } else if (difficultyLevel <= 8) {
      madFishCount = Math.floor(Math.random() * 3) + 1; // 1-3 madfish on hard
    } else {
      madFishCount = Math.floor(Math.random() * 4) + 2; // 2-5 madfish on nightmare difficulty
    }

    // Adjust total creatures to account for all special fish
    const remainingCreatures = totalCreatures - poisonFishCount - lifeFish1Count - lifeFish2Count - madFishCount;

    // Determine creature distribution based on selected character
    switch(selectedCharacter) {
      case 'orca':
        // 50% fish, 50% squid
        fishCount = Math.floor(remainingCreatures * 0.5);
        squidCount = remainingCreatures - fishCount;
        krillCount = 0;
        break;
      case 'sperm':
        // 50% fish, 25% squid, 25% krill
        fishCount = Math.floor(remainingCreatures * 0.5);
        squidCount = Math.floor(remainingCreatures * 0.25);
        krillCount = remainingCreatures - fishCount - squidCount;
        break;
      default: // shark
        // Default distribution: 60% fish, 20% squid, 20% krill
        fishCount = Math.floor(remainingCreatures * 0.6);
        squidCount = Math.floor(remainingCreatures * 0.2);
        krillCount = remainingCreatures - fishCount - squidCount;
        break;
    }

    // Spawn fish
    const newFishList = [];
    for (let i = 0; i < fishCount; i++) {
      newFishList.push({
        key: `fish-${Math.random()}`, // Unique key
        x: Math.random() * dimensions.width, // Random horizontal position
        y: Math.random() * dimensions.height * 0.8 + dimensions.height * 0.1, // Random vertical position
        size: Math.random() * 0.12 + 0.05, // Random size
        type: 'fish',
      });
    }
    setFishList(newFishList);

    // Spawn squid
    const newSquidList = [];
    for (let i = 0; i < squidCount; i++) {
      newSquidList.push({
        key: `squid-${Math.random()}`, // Unique key
        x: Math.random() * dimensions.width, // Random horizontal position
        y: Math.random() * dimensions.height * 0.6 + dimensions.height * 0.2, // Random vertical position
        size: Math.random() * 0.15 + 0.08, // Random size
        type: 'squid',
      });
    }
    setSquidList(newSquidList);

    // Spawn krill
    const newKrillList = [];
    for (let i = 0; i < krillCount; i++) {
      newKrillList.push({
        key: `krill-${Math.random()}`, // Unique key
        x: Math.random() * dimensions.width, // Random horizontal position
        y: Math.random() * dimensions.height * 0.5 + dimensions.height * 0.3, // Random vertical position
        size: Math.random() * 0.04 + 0.02, // Random size
        type: 'krill',
      });
    }
    setKrillList(newKrillList);

    // Spawn poison fish
    const newPoisonFishList = [];
    for (let i = 0; i < poisonFishCount; i++) {
      newPoisonFishList.push({
        key: `poison-fish-${Math.random()}`, // Unique key
        x: Math.random() * dimensions.width, // Random horizontal position
        y: Math.random() * dimensions.height * 0.8 + dimensions.height * 0.1, // Random vertical position
        size: Math.random() * 0.10 + 0.06, // Slightly larger than regular fish
        type: 'poison-fish',
      });
    }
    console.log(`☠️ Spawning ${poisonFishCount} poison fish at difficulty level ${difficultyLevel}`);
    setPoisonFishList(newPoisonFishList);

    // Spawn lifefish1 (+5% health)
    const newLifeFish1List = [];
    for (let i = 0; i < lifeFish1Count; i++) {
      newLifeFish1List.push({
        key: `lifefish1-${Math.random()}`, // Unique key
        x: Math.random() * dimensions.width, // Random horizontal position
        y: Math.random() * dimensions.height * 0.7 + dimensions.height * 0.15, // Mid-depth position
        size: Math.random() * 0.08 + 0.07, // Medium size
        type: 'lifefish1',
        healingAmount: 5, // +5% health
      });
    }
    if (lifeFish1Count > 0) {
      console.log(`💚 Spawning ${lifeFish1Count} LifeFish1 (+5% health) at difficulty level ${difficultyLevel}`);
    }
    setLifeFish1List(newLifeFish1List);

    // Spawn lifefish2 (+100% health)
    const newLifeFish2List = [];
    for (let i = 0; i < lifeFish2Count; i++) {
      newLifeFish2List.push({
        key: `lifefish2-${Math.random()}`, // Unique key
        x: Math.random() * dimensions.width, // Random horizontal position
        y: Math.random() * dimensions.height * 0.6 + dimensions.height * 0.2, // Deeper position
        size: Math.random() * 0.12 + 0.10, // Larger size for rare fish
        type: 'lifefish2',
        healingAmount: 100, // +100% health (full restore)
      });
    }
    if (lifeFish2Count > 0) {
      console.log(`💖 Spawning ${lifeFish2Count} LifeFish2 (+100% health) at difficulty level ${difficultyLevel}`);
    }
    setLifeFish2List(newLifeFish2List);

    // Spawn madfish (instant death)
    const newMadFishList = [];
    for (let i = 0; i < madFishCount; i++) {
      newMadFishList.push({
        key: `madfish-${Math.random()}`, // Unique key
        x: Math.random() * dimensions.width, // Random horizontal position
        y: Math.random() * dimensions.height * 0.8 + dimensions.height * 0.1, // Full depth range
        size: Math.random() * 0.15 + 0.12, // Larger, more menacing size
        type: 'madfish',
      });
    }
    console.log(`🎯 MadFish spawn check: difficulty=${difficultyLevel}, madFishCount=${madFishCount}`);
    if (madFishCount > 0) {
      console.log(`💀 DANGER! Spawning ${madFishCount} MadFish (INSTANT DEATH) at difficulty level ${difficultyLevel}`);
      console.log(`💀 MadFish list:`, newMadFishList);
    } else {
      console.log(`💀 No MadFish spawned this round at difficulty level ${difficultyLevel}`);
    }
    setMadFishList(newMadFishList);
  };


  // Simple difficulty level update (no respawning for now)
  useEffect(() => {
    if (gameStarted) {
      const newDifficultyLevel = Math.floor(creaturesEaten / 10) + 1;
      setDifficultyLevel(newDifficultyLevel);
    }
  }, [gameStarted, creaturesEaten]);

  // No background spawning - creatures only spawn at level start

  // Spawn creatures only when the game starts or screen size changes
  useEffect(() => {
    if (gameStarted) {
      spawnCreatures();
    }
  }, [gameStarted, dimensions.width, dimensions.height]);

  // Game timer - tracks time elapsed since game started
  useEffect(() => {
    if (!gameStarted) return;

    const timerInterval = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStarted]);

  // Check for level completion whenever creature lists change
  useEffect(() => {
    if (!gameStarted || gameOver || levelComplete) return;

    // Calculate total creature count to ensure creatures have been spawned
    const totalCreatures = fishList.length + squidList.length + krillList.length +
                          poisonFishList.length + lifeFish1List.length +
                          lifeFish2List.length + madFishList.length;

    // Only check for level completion if creatures have been spawned AND some have been eaten
    // This prevents immediate level complete on game start
    if (totalCreatures === 0 && creaturesEaten === 0) {
      return; // Creatures haven't spawned yet, don't check
    }

    if (checkLevelComplete()) {
      setLevelComplete(true);
      setFinalStats({
        score: creaturesEaten,
        level: difficultyLevel,
        time: gameTime,
        character: selectedCharacter,
        victory: true,
        perfectClear: (poisonFishList.length === 0 && madFishList.length === 0)
      });
    }
  }, [gameStarted, gameOver, levelComplete, fishList.length, squidList.length, krillList.length, lifeFish1List.length, lifeFish2List.length, poisonFishList.length, madFishList.length, creaturesEaten, difficultyLevel, gameTime, selectedCharacter]);

  // Collision detection is now handled by individual sprite components

  // Function to start the game
  const startGame = () => {
    setGameStarted(true);
    setCharacterSelected(true);

    // Reset position
    setPosition({
      x: 50,
      y: dimensions.height / 2,
    });

    // Reset game state
    setCreaturesEaten(0);
    setHealth(maxHealth); // Reset health to full
  };

  // Function to take damage and trigger game over
  const takeDamage = (damage) => {
    setHealth(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      if (newHealth <= 0) {
        // Trigger game over
        setFinalStats({
          score: creaturesEaten,
          level: difficultyLevel,
          time: gameTime,
          character: selectedCharacter
        });
        setGameOver(true);
        setGameStarted(false);
      }
      return newHealth;
    });
  };

  // Function to restore health when eating beneficial creatures
  const restoreHealth = (amount) => {
    setHealth(prevHealth => {
      const newHealth = Math.min(maxHealth, prevHealth + amount);
      console.log(`💚 Health restored! +${amount} health (${prevHealth} → ${newHealth})`);
      return newHealth;
    });
  };

  // Function to check if level is complete (all beneficial fish eaten)
  const checkLevelComplete = () => {
    const beneficialFishCount = fishList.length + squidList.length + krillList.length + lifeFish1List.length + lifeFish2List.length;
    const onlyDangerousLeft = beneficialFishCount === 0 && (poisonFishList.length > 0 || madFishList.length > 0);

    if (beneficialFishCount === 0 && poisonFishList.length === 0 && madFishList.length === 0) {
      // All creatures cleared - perfect level completion
      console.log(`🎉 PERFECT CLEAR! All creatures eliminated!`);
      return true;
    } else if (onlyDangerousLeft) {
      // Only dangerous fish left - level completion with bonus
      console.log(`✅ LEVEL COMPLETE! Only dangerous fish remain. Beneficial fish cleared: ${creaturesEaten}`);
      return true;
    }
    return false;
  };

  // Function to advance to next level
  const nextLevel = () => {
    // Keep character and stats, but reset creatures and advance difficulty
    setLevelComplete(false);
    setFinalStats(null);
    setFishList([]);
    setSquidList([]);
    setKrillList([]);
    setPoisonFishList([]);
    setLifeFish1List([]);
    setLifeFish2List([]);
    setMadFishList([]);
    setDifficultyLevel(prev => prev + 1);
    setHealth(maxHealth); // Restore health for next level
    setCreaturesEaten(0); // Reset creatures eaten for new level
    // Spawn new creatures for next level will happen automatically due to useEffect
  };

  // Function to reset the game completely
  const resetGame = () => {
    setGameStarted(false);
    setCharacterSelected(false);
    setFishList([]);
    setSquidList([]);
    setKrillList([]);
    setPoisonFishList([]);
    setLifeFish1List([]);
    setLifeFish2List([]);
    setMadFishList([]);
    setCreaturesEaten(0);
    setHealth(maxHealth); // Reset health to full
    setDifficultyLevel(1);
    setGameTime(0);
    setGameOver(false);
    setLevelComplete(false);
    setFinalStats(null);
  };

  // Function to handle returning to main menu
  const handleMainMenu = () => {
    // Reset all game state first
    setGameStarted(false);
    setCharacterSelected(false);
    setFishList([]);
    setSquidList([]);
    setKrillList([]);
    setPoisonFishList([]);
    setLifeFish1List([]);
    setLifeFish2List([]);
    setMadFishList([]);
    setCreaturesEaten(0);
    setHealth(maxHealth);
    setDifficultyLevel(1);
    setGameTime(0);
    setGameOver(false);
    setLevelComplete(false);
    setFinalStats(null);

    // Then navigate to main menu if callback exists
    if (onShowMenu) {
      onShowMenu();
    }
  };

  return (
      <>
        {/* Level Complete screen */}
        {levelComplete && finalStats && (
          <LevelCompleteScreen
            stats={finalStats}
            onNextLevel={nextLevel}
            onRestart={resetGame}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* Game Over screen */}
        {gameOver && finalStats && (
          <GameOverScreen
            stats={finalStats}
            onRestart={resetGame}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* Character selection screen (before game starts) */}
        {!characterSelected && !gameOver && (
            <CharacterSelect
                onSelect={setSelectedCharacter}
                currentCharacter={selectedCharacter}
                onStartGame={startGame}
            />
        )}

        {/* Game interface (when game is running) */}
        {gameStarted && (
            <>
              {/* Score and stats display */}
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: '18px',
                color: 'white',
                textAlign: 'right',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '15px 20px',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(5px)'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: 'bold' }}>Score: {creaturesEaten}</div>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>Level: {difficultyLevel}</div>
                <div style={{ fontSize: '14px', color: '#ccc' }}>Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</div>
              </div>

              {/* Health bar */}
              <div style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '15px 20px',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(5px)'
              }}>
                <div style={{ color: 'white', fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>Health</div>
                <div style={{
                  width: '200px',
                  height: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '2px solid white',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(health / maxHealth) * 100}%`,
                    height: '100%',
                    backgroundColor: health > 60 ? '#4CAF50' : health > 30 ? '#FFC107' : '#f44336',
                    transition: 'width 0.3s ease, background-color 0.3s ease'
                  }}></div>
                </div>
                <div style={{ color: 'white', fontSize: '14px', marginTop: '5px' }}>{health}/{maxHealth}</div>
              </div>

              {/* Creature counts display */}
              <div style={{
                position: 'absolute',
                top: 150,
                right: 20,
                fontSize: '14px',
                color: 'white',
                textAlign: 'right',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '15px 20px',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(5px)'
              }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '15px' }}>Creatures ({fishList.length + squidList.length + krillList.length + poisonFishList.length + lifeFish1List.length + lifeFish2List.length + madFishList.length})</div>
                <div style={{ color: '#87CEEB' }}>🐟 Fish: {fishList.length}</div>
                <div style={{ color: '#DDA0DD' }}>🦑 Squid: {squidList.length}</div>
                <div style={{ color: '#F0E68C' }}>🦐 Krill: {krillList.length}</div>
                <div style={{ color: '#FF6B6B' }}>☠️ Poison Fish: {poisonFishList.length}</div>
                <div style={{ color: '#90EE90' }}>💚 LifeFish1 (+5%): {lifeFish1List.length}</div>
                <div style={{ color: '#FFD700' }}>💖 LifeFish2 (+100%): {lifeFish2List.length}</div>
                {madFishList.length > 0 && (
                  <div style={{ color: '#FF0000', fontWeight: 'bold', animation: 'blink 1s infinite' }}>💀 MadFish (DEATH): {madFishList.length}</div>
                )}
                {difficultyLevel > 1 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#FFD700' }}>
                    ⚡ Difficulty increased!
                  </div>
                )}
              </div>

              {/* Game control buttons */}
              <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                      onClick={resetGame}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                  >
                    Change Character
                  </button>
                  {onShowMenu && (
                    <MenuButton onClick={onShowMenu} style={{ position: 'static' }} />
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#ccc', maxWidth: '200px' }}>
                  Controls: Arrow keys to move<br/>
                  Speed: {PLAYER_MOVEMENT_SPEED}/10<br/>
                  Press 'G' to test game over
                </div>
              </div>
            </>
        )}

        <Stage width={dimensions.width} height={dimensions.height} options={{ backgroundColor: 0x1099bb }}>
          {/* Background */}
          <Sprite
              image={`${process.env.PUBLIC_URL}/assets/underWaterBG.png`}
              width={dimensions.width}
              height={dimensions.height}
          />

          {/* Fish */}
          {fishList.map((fish) => (
              <Fish
                  key={fish.key}
                  image={`${process.env.PUBLIC_URL}/assets/fish.png`}
                  initialPosition={{ x: fish.x, y: fish.y }}
                  size={fish.size}
                  width={dimensions.width}
                  height={dimensions.height}
                  sharkPosition={position}
                  onEaten={() => {
                    setFishList((prevList) => prevList.filter((f) => f.key !== fish.key));
                    setCreaturesEaten((prev) => prev + 1);
                    restoreHealth(1); // Restore 1% health when eating fish
                  }}
              />
          ))}

          {/* Squid */}
          {squidList.map((squid) => (
              <Squid
                  key={squid.key}
                  image={`${process.env.PUBLIC_URL}/assets/sad_squid.png`}
                  initialPosition={{ x: squid.x, y: squid.y }}
                  size={squid.size}
                  width={dimensions.width}
                  height={dimensions.height}
                  sharkPosition={position}
                  onEaten={() => {
                    setSquidList((prevList) => prevList.filter((s) => s.key !== squid.key));
                    setCreaturesEaten((prev) => prev + 1);
                  }}
              />
          ))}

          {/* Krill */}
          {krillList.map((krill) => (
              <Krill
                  key={krill.key}
                  image={`${process.env.PUBLIC_URL}/assets/krill.png`}
                  initialPosition={{ x: krill.x, y: krill.y }}
                  size={krill.size}
                  width={dimensions.width}
                  height={dimensions.height}
                  sharkPosition={position}
                  onEaten={() => {
                    setKrillList((prevList) => prevList.filter((k) => k.key !== krill.key));
                    setCreaturesEaten((prev) => prev + 1);
                  }}
              />
          ))}

          {/* Poison Fish */}
          {poisonFishList.map((poisonFish) => (
              <PoisonFish
                  key={poisonFish.key}
                  image={`${process.env.PUBLIC_URL}/assets/poison_fish.png`}
                  initialPosition={{ x: poisonFish.x, y: poisonFish.y }}
                  size={poisonFish.size}
                  width={dimensions.width}
                  height={dimensions.height}
                  sharkPosition={position}
                  onDamage={(damage) => {
                    setPoisonFishList((prevList) => prevList.filter((p) => p.key !== poisonFish.key));
                    takeDamage(damage);
                  }}
              />
          ))}

          {/* LifeFish1 (+5% health) */}
          {lifeFish1List.map((lifeFish1) => (
              <LifeFish
                  key={lifeFish1.key}
                  image={`${process.env.PUBLIC_URL}/assets/lifefish1.png`}
                  initialPosition={{ x: lifeFish1.x, y: lifeFish1.y }}
                  size={lifeFish1.size}
                  width={dimensions.width}
                  height={dimensions.height}
                  sharkPosition={position}
                  healingAmount={5}
                  lifeFishType={1}
                  onHealing={(healing) => {
                    setLifeFish1List((prevList) => prevList.filter((l) => l.key !== lifeFish1.key));
                    setCreaturesEaten((prev) => prev + 1);
                    restoreHealth(healing);
                  }}
              />
          ))}

          {/* LifeFish2 (+100% health) */}
          {lifeFish2List.map((lifeFish2) => (
              <LifeFish
                  key={lifeFish2.key}
                  image={`${process.env.PUBLIC_URL}/assets/lifefish2.png`}
                  initialPosition={{ x: lifeFish2.x, y: lifeFish2.y }}
                  size={lifeFish2.size}
                  width={dimensions.width}
                  height={dimensions.height}
                  sharkPosition={position}
                  healingAmount={100}
                  lifeFishType={2}
                  onHealing={(healing) => {
                    setLifeFish2List((prevList) => prevList.filter((l) => l.key !== lifeFish2.key));
                    setCreaturesEaten((prev) => prev + 1);
                    restoreHealth(healing);
                  }}
              />
          ))}

          {/* MadFish (Instant Death) */}
          {console.log(`🎮 Rendering madFishList:`, madFishList) || madFishList.map((madFish) => (
              <MadFish
                  key={madFish.key}
                  image={`${process.env.PUBLIC_URL}/assets/madfish.png`}
                  initialPosition={{ x: madFish.x, y: madFish.y }}
                  size={madFish.size}
                  width={dimensions.width}
                  height={dimensions.height}
                  sharkPosition={position}
                  onInstantDeath={() => {
                    setMadFishList((prevList) => prevList.filter((m) => m.key !== madFish.key));
                    takeDamage(health); // Deal damage equal to current health (instant death)
                  }}
              />
          ))}

          {/* Moving Character (only visible during game) */}
          {gameStarted && (
              <MovingSprite
                  image={`${process.env.PUBLIC_URL}/assets/${selectedCharacter}.png`}
                  position={position}
                  setPosition={setPosition}
                  moving={moving}
                  size={0.4}
                  width={dimensions.width}
                  height={dimensions.height}
                  speed={PLAYER_MOVEMENT_SPEED}
              />
          )}
        </Stage>
      </>
  );
};

export default SurvivalStage;