import React from 'react';
import { Stage, Sprite } from 'react-pixi-fiber';
import Fish from './Fish';
import * as PIXI from 'pixi.js';
import underwaterBackground from './assets/underwaterBackground.jpg';
import fishImage from './assets/fish.png';

function UnderwaterScene() {
  const fishArray = Array.from({ length: 5 }); // Create 5 fish

  const backgroundTexture = PIXI.Texture.from(underwaterBackground);
  const fishTexture = PIXI.Texture.from(fishImage);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} options={{ backgroundColor: 0x1a237e }}>
      <Sprite texture={backgroundTexture} x={0} y={0} width={window.innerWidth} height={window.innerHeight} />
      {fishArray.map((_, index) => (
        <Fish key={index} image={fishTexture} />
      ))}
    </Stage>
  );
}

export default UnderwaterScene;
