import React, { useState, useEffect } from 'react';
import { Sprite, Stage } from '@pixi/react';
import MovingSprite from '../Sprites/MovingFish/MovingFish';
import Fish from '../Sprites/Fish/Fish';
import Squid from '../Sprites/Squid/Squid';
import Krill from '../Sprites/Krill/Krill';
import MenuButton from '../MenuButton/MenuButton';

const MAX_TOTAL_CREATURES =  50; // Total creatures across all types

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
  const [creaturesEaten, setCreaturesEaten] = useState(0); // Creatures eaten counter
  const [gameStarted, setGameStarted] = useState(false); // Game start state
  const [selectedCharacter, setSelectedCharacter] = useState('shark'); // Default character
  const [characterSelected, setCharacterSelected] = useState(false); // Flag to track if character selection is complete
  const [health, setHealth] = useState(100); // Player health (0-100)
  const [maxHealth] = useState(100); // Maximum health

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

  // Function to spawn creatures based on the selected character
  const spawnCreatures = () => {
    let fishCount, squidCount, krillCount;

    // Determine creature distribution based on selected character
    switch(selectedCharacter) {
      case 'orca':
        // 50% fish, 50% squid
        fishCount = Math.floor(MAX_TOTAL_CREATURES * 0.5);
        squidCount = MAX_TOTAL_CREATURES - fishCount;
        krillCount = 0;
        break;
      case 'sperm':
        // 50% fish, 25% squid, 25% krill
        fishCount = Math.floor(MAX_TOTAL_CREATURES * 0.5);
        squidCount = Math.floor(MAX_TOTAL_CREATURES * 0.25);
        krillCount = MAX_TOTAL_CREATURES - fishCount - squidCount;
        break;
      default: // shark
        // Default distribution: 60% fish, 20% squid, 20% krill
        fishCount = Math.floor(MAX_TOTAL_CREATURES * 0.6);
        squidCount = Math.floor(MAX_TOTAL_CREATURES * 0.2);
        krillCount = MAX_TOTAL_CREATURES - fishCount - squidCount;
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
  };

  // Spawn creatures when the game starts
  useEffect(() => {
    if (gameStarted) {
      spawnCreatures();
    }
  }, [gameStarted, dimensions.width, dimensions.height]);

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

  // Function to take damage (for future use with hostile fish)
  // Usage: takeDamage(20) to remove 20 health points
  const takeDamage = (damage) => {
    setHealth(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      if (newHealth <= 0) {
        // Game over logic can be added here
        console.log("Game Over! Health reached 0");
      }
      return newHealth;
    });
  };

  // Function to reset the game
  const resetGame = () => {
    setGameStarted(false);
    setCharacterSelected(false);
    setFishList([]);
    setSquidList([]);
    setKrillList([]);
    setCreaturesEaten(0);
    setHealth(maxHealth); // Reset health to full
  };

  return (
      <>
        {/* Character selection screen (before game starts) */}
        {!characterSelected && (
            <CharacterSelect
                onSelect={setSelectedCharacter}
                currentCharacter={selectedCharacter}
                onStartGame={startGame}
            />
        )}

        {/* Game interface (when game is running) */}
        {gameStarted && (
            <>
              {/* Score counter */}
              <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '24px', color: 'white' }}>
                Score: {creaturesEaten}
              </div>

              {/* Health bar */}
              <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ color: 'white', fontSize: '16px', marginBottom: '5px' }}>Health</div>
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
                <div style={{ color: 'white', fontSize: '14px', marginTop: '3px' }}>{health}/{maxHealth}</div>
              </div>

              {/* Creature counts display */}
              <div style={{ position: 'absolute', top: 60, right: 20, fontSize: '16px', color: 'white' }}>
                <div>Fish: {fishList.length}</div>
                <div>Squid: {squidList.length}</div>
                <div>Krill: {krillList.length}</div>
              </div>

              {/* Game control buttons */}
              <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: '10px' }}>
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
              />
          )}
        </Stage>
      </>
  );
};

export default SurvivalStage;