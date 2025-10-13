import React, { useState, useEffect, useCallback } from 'react';
import { Sprite } from '@pixi/react';
import { noise } from '@chriscourses/perlin-noise';

function PoisonFish({ image, width, height, size = 1, onDamage = () => {}, initialPosition, sharkPosition }) {
  const surfaceLevel = height * 0.1;
  const sandLevel = height * 0.9;

  // Poison fish movement properties - more erratic than regular fish
  const [fishCharacteristics, setFishCharacteristics] = useState(() => ({
    speedMultiplier: Math.random() * 1.8 + 0.7, // Slightly faster and more erratic
    turnFrequency: Math.random() * 0.08 + 0.02, // More frequent direction changes
    verticalTendency: Math.random() * 1.0 + 0.003, // More vertical movement
    minHorizontalSpeed: Math.random() * 0.5 + 0.4, // Faster minimum speed
  }));

  // Poison fish position (uses initial position from SurvivalStage)
  const [position, setPosition] = useState(initialPosition);

  const [noiseOffset, setNoiseOffset] = useState({
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  });

  const [facingRight, setFacingRight] = useState(Math.random() < 0.5);

  // Move poison fish function - more aggressive movement pattern
  const movePoisonFish = useCallback(() => {
    setNoiseOffset((prev) => ({
      x: prev.x + fishCharacteristics.turnFrequency,
      y: prev.y + fishCharacteristics.turnFrequency,
    }));

    setPosition((prevPos) => {
      if (!prevPos) return null; // Stop rendering if fish is removed

      let noiseX = (noise(noiseOffset.x) * 2 - 1) * fishCharacteristics.speedMultiplier;
      let noiseY = (noise(noiseOffset.y) * 2 - 1) * fishCharacteristics.verticalTendency * fishCharacteristics.speedMultiplier;

      // Add occasional aggressive bursts (poison fish are more dangerous)
      if (Math.random() < 0.02) {
        noiseX *= 2.5;
        noiseY *= 2.5;
      }

      // Ensure minimum horizontal movement
      if (Math.abs(noiseX) < fishCharacteristics.minHorizontalSpeed) {
        noiseX = noiseX >= 0 ? fishCharacteristics.minHorizontalSpeed : -fishCharacteristics.minHorizontalSpeed;
      }

      let newX = prevPos.x + noiseX * 3.5; // Slightly faster than regular fish
      let newY = prevPos.y + noiseY * 2.0; // More vertical movement

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

  // Start poison fish movement
  useEffect(() => {
    const animationId = requestAnimationFrame(function animate() {
      movePoisonFish();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [movePoisonFish]);

  const [collided, setCollided] = useState(false);

  // Collision detection - check if shark center overlaps with poison fish
  useEffect(() => {
    if (!collided && sharkPosition && position) {
      const distance = Math.hypot(position.x - sharkPosition.x, position.y - sharkPosition.y);

      // Collision radius for poison fish - slightly smaller to make them more challenging
      const baseCollisionRadius = 45; // Smaller than regular fish for challenge
      const fishSizeBonus = Math.max(size * 18, 8); // Smaller bonus
      const collisionRadius = baseCollisionRadius + fishSizeBonus;

      if (distance < collisionRadius) {
        console.log(`☠️ Poison fish touched! Taking 25% damage. Distance: ${distance.toFixed(2)}, Radius: ${collisionRadius.toFixed(2)}`);
        setCollided(true);
        onDamage(25); // Deal 25% damage (25 out of 100 health)
      }
    }
  }, [position, sharkPosition, collided, onDamage, size]);

  // Remove poison fish if it's been touched (collision detected)
  if (collided) {
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

export default PoisonFish;