import React, { useState, useEffect } from 'react';
import { Sprite, Stage } from '@pixi/react';
import MovingSprite from '../Sprites/MovingFish/MovingFish';
import Fish from '../Sprites/Fish/Fish';

const SurvivalStage = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [position, setPosition] = useState({
    x: 50, // Start near the left side of the screen
    y: dimensions.height / 2, // Centered vertically
  });

  const [moving, setMoving] = useState(null); // Control the direction of movement
  const [fishList, setFishList] = useState([]); // List of moving fish
  const [fishEaten, setFishEaten] = useState(0); // Counter for fish eaten
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started

  const randomFishImage = '/assets/fish.png'; // Placeholder for random fish images

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
      if (e.key === 'ArrowUp') {
        setMoving('up');
      } else if (e.key === 'ArrowDown') {
        setMoving('down');
      } else if (e.key === 'ArrowRight') {
        setMoving('right');
      } else if (e.key === 'ArrowLeft') {
        setMoving('left');
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(e.key)) {
        setMoving(null); // Stop movement
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Add fish from the right side when game starts
  useEffect(() => {
    if (gameStarted) {
      const fishInterval = setInterval(() => {
        const newFish = {
          key: Math.random(), // Unique key for each fish
          x: dimensions.width, // Start on the far right
          y: Math.random() * dimensions.height, // Random vertical position
          size: Math.random() * 0.12 + 0.05, // Random size between 0.1 and 0.3
        };
        setFishList((prevList) => [...prevList, newFish]);
      }, 1000); // Add new fish every second

      return () => clearInterval(fishInterval);
    }
  }, [gameStarted, dimensions.width, dimensions.height]);

  // Move fish from right to left and detect collision
  useEffect(() => {
    const fishMoveInterval = setInterval(() => {
      setFishList((prevFishList) =>
        prevFishList
          .map((fish) => ({
            ...fish,
            x: fish.x - 2, // Move fish to the left
          }))
          .filter((fish) => fish.x > -50) // Remove fish that have gone off-screen
      );
    }, 16); // Approx. 60fps

    return () => clearInterval(fishMoveInterval);
  }, []);

  // Collision detection between shark and fish
  useEffect(() => {
    const checkCollision = () => {
      setFishList((prevFishList) => {
        return prevFishList.filter((fish) => {
          const distance = Math.hypot(fish.x - position.x, fish.y - position.y);
          if (distance < 50) {
            // Collision detected, fish is eaten
            setFishEaten((prevCount) => prevCount + 1); // Increase fish eaten count
            return false; // Remove the eaten fish
          }
          return true;
        });
      });
    };

    const collisionInterval = setInterval(checkCollision, 16); // Check for collisions frequently

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

      {/* Fish eaten count */}
      <div style={{ position: 'absolute', top: 20, right: 20, fontSize: '24px', color: 'white' }}>
        Fish Eaten: {fishEaten}
      </div>

      <Stage width={dimensions.width} height={dimensions.height} options={{ backgroundColor: 0x1099bb }}>
        {/* Background */}
        <Sprite
          image={`${process.env.PUBLIC_URL}/assets/underWaterBG.png`}
          width={dimensions.width}
          height={dimensions.height}
        />

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

        {/* Fish moving from the right */}
        {fishList.map((fish) => (
          <Fish
            key={fish.key}
            image={randomFishImage} // Image for the fish
            position={{ x: fish.x, y: fish.y }} // Position of the fish
            size={fish.size} // Size of the fish
            width={dimensions.width}
            height={dimensions.height}
          />
        ))}
      </Stage>
    </>
  );
};

export default SurvivalStage;
