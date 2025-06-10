import React, { useState, useEffect } from 'react';
import { Stage, Sprite, Container } from '@pixi/react';
import Fish from './Sprites/Fish/Fish';
import Bubbles from './Sprites/Bubble/Bubble';
import Squid from './Sprites/Squid/Squid';
import Krill from './Sprites/Krill/Krill';
import MenuButton from './MenuButton/MenuButton';

function UnderwaterScene({ onShowMenu }) {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [textures, setTextures] = useState({
    background: null,
    fish: [],
  });
  const [error, setError] = useState(null);
  const [seaCreatures, setSeaCreatures] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
          background: `${process.env.PUBLIC_URL}/assets/underWaterBG.png`,
          fish: fishImages,
          shark: `${process.env.PUBLIC_URL}/assets/shark.png`,
          squid: `${process.env.PUBLIC_URL}/assets/sad_squid.png`,
          krill: `${process.env.PUBLIC_URL}/assets/krill.png`,
          orca: `${process.env.PUBLIC_URL}/assets/orca.png`,
          sperm: `${process.env.PUBLIC_URL}/assets/sperm.png`,
        });
      } catch (err) {
        console.error('Error loading textures:', err);
        setError('Failed to load textures. Please check the console for more details.');
      }
    };

    loadTextures();
  }, []);

  // Generate diverse sea creatures
  useEffect(() => {
    if (!textures.background || textures.fish.length === 0) return;

    const creatures = [];
    
    // Generate varied fish (15-20)
    const fishCount = Math.floor(Math.random() * 6) + 15;
    for (let i = 0; i < fishCount; i++) {
      creatures.push({
        type: 'fish',
        key: `fish-${i}`,
        image: textures.fish[Math.floor(Math.random() * textures.fish.length)],
        size: Math.random() * 0.06 + 0.02,
        initialPosition: {
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height * 0.7 + dimensions.height * 0.15
        },
        depth: Math.random() // For layering
      });
    }

    // Generate squid (2-4)
    const squidCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < squidCount; i++) {
      creatures.push({
        type: 'squid',
        key: `squid-${i}`,
        image: textures.squid,
        size: Math.random() * 0.08 + 0.06,
        initialPosition: {
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height * 0.5 + dimensions.height * 0.3
        },
        depth: Math.random() * 0.5 + 0.3 // Middle depth
      });
    }

    // Generate krill swarms (1-3)
    const krillCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < krillCount; i++) {
      creatures.push({
        type: 'krill',
        key: `krill-${i}`,
        image: textures.krill,
        size: Math.random() * 0.02 + 0.01,
        initialPosition: {
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height * 0.4 + dimensions.height * 0.4
        },
        depth: Math.random() * 0.3 + 0.6 // Background
      });
    }

    // Generate large marine life (1-2 sharks, 0-1 whales)
    const sharkCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < sharkCount; i++) {
      creatures.push({
        type: 'shark',
        key: `shark-${i}`,
        image: textures.shark,
        size: Math.random() * 0.1 + 0.15,
        initialPosition: {
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height * 0.6 + dimensions.height * 0.2
        },
        depth: Math.random() * 0.2 // Foreground
      });
    }

    // Occasional whale
    if (Math.random() < 0.7) {
      const whaleType = Math.random() < 0.5 ? 'orca' : 'sperm';
      creatures.push({
        type: 'whale',
        key: 'whale-0',
        image: whaleType === 'orca' ? textures.orca : textures.sperm,
        size: Math.random() * 0.15 + 0.2,
        initialPosition: {
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height * 0.4 + dimensions.height * 0.3
        },
        depth: 0.1 // Very foreground
      });
    }

    // Sort by depth for proper layering
    creatures.sort((a, b) => b.depth - a.depth);
    setSeaCreatures(creatures);
  }, [textures, dimensions]);

  // Mouse interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!textures.background || textures.fish.length === 0 || seaCreatures.length === 0) {
    return <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Loading Ocean Life...</div>;
  }

  const renderCreature = (creature) => {
    const baseProps = {
      key: creature.key,
      image: creature.image,
      width: dimensions.width,
      height: dimensions.height,
      size: creature.size,
      initialPosition: creature.initialPosition
    };

    switch (creature.type) {
      case 'fish':
      case 'shark':
      case 'whale':
        return <Fish {...baseProps} />;
      case 'squid':
        return <Squid {...baseProps} />;
      case 'krill':
        return <Krill {...baseProps} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Aquarium Info Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4CAF50' }}>🌊 Aquarium Info</div>
        <div>Fish: {seaCreatures.filter(c => c.type === 'fish').length}</div>
        <div>Squid: {seaCreatures.filter(c => c.type === 'squid').length}</div>
        <div>Krill Swarms: {seaCreatures.filter(c => c.type === 'krill').length}</div>
        <div>Sharks: {seaCreatures.filter(c => c.type === 'shark').length}</div>
        <div>Whales: {seaCreatures.filter(c => c.type === 'whale').length}</div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaa' }}>
          Move mouse to create currents
        </div>
        <button
          onClick={() => {
            // Regenerate ecosystem
            setSeaCreatures([]);
            setTimeout(() => {
              // Trigger regeneration by changing textures reference
              setTextures(prev => ({ ...prev }));
            }, 100);
          }}
          style={{
            marginTop: '10px',
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          🔄 New Ecosystem
        </button>
      </div>

      {/* Menu button */}
      {onShowMenu && (
        <MenuButton onClick={onShowMenu} />
      )}

      <Stage
        width={dimensions.width}
        height={dimensions.height}
        options={{
          backgroundAlpha: 0,
          eventMode: 'passive',
        }}
      >
        <Container eventMode="passive">
          {/* Background */}
          <Sprite
            image={textures.background}
            width={dimensions.width}
            height={dimensions.height}
          />

          {/* Enhanced bubble effects */}
          <Bubbles width={dimensions.width} height={dimensions.height} count={8} />
          
          {/* Additional bubble streams */}
          <Bubbles width={dimensions.width} height={dimensions.height} count={4} />

          {/* Render all sea creatures in depth order */}
          {seaCreatures.map(renderCreature)}

        </Container>
      </Stage>
    </div>
  );
}

export default UnderwaterScene;