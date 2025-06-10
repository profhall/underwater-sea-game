import React, { useState, useEffect, useCallback } from 'react';
import { Sprite, Container } from '@pixi/react';
import { noise } from '@chriscourses/perlin-noise';

// Individual krill
function KrillIndividual({ x, y, size, facingRight }) {
    return (
        <Sprite
            image={`${process.env.PUBLIC_URL}/assets/krill.png`}
            x={x}
            y={y}
            anchor={0.5}
            scale={{ x: facingRight ? size : -size, y: size }}
        />
    );
}

// Krill swarm component
function Krill({ image, width, height, size = 0.03, initialPosition, sharkPosition, onEaten = () => {} }) {
    // console.log(`🦐 Krill swarm rendered at: (${initialPosition.x}, ${initialPosition.y})`); // Debug log

    const surfaceLevel = height * 0.1;
    const sandLevel = height * 0.9;

    // Krill swarm behavior
    const [swarmCharacteristics, setSwarmCharacteristics] = useState(() => ({
        speedMultiplier: Math.random() * 0.8 + 0.3, // Slower than fish
        turnFrequency: Math.random() * 0.03 + 0.01,
        verticalTendency: Math.random() * 0.5 + 0.001,
        minHorizontalSpeed: Math.random() * 0.2 + 0.1,
        swarmSize: Math.floor(Math.random() * 8) + 5, // Random number of krill in swarm
        swarmSpread: Math.random() * 30 + 10, // How spread out the swarm is
    }));

    // Krill position (uses initial position from parent)
    const [position, setPosition] = useState(initialPosition);

    // Individual krill positions relative to swarm center
    const [krillPositions, setKrillPositions] = useState(() => {
        return Array(swarmCharacteristics.swarmSize).fill().map(() => ({
            offsetX: (Math.random() - 0.5) * swarmCharacteristics.swarmSpread,
            offsetY: (Math.random() - 0.5) * swarmCharacteristics.swarmSpread,
            individualNoise: Math.random() * 1000,
            individualSize: size * (Math.random() * 0.4 + 0.8), // Varying sizes
        }));
    });

    const [noiseOffset, setNoiseOffset] = useState({
        x: Math.random() * 1000,
        y: Math.random() * 1000,
    });

    const [facingRight, setFacingRight] = useState(Math.random() < 0.5);

    // Move krill swarm function
    const moveKrill = useCallback(() => {
        setNoiseOffset((prev) => ({
            x: prev.x + swarmCharacteristics.turnFrequency,
            y: prev.y + swarmCharacteristics.turnFrequency,
        }));

        // Update individual krill positions with reduced frequency for performance
        setKrillPositions(prev => prev.map(krill => {
            const newNoise = krill.individualNoise + 0.005; // Slower individual movement
            return {
                ...krill,
                individualNoise: newNoise,
                offsetX: Math.max(-swarmCharacteristics.swarmSpread, Math.min(swarmCharacteristics.swarmSpread, 
                    krill.offsetX + (noise(newNoise) * 2 - 1) * 0.3)),
                offsetY: Math.max(-swarmCharacteristics.swarmSpread, Math.min(swarmCharacteristics.swarmSpread,
                    krill.offsetY + (noise(newNoise + 500) * 2 - 1) * 0.3)),
            };
        }));

        setPosition((prevPos) => {
            // Ensure we always have a valid previous position
            if (!prevPos || typeof prevPos.x !== 'number' || typeof prevPos.y !== 'number') {
                return initialPosition; // Return to initial position if corrupted
            }

            let noiseX = (noise(noiseOffset.x) * 2 - 1) * swarmCharacteristics.speedMultiplier;
            let noiseY = (noise(noiseOffset.y) * 2 - 1) * swarmCharacteristics.verticalTendency * swarmCharacteristics.speedMultiplier;

            // Ensure minimum horizontal movement
            if (Math.abs(noiseX) < swarmCharacteristics.minHorizontalSpeed) {
                noiseX = noiseX >= 0 ? swarmCharacteristics.minHorizontalSpeed : -swarmCharacteristics.minHorizontalSpeed;
            }

            let newX = prevPos.x + noiseX * 2;
            let newY = prevPos.y + noiseY * 1;

            // Wrap krill when they leave the screen
            if (newX < -100) {
                newX = width + 50;
            } else if (newX > width + 100) {
                newX = -50;
            }

            // Prevent krill from going above/below boundaries
            if (newY < surfaceLevel) newY = surfaceLevel;
            if (newY > sandLevel) newY = sandLevel;

            // Validate final position
            if (isNaN(newX) || isNaN(newY)) {
                return prevPos; // Keep previous position if calculation failed
            }

            setFacingRight(noiseX > 0);

            return { x: newX, y: newY };
        });
    }, [width, height, surfaceLevel, sandLevel, noiseOffset, swarmCharacteristics]);

    // Start krill movement
    useEffect(() => {
        const animationId = requestAnimationFrame(function animate() {
            moveKrill();
            requestAnimationFrame(animate);
        });

        return () => cancelAnimationFrame(animationId);
    }, [moveKrill]);

    const [collided, setCollided] = useState(false);

    // Collision detection - check if shark center overlaps with krill swarm
    useEffect(() => {
        if (!collided && sharkPosition && position) {
            const distance = Math.hypot(position.x - sharkPosition.x, position.y - sharkPosition.y);
            const collisionRadius = 60; // Larger radius for swarm effect
            
            if (distance < collisionRadius) {
                console.log(`🔥 Krill swarm eaten! Distance: ${distance.toFixed(2)}, Radius: ${collisionRadius}`);
                setCollided(true);
                onEaten();
            }
        }
    }, [position, sharkPosition, collided, onEaten]);

    // Remove krill if it's eaten (collision detected)
    if (collided) {
        return null;
    }

    return (
        <Container>
            {krillPositions.map((krill, index) => (
                <KrillIndividual
                    key={index}
                    x={position.x + krill.offsetX}
                    y={position.y + krill.offsetY}
                    size={krill.individualSize}
                    facingRight={facingRight}
                />
            ))}
        </Container>
    );
}

export default Krill;