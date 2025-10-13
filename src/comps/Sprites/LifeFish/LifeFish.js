import React, { useState, useEffect, useCallback } from 'react';
import { Sprite } from '@pixi/react';
import { noise } from '@chriscourses/perlin-noise';

function LifeFish({ image, width, height, size = 1, onHealing = () => {}, initialPosition, sharkPosition, healingAmount = 5, lifeFishType = 1 }) {
  const surfaceLevel = height * 0.1;
  const sandLevel = height * 0.9;

  // LifeFish movement properties - slower and more graceful than regular fish
  const [fishCharacteristics, setFishCharacteristics] = useState(() => ({
    speedMultiplier: Math.random() * 1.0 + 0.4, // Slower than regular fish
    turnFrequency: Math.random() * 0.04 + 0.01, // Gentle turns
    verticalTendency: Math.random() * 0.6 + 0.002, // Less vertical movement
    minHorizontalSpeed: Math.random() * 0.3 + 0.2, // Gentle minimum speed
  }));

  // LifeFish position (uses initial position from SurvivalStage)
  const [position, setPosition] = useState(initialPosition);

  const [noiseOffset, setNoiseOffset] = useState({
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  });

  const [facingRight, setFacingRight] = useState(Math.random() < 0.5);
  const [glowIntensity, setGlowIntensity] = useState(1);

  // Move lifefish function - peaceful, healing movement
  const moveLifeFish = useCallback(() => {
    setNoiseOffset((prev) => ({
      x: prev.x + fishCharacteristics.turnFrequency,
      y: prev.y + fishCharacteristics.turnFrequency,
    }));

    // Add gentle glow effect for lifefish
    setGlowIntensity(prev => {
      const glowValue = Math.sin(Date.now() * 0.003) * 0.2 + 0.9;
      return glowValue;
    });

    setPosition((prevPos) => {
      if (!prevPos) return null; // Stop rendering if fish is removed

      let noiseX = (noise(noiseOffset.x) * 2 - 1) * fishCharacteristics.speedMultiplier;
      let noiseY = (noise(noiseOffset.y) * 2 - 1) * fishCharacteristics.verticalTendency * fishCharacteristics.speedMultiplier;

      // Ensure minimum horizontal movement
      if (Math.abs(noiseX) < fishCharacteristics.minHorizontalSpeed) {
        noiseX = noiseX >= 0 ? fishCharacteristics.minHorizontalSpeed : -fishCharacteristics.minHorizontalSpeed;
      }

      let newX = prevPos.x + noiseX * 2.5; // Slower than regular fish
      let newY = prevPos.y + noiseY * 1.2; // Gentler vertical movement

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

  // Start lifefish movement
  useEffect(() => {
    const animationId = requestAnimationFrame(function animate() {
      moveLifeFish();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [moveLifeFish]);

  const [collided, setCollided] = useState(false);

  // Collision detection - check if shark center overlaps with lifefish
  useEffect(() => {
    if (!collided && sharkPosition && position) {
      const distance = Math.hypot(position.x - sharkPosition.x, position.y - sharkPosition.y);

      // Collision radius for lifefish - larger to make them easier to catch (they're beneficial)
      const baseCollisionRadius = 60; // Larger than regular fish for easier collection
      const fishSizeBonus = Math.max(size * 22, 12); // Generous bonus
      const collisionRadius = baseCollisionRadius + fishSizeBonus;

      if (distance < collisionRadius) {
        const lifeFishName = lifeFishType === 1 ? 'LifeFish1' : 'LifeFish2';
        console.log(`💖 ${lifeFishName} collected! Healing +${healingAmount} health. Distance: ${distance.toFixed(2)}, Radius: ${collisionRadius.toFixed(2)}`);
        setCollided(true);
        onHealing(healingAmount);
      }
    }
  }, [position, sharkPosition, collided, onHealing, healingAmount, lifeFishType, size]);

  // Remove lifefish if it's been collected (collision detected)
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
        x: facingRight ? size * glowIntensity : -size * glowIntensity,
        y: size * glowIntensity
      }}
      alpha={glowIntensity}
    />
  );
}

export default LifeFish;