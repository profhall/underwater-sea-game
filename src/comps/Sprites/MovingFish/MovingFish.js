import React, { useEffect } from 'react';
import { Sprite } from '@pixi/react';

function MovingSprite({ image, width, height, size = 1, position, setPosition, moving }) {
  const speed = 50; // Movement speed in pixels

  useEffect(() => {
    const moveSprite = () => {
      setPosition(prevPos => {
        let newX = prevPos.x;
        let newY = prevPos.y;

        if (moving === 'up') {
          newY -= speed; // Move up
        } else if (moving === 'down') {
          newY += speed; // Move down
        } else if (moving === 'right') {
          newX += speed; // Move right
        } else if (moving === 'left') {
          newX -= speed; // Move left
        }

        // Constrain the new position to avoid going outside the visible area
        newY = Math.max(Math.min(newY, height - size * 50), size * 50);
        newX = Math.max(Math.min(newX, width - size * 50), size * 50);

        return { x: newX, y: newY };
      });
    };

    // If a key is pressed, move the sprite continuously
    if (moving) {
      const intervalId = setInterval(moveSprite, 100); // Move every 100ms (adjust as needed)

      return () => clearInterval(intervalId); // Clean up interval on component unmount or when `moving` changes
    }
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
