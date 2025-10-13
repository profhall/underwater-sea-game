import React, { useEffect, useRef } from 'react';
import { Sprite } from '@pixi/react';

function MovingSprite({ image, width, height, size = 1, position, setPosition, moving, speed = 5 }) {
  // Default speed reduced from 8 to 5 for more controlled movement
  // Speed can now be passed as a prop for easy adjustment
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef();

  useEffect(() => {
    const moveSprite = () => {
      // Only move if a direction is being pressed
      if (moving) {
        setPosition(prevPos => {
          let newX = prevPos.x;
          let newY = prevPos.y;

          // Apply movement based on direction
          if (moving === 'up') {
            newY -= speed;
          } else if (moving === 'down') {
            newY += speed;
          } else if (moving === 'right') {
            newX += speed;
          } else if (moving === 'left') {
            newX -= speed;
          }

          // Constrain the new position to avoid going outside the visible area
          const spriteRadius = size * 25; // Half the sprite size for better boundaries
          newY = Math.max(Math.min(newY, height - spriteRadius), spriteRadius);
          newX = Math.max(Math.min(newX, width - spriteRadius), spriteRadius);

          return { x: newX, y: newY };
        });
      }

      // Continue the animation loop regardless of movement state
      animationFrameRef.current = requestAnimationFrame(moveSprite);
    };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(moveSprite);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [moving, height, width, size, speed, setPosition]);

  return (
    <Sprite
      image={image}
      x={position.x}
      y={position.y}
      anchor={0.5}
      scale={{ x: size, y: size }}
    />
  );
}

export default MovingSprite;
