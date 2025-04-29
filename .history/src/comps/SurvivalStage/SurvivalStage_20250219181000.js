import React, { useState, useEffect } from 'react';
import { Sprite, Stage } from '@pixi/react';
import MovingSprite from '../Sprites/MovingFish/MovingFish';
import Fish from '../Sprites/Fish/Fish';

const MAX_FISH_COUNT = 10; // Maximum number of fish allowed

const SurvivalStage = () => {
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
  const [fishEaten, setFishEaten] = useState(0); // Fish eaten counter
  const [gameStarted, setGameStarted] = useState(false); // Game start state

  const randomFishImage = '/assets/fish.png'; // Fish image placeholder

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

  // Handle keyboard input for shark movement
  useEffect(() => {
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
  }, []);

  // Add fish periodically if under the max limit
  useEffect(() => {
    if (gameStarted) {
      const fishInterval = setInterval(() => {
        setFishList((prevList) => {
          if (prevList.length >= MAX_FISH_COUNT) {
            return prevList; // Prevent exceeding max fish count
          }

          const newFish = {
            key: Math.random(), // Unique key
            x: dimensions.width, // Start at right edge
            y: Math.random() * dimensions.height, // Random vertical position
            size: Math.random() * 0.12 + 0.05, // Random size
          };

          return [...prevList, newFish];
        });
      }, 1000); // Spawn fish every second

      return () => clearInterval(fishInterval);
    }
  }, [gameStarted, dimensions.width, dimensions.height]);

  // Move fish and handle wrap-around to the left
  useEffect(() => {
    const fishMoveInterval = setInterval(() => {
      setFishList((prevFishList) =>
        prevFishList.map((fish) => ({
          ...fish,
          x: fish.x - 2 < -50 ? dimensions.width : fish.x - 2, // Move left, wrap around
        }))
      );
    }, 16); // 60 FPS movement

    return () => clearInterval(fishMoveInterval);
  }, [dimensions.width]);

  // Collision detection between shark and fish
  useEffect(() => {
    const checkCollision = () => {
      setFishList((prevFishList) => {
        return prevFishList.filter((fish) => {
          const distance = Math.hypot(fish.x - position.x, fish.y - position.y);
          if (distance < 50) {
            setFishEaten((prevCount) => prevCount + 1); // Increase fish eaten count
            return false; // Remove eaten fish
          }
          return true;
        });
      });
    };

    const collisionInterval = setInterval(checkCollision, 16); // Check frequently

    return () => clearInterval(collisionInterval);
  }, [position]);

  return (
    <>
      {/* Start button */}
      {!gameStarted && (
        <button onClick={() => setGameStarted(true)} style={{ position: 'absolute', top: 20, left: 20 }}>
          Start Game
        </button>
      )}

      {/* Fish eaten counter */}
      <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '24px', color: 'white' }}>
        Fish Eaten: {fishEaten}
      </div>

      {/* Fish count display */}
      <div style={{ position: 'absolute', top: 60, right: 20, fontSize: '20px', color: 'white' }}>
        Fish Count: {fishList.length}/{MAX_FISH_COUNT}
      </div>

      <Stage width={dimensions.width} height={dimensions.height} options={{ backgroundColor: 0x1099bb }}>
        {/* Background */}
        <Sprite
          image={`${process.env.PUBLIC_URL}/assets/underWaterBG.png`}
          width={dimensions.width}
          height={dimensions.height}
        />

        {/* Fish moving across the screen */}
        {fishList.map((fish) => (
          <Fish
            key={fish.key}
            image={randomFishImage}
            position={{ x: fish.x, y: fish.y }}
            size={fish.size}
            width={dimensions.width}
            height={dimensions.height}
            onEaten={() => setFishList((prevFishList) => prevFishList.filter(f => f.key !== fish.key))}
          />
        ))}

        {/* Moving Shark */}
        <MovingSprite
          image={`${process.env.PUBLIC_URL}/assets/shark.png`}
          position={position}
          setPosition={setPosition}
          moving={moving}
          size={0.4}
          width={dimensions.width}
          height={dimensions.height}
        />
      </Stage>
    </>
  );
};

export default SurvivalStage;
