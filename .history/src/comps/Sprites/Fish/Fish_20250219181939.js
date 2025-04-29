import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sprite } from '@pixi/react';
import { noise } from '@chriscourses/perlin-noise';

function Fish({ image, width, height, size = 1, onEaten }) {
  const surfaceLevel = height * 0.1;
  const sandLevel = height * 0.9;
// If position is null (fish is removed), don't render the sprite
  if (!position) {
    onEaten(); // Notify parent component to update fishList
    return null;
  }
  

  const [fishCharacteristics, setFishCharacteristics] = useState(() => ({
    speedMultiplier: Math.random() * 1.5 + 0.5,
    turnFrequency: Math.random() * 0.05 + 0.01, // Higher turn frequency range
    verticalTendency: Math.random() * 0.8 + 0.002,
    minHorizontalSpeed: Math.random() * 0.4 + 0.3,
  }));


  const [position, setPosition] = useState(() => ({
    x: Math.random() * width,
    y: Math.random() * (sandLevel - surfaceLevel) + surfaceLevel,
  }));

  const [noiseOffset, setNoiseOffset] = useState(() => ({
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  }));

  const [facingRight, setFacingRight] = useState(() => Math.random() < 0.5);

  const moveFish = useCallback(() => {
    setNoiseOffset(prev => ({
      x: prev.x + fishCharacteristics.turnFrequency,
      y: prev.y + fishCharacteristics.turnFrequency,
    }));
  
    setPosition(prevPos => {
      let noiseX = (noise(noiseOffset.x) * 2 - 1) * fishCharacteristics.speedMultiplier;
      let noiseY = (noise(noiseOffset.y) * 2 - 1) * fishCharacteristics.verticalTendency * fishCharacteristics.speedMultiplier;
  
      // Ensure minimum horizontal movement
      if (Math.abs(noiseX) < fishCharacteristics.minHorizontalSpeed) {
        noiseX = noiseX >= 0 ? fishCharacteristics.minHorizontalSpeed : -fishCharacteristics.minHorizontalSpeed;
      }
  
      let newX = prevPos.x + noiseX * 3;
      let newY = prevPos.y + noiseY * 1.5;
  
      // Wrap around horizontally
      if (newX < -100) {
        newX = width ;
        setNoiseOffset(prev => ({
          x: Math.random() * 1000 + 4,
          y: Math.random() * 1000 + 4,
        }));

        setFishCharacteristics(prev => ({
          speedMultiplier: Math.random() * 1.5 + 0.5,
          verticalTendency: Math.random() * 0.8 + 0.2,
          minHorizontalSpeed: Math.random() * 0.4 + 0.3,
          turnFrequency: Math.random() * 0.05 + 0.01, // Adjust turn frequency
        }));

        setPosition({
          x: newX + 100,
          y: Math.random() * (sandLevel - surfaceLevel) + surfaceLevel,
        })

        setFacingRight(Math.random() < 0.5); // Randomly flip direction

      } else if (newX > width + 100) {
        newX = -50 ;
        setNoiseOffset(prev => ({
          x: Math.random() * 1000 + 2,
          y: Math.random() * 1000 + 2,
        }));

        setFishCharacteristics(prev => ({
          speedMultiplier: Math.random() * 1.5 + 0.5,
          verticalTendency: Math.random() * 0.8 + 0.002,
          minHorizontalSpeed: Math.random() * 0.4 + 0.3,
          turnFrequency: Math.random() * 0.05 + 0.01, // Adjust turn frequency
        }));

        setPosition({
          x: newX + 100,
          y: Math.random() * (sandLevel - surfaceLevel) + surfaceLevel,
        })

        setFacingRight(Math.random() < 0.5); // Randomly flip direction
        
      }
  
      // Bounce off surface and sand
      if (newY < surfaceLevel) {
        newY = surfaceLevel;
        setNoiseOffset(prev => ({ ...prev, y: Math.random() * 1000 }));
      } else if (newY > sandLevel) {
        newY = sandLevel;
        setNoiseOffset(prev => ({ ...prev, y: Math.random() * 1000 }));
      }
  
      setFacingRight(noiseX > 0); // Update direction based on movement
  
      return { x: newX, y: newY };
    });
  }, [width, height, surfaceLevel, sandLevel, noiseOffset, fishCharacteristics]);
  
  useEffect(() => {
    const animationId = requestAnimationFrame(function animate() {
      moveFish();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [moveFish]);

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
