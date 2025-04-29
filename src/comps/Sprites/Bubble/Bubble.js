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
    const animateBubbles = () => {
      setBubbles(prevBubbles => 
        prevBubbles.map(bubble => {
          bubble.y -= bubble.speed;
          if (bubble.y < -10) {
            return createBubble();
          }
          return bubble;
        })
      );
    };

    const intervalId = setInterval(animateBubbles, 1000 / 60); // 60 FPS

    return () => clearInterval(intervalId);
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