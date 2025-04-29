import React, { useState, useEffect, useCallback } from 'react';
import { Sprite } from '@pixi/react';
import { noise } from '@chriscourses/perlin-noise';

function Fish({ image, width, height, size = 1, onEaten, initialPosition, fishInfo, sharkPosition }) {
  console.log(`🐟 Fish rendered at: (${initialPosition.x}, ${initialPosition.y})`); // Debug log

  const surfaceLevel = height * 0.1;
  const sandLevel = height * 0.9;

  // Fish movement properties
  const [fishCharacteristics, setFishCharacteristics] = useState(() => ({
    speedMultiplier: Math.random() * 1.5 + 0.5,
    turnFrequency: Math.random() * 0.05 + 0.01,
    verticalTendency: Math.random() * 0.8 + 0.002,
    minHorizontalSpeed: Math.random() * 0.4 + 0.3,
  }));

  // Fish position (uses initial position from SurvivalStage)
  const [position, setPosition] = useState(initialPosition);

  const [noiseOffset, setNoiseOffset] = useState({
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  });

  const [facingRight, setFacingRight] = useState(Math.random() < 0.5);

  // Move fish function
  const moveFish = useCallback(() => {
    setNoiseOffset((prev) => ({
      x: prev.x + fishCharacteristics.turnFrequency,
      y: prev.y + fishCharacteristics.turnFrequency,
    }));

    setPosition((prevPos) => {
      if (!prevPos) return null; // Stop rendering if fish is removed

      let noiseX = (noise(noiseOffset.x) * 2 - 1) * fishCharacteristics.speedMultiplier;
      let noiseY = (noise(noiseOffset.y) * 2 - 1) * fishCharacteristics.verticalTendency * fishCharacteristics.speedMultiplier;

      // Ensure minimum horizontal movement
      if (Math.abs(noiseX) < fishCharacteristics.minHorizontalSpeed) {
        noiseX = noiseX >= 0 ? fishCharacteristics.minHorizontalSpeed : -fishCharacteristics.minHorizontalSpeed;
      }

      let newX = prevPos.x + noiseX * 3;
      let newY = prevPos.y + noiseY * 1.5;

      // Wrap fish when they leave the screen
      if (newX < -100) {
        newX = width + 50;
      } else if (newX > width + 100) {
        newX = -50;
      }

      // Prevent fish from going above/below boundaries
      if (newY < surfaceLevel) newY = surfaceLevel;
      if (newY > sandLevel) newY = sandLevel;

      setFacingRight(noiseX > 0);

      return { x: newX, y: newY };
    });
  }, [width, height, surfaceLevel, sandLevel, noiseOffset, fishCharacteristics]);

  // Start fish movement
  useEffect(() => {
    const animationId = requestAnimationFrame(function animate() {
      moveFish();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [moveFish]);
const [collided, setCollided] = useState(false);

 // Check for collision between the fish and the shark using updated positions
 useEffect(() => {
   if (!collided && sharkPosition && position) {
     const distance = Math.hypot(position.x - sharkPosition.x, position.y - sharkPosition.y);
     if (distance < 50) {
       console.log("🔥 Collision detected with fish info:", fishInfo);
       setCollided(true); // Prevent multiple calls
       onEaten();
     }
   }
 }, [position, sharkPosition, collided, fishInfo, onEaten]);
  // Remove fish if it's eaten
  if (!position) {
    onEaten();
    return null;
  }

  return (
    <Sprite
      image={image}
      x={position.x}
      y={position.y}
      anchor={0.5}
      scale={{ x: facingRight ? size : -size, y: size }}
    />
  );
}

export default Fish;
