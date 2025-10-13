import React, { useState, useEffect, useCallback } from 'react';
import { Container, Graphics } from '@pixi/react';

const Bubble = ({ x, y, radius, alpha }) => (
  <Graphics
    draw={useCallback((g) => {
      g.clear();
      g.beginFill(0xFFFFFF, alpha);
      g.drawCircle(x, y, radius);
      g.endFill();
    }, [x, y, radius, alpha])}
  />
);

const Bubbles = ({ width, height, count = 50 }) => {
  const [bubbles, setBubbles] = useState([]);

  const createBubble = useCallback(() => ({
    x: Math.random() * width,
    y: height + Math.random() * 20,
    speed: Math.random() * 1 + 0.5,
    radius: Math.random() * 8 + 2,
    alpha: Math.random() * 0.3 + 0.1,
  }), [width, height]);

  useEffect(() => {
    setBubbles(Array(count).fill().map(createBubble));
  }, [count, createBubble]);

  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;

    const animateBubbles = (currentTime) => {
      // Target 60 FPS (16.67ms per frame)
      if (currentTime - lastTime >= 16.67) {
        setBubbles(prevBubbles =>
          prevBubbles.map(bubble => {
            const newBubble = { ...bubble };
            newBubble.y -= newBubble.speed;
            if (newBubble.y < -10) {
              return createBubble();
            }
            return newBubble;
          })
        );
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animateBubbles);
    };

    animationFrameId = requestAnimationFrame(animateBubbles);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [createBubble]);

  return (
    <Container>
      {bubbles.map((bubble, index) => (
        <Bubble
          key={index}
          x={bubble.x}
          y={bubble.y}
          radius={bubble.radius}
          alpha={bubble.alpha}
        />
      ))}
    </Container>
  );
};

export default Bubbles;