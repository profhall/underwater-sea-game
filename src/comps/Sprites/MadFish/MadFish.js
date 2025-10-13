import React, { useState, useEffect, useCallback } from 'react';
import { Sprite } from '@pixi/react';
import { noise } from '@chriscourses/perlin-noise';

function MadFish({ image, width, height, size = 1, onInstantDeath = () => {}, initialPosition, sharkPosition }) {
  const surfaceLevel = height * 0.1;
  const sandLevel = height * 0.9;

  // MadFish movement properties - extremely aggressive and unpredictable
  const [fishCharacteristics, setFishCharacteristics] = useState(() => ({
    speedMultiplier: Math.random() * 2.5 + 1.5, // Very fast and aggressive
    turnFrequency: Math.random() * 0.12 + 0.05, // Extremely erratic turns
    verticalTendency: Math.random() * 1.5 + 0.005, // Chaotic vertical movement
    minHorizontalSpeed: Math.random() * 0.8 + 0.6, // Very fast minimum speed
    aggressionBoost: Math.random() * 2.0 + 1.0, // Random aggression bursts
  }));

  // MadFish position (uses initial position from SurvivalStage)
  const [position, setPosition] = useState(initialPosition);

  const [noiseOffset, setNoiseOffset] = useState({
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  });

  const [facingRight, setFacingRight] = useState(Math.random() < 0.5);
  const [angerIntensity, setAngerIntensity] = useState(1);
  const [pulseSpeed, setPulseSpeed] = useState(Math.random() * 0.01 + 0.005);

  // Move madfish function - chaotic, deadly movement pattern
  const moveMadFish = useCallback(() => {
    setNoiseOffset((prev) => ({
      x: prev.x + fishCharacteristics.turnFrequency,
      y: prev.y + fishCharacteristics.turnFrequency,
    }));

    // Add angry pulsing effect for madfish (warning visual)
    setAngerIntensity(prev => {
      const angerValue = Math.sin(Date.now() * pulseSpeed) * 0.3 + 1.1;
      return angerValue;
    });

    setPosition((prevPos) => {
      if (!prevPos) return null; // Stop rendering if fish is removed

      let noiseX = (noise(noiseOffset.x) * 2 - 1) * fishCharacteristics.speedMultiplier;
      let noiseY = (noise(noiseOffset.y) * 2 - 1) * fishCharacteristics.verticalTendency * fishCharacteristics.speedMultiplier;

      // Add extreme aggressive bursts (madfish are extremely dangerous)
      if (Math.random() < 0.05) {
        noiseX *= fishCharacteristics.aggressionBoost * 3;
        noiseY *= fishCharacteristics.aggressionBoost * 3;
      }

      // Add random direction changes for unpredictability
      if (Math.random() < 0.03) {
        noiseX *= -1;
        noiseY *= -1;
      }

      // Ensure very high minimum movement speed
      if (Math.abs(noiseX) < fishCharacteristics.minHorizontalSpeed) {
        noiseX = noiseX >= 0 ? fishCharacteristics.minHorizontalSpeed : -fishCharacteristics.minHorizontalSpeed;
      }

      let newX = prevPos.x + noiseX * 4.0; // Much faster than other fish
      let newY = prevPos.y + noiseY * 3.0; // Aggressive vertical movement

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
  }, [width, height, surfaceLevel, sandLevel, noiseOffset, fishCharacteristics, pulseSpeed]);

  // Start madfish movement
  useEffect(() => {
    const animationId = requestAnimationFrame(function animate() {
      moveMadFish();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [moveMadFish]);

  const [collided, setCollided] = useState(false);

  // Collision detection - check if shark center overlaps with madfish
  useEffect(() => {
    if (!collided && sharkPosition && position) {
      const distance = Math.hypot(position.x - sharkPosition.x, position.y - sharkPosition.y);

      // Collision radius for madfish - larger to make them more dangerous
      const baseCollisionRadius = 65; // Larger than poison fish for increased danger
      const fishSizeBonus = Math.max(size * 25, 15); // Generous danger radius
      const collisionRadius = baseCollisionRadius + fishSizeBonus;

      if (distance < collisionRadius) {
        console.log(`💀 MADFISH TOUCHED! INSTANT DEATH! Distance: ${distance.toFixed(2)}, Radius: ${collisionRadius.toFixed(2)}`);
        setCollided(true);
        onInstantDeath(); // Instantly kill the player
      }
    }
  }, [position, sharkPosition, collided, onInstantDeath, size]);

  // Remove madfish if it's been touched (collision detected)
  if (collided) {
    return null;
  }

  return (
    <Sprite
      image={image}
      x={position.x}
      y={position.y}
      anchor={0.5}
      scale={{
        x: facingRight ? size * angerIntensity : -size * angerIntensity,
        y: size * angerIntensity
      }}
      alpha={0.9 + Math.sin(Date.now() * pulseSpeed * 2) * 0.1} // Menacing flicker effect
      tint={0xFF4444} // Slight red tint to indicate danger
    />
  );
}

export default MadFish;