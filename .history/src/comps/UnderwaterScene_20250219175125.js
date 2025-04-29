import React, { useState, useEffect } from 'react';
import { Stage, Sprite, Container } from '@pixi/react';
import Fish from './Sprites/Fish/Fish';
import Bubbles from './Sprites/Bubble/Bubble';

function UnderwaterScene() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [textures, setTextures] = useState({
    background: null,
    fish: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const loadTextures = async () => {
      try {
        // Array of fish image paths
        const fishImages = [
          `${process.env.PUBLIC_URL}/assets/fish.png`,
          `${process.env.PUBLIC_URL}/assets/fish2.png`,
          `${process.env.PUBLIC_URL}/assets/fish3.png`,
        ];

        setTextures({
          background: `${process.env.PUBLIC_URL}/underwaterBackground.jpg.jpg`,
          fish: fishImages,
          shark: `${process.env.PUBLIC_URL}/assets/shark.png`,
        });
      } catch (err) {
        console.error('Error loading textures:', err);
        setError('Failed to load textures. Please check the console for more details.');
      }
    };

    loadTextures();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!textures.background || textures.fish.length === 0) {
    return <div>Loading...</div>;
  }

  const fishArray = Array.from({ length: 25 });

  return (
    <Stage
      width={dimensions.width}
      height={dimensions.height}
      options={{
        backgroundAlpha: 0,
        eventMode: 'passive',
      }}
    >
      <Container eventMode="passive">
        <Sprite
          image={textures.background}
          width={dimensions.width}
          height={dimensions.height}
        />
                <Bubbles width={dimensions.width} height={dimensions.height} count={2} />

        {fishArray.map((_, index) => {
          const size = Math.random() * ( 0.07) + 0.009;
          const randomFishImage = textures.fish[Math.floor(Math.random() * textures.fish.length)];

          return (
            <Fish
              key={index}
              image={randomFishImage}
              width={dimensions.width}
              height={dimensions.height}
              size={size}
            />
          );
        })}
        <Fish
             key={207}
             image={textures.shark}
             width={dimensions.width}
             height={dimensions.height}
             size={.15}
           />
         <Fish
              key={205}
              image={textures.shark}
              width={dimensions.width}
              height={dimensions.height}
              size={.25}
            />
      </Container>
    </Stage>
  );
}

export default UnderwaterScene;