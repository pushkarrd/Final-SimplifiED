// ReadingRuler - horizontal highlight bar that follows the mouse
// Helps dyslexic readers track their current line

import React, { useState, useEffect } from 'react';
import useDyslexiaStore from '../../stores/dyslexiaStore';

export default function ReadingRuler() {
    const { readingRuler, rulerHeight } = useDyslexiaStore();
    const [mouseY, setMouseY] = useState(-100);

    useEffect(() => {
        if (!readingRuler) return;

        const handleMouseMove = (e) => {
            setMouseY(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [readingRuler]);

    if (!readingRuler) return null;

    return (
        <div
            className="reading-ruler"
            style={{
                top: `${mouseY - rulerHeight / 2}px`,
                height: `${rulerHeight}px`,
            }}
        />
    );
}
