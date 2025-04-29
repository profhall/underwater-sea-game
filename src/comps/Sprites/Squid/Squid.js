import React, { useState, useEffect, useCallback } from 'react';
import { Sprite } from '@pixi/react';
import { noise } from '@chriscourses/perlin-noise';

function Squid({ image, width, height, size = 1, onEaten, initialPosition, fishInfo, sharkPosition }) {
    // console.log(`🦑 Squid rendered at: (${initialPosition.x}, ${initialPosition.y})`); // Debug log

    const surfaceLevel = height * 0.1;
    const sandLevel = height * 0.9;

    // Squid movement properties - different from fish to give unique behavior
    const [squidCharacteristics, setSquidCharacteristics] = useState(() => ({
        speedMultiplier: Math.random() * 1.2 + 0.6, // Slightly faster than fish
        turnFrequency: Math.random() * 0.06 + 0.02, // More erratic turns
        verticalTendency: Math.random() * 1.2 + 0.003, // More vertical movement
        minHorizontalSpeed: Math.random() * 0.3 + 0.2, // Can move slower horizontally
        pulseRate: Math.random() * 0.05 + 0.02, // Pulsing movement
    }));

    // Squid position (uses initial position from SurvivalStage)
    const [position, setPosition] = useState(initialPosition);

    const [noiseOffset, setNoiseOffset] = useState({
        x: Math.random() * 1000,
        y: Math.random() * 1000,
    });

    const [facingRight, setFacingRight] = useState(Math.random() < 0.5);
    const [pulseScale, setPulseScale] = useState(1);

    // Move squid function
    const moveSquid = useCallback(() => {
        setNoiseOffset((prev) => ({
            x: prev.x + squidCharacteristics.turnFrequency,
            y: prev.y + squidCharacteristics.turnFrequency,
        }));

        // Pulsing effect for squid
        setPulseScale(prev => {
            const pulseValue = Math.sin(Date.now() * squidCharacteristics.pulseRate) * 0.1 + 0.95;
            return pulseValue;
        });

        setPosition((prevPos) => {
            if (!prevPos) return null; // Stop rendering if squid is removed

            let noiseX = (noise(noiseOffset.x) * 2 - 1) * squidCharacteristics.speedMultiplier;
            let noiseY = (noise(noiseOffset.y) * 2 - 1) * squidCharacteristics.verticalTendency * squidCharacteristics.speedMultiplier;

            // Add occasional jet propulsion (squids can move quickly in bursts)
            if (Math.random() < 0.01) {
                noiseX *= 3;
                noiseY *= 3;
            }

            // Ensure minimum horizontal movement
            if (Math.abs(noiseX) < squidCharacteristics.minHorizontalSpeed) {
                noiseX = noiseX >= 0 ? squidCharacteristics.minHorizontalSpeed : -squidCharacteristics.minHorizontalSpeed;
            }

            let newX = prevPos.x + noiseX * 3;
            let newY = prevPos.y + noiseY * 1.5;

            // Wrap squid when they leave the screen
            if (newX < -100) {
                newX = width + 50;
            } else if (newX > width + 100) {
                newX = -50;
            }

            // Prevent squid from going above/below boundaries
            if (newY < surfaceLevel) newY = surfaceLevel;
            if (newY > sandLevel) newY = sandLevel;

            setFacingRight(noiseX > 0);

            return { x: newX, y: newY };
        });
    }, [width, height, surfaceLevel, sandLevel, noiseOffset, squidCharacteristics]);

    // Start squid movement
    useEffect(() => {
        const animationId = requestAnimationFrame(function animate() {
            moveSquid();
            requestAnimationFrame(animate);
        });

        return () => cancelAnimationFrame(animationId);
    }, [moveSquid]);

    const [collided, setCollided] = useState(false);

    // Check for collision between the squid and the shark using updated positions
    useEffect(() => {
        if (!collided && sharkPosition && position) {
            const distance = Math.hypot(position.x - sharkPosition.x, position.y - sharkPosition.y);
            if (distance < 50) {
                console.log("🔥 Collision detected with squid!");
                setCollided(true); // Prevent multiple calls
                onEaten();
            }
        }
    }, [position, sharkPosition, collided, onEaten]);

    // Remove squid if it's eaten
    if (!position) {
        return null;
    }

    return (
        <Sprite
            image={image}
            x={position.x}
            y={position.y}
            anchor={0.5}
            scale={{
                x: facingRight ? size * pulseScale : -size * pulseScale,
                y: size * pulseScale
            }}
        />
    );
}

export default Squid;