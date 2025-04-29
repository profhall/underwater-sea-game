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
    background: '',
    fish: [],
    shark: ''
  });
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load and verify assets
  useEffect(() => {
    const loadTextures = async () => {
      try {
        const fishImages = [
          '/fish.png',
          '/fish2.png',
          '/fish3.png',
        ];

        // Verify all images exist before setting textures
        const imagePromises = [
          ...fishImages.map(src => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(`Failed to load: ${src}`);
            img.src = src;
          })),
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve('/assets/underwaterSceneWide.png');
            img.onerror = () => reject('Failed to load background');
            img.src = '/underwaterSceneWide.png';
          }),
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve('/assets/shark.png');
            img.onerror = () => reject('Failed to load shark');
            img.src = '/shark.png';
          })
        ];

        await Promise.all(imagePromises);

        setTextures({
          background: '/underwaterSceneWide.png',
          fish: fishImages,
          shark: '/shark.png'
        });
        
        setAssetsLoaded(true);
      } catch (err) {
        console.error('Error loading textures:', err);
        setError(`Failed to load assets: ${err.message}`);
      }
    };

    loadTextures();
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Scene</h2>
        <p>{error}</p>
        <p>Please ensure all assets are in the correct location:</p>
        <ul>
          <li>/public/underwaterSceneWide.png</li>
          <li>/public/fish.png</li>
          <li>/public/fish2.png</li>
          <li>/public/fish3.png</li>
          <li>/public/shark.png</li>
        </ul>
      </div>
    );
  }

  if (!assetsLoaded) {
    return <div>Loading assets...</div>;
  }

  const fishArray = Array.from({ length: 25 });

  return (
    <Stage
      width={dimensions.width}
      height={dimensions.height}
      options={{
        backgroundAlpha: 0,
        eventMode: 'passive',
        antialias: true,
      }}
    >
      <Container eventMode="passive">
        <Sprite
          image={textures.background}
          width={dimensions.width}
          height={dimensions.height}
        />
        
        <Bubbles width={dimensions.width} height={dimensions.height} count={20} />

        {fishArray.map((_, index) => {
          const size = Math.random() * 0.07 + 0.009;
          const randomFishImage = textures.fish[Math.floor(Math.random() * textures.fish.length)];

          return (
            <Fish
              key={`fish-${index}`}
              image={randomFishImage}
              width={dimensions.width}
              height={dimensions.height}
              size={size}
            />
          );
        })}

        <Fish
          key="shark-1"
          image={textures.shark}
          width={dimensions.width}
          height={dimensions.height}
          size={0.15}
        />
        
        <Fish
          key="shark-2"
          image={textures.shark}
          width={dimensions.width}
          height={dimensions.height}
          size={0.25}
        />
      </Container>
    </Stage>
  );
}

export default UnderwaterScene;