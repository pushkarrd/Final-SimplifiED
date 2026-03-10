// DyslexiaProvider - applies global accessibility styles based on store settings
import React, { useEffect } from 'react';
import useDyslexiaStore from '../../stores/dyslexiaStore';

export default function DyslexiaProvider({ children }) {
    const {
        dyslexicFont, fontSize, letterSpacing, wordSpacing,
        lineHeight, highContrast, focusMode, readingRuler,
    } = useDyslexiaStore();

    useEffect(() => {
        const root = document.documentElement;

        // Toggle dyslexic font
        if (dyslexicFont) {
            document.body.classList.add('dyslexic-mode');
        } else {
            document.body.classList.remove('dyslexic-mode');
        }

        // Apply CSS variables
        root.style.setProperty('--a11y-font-size', `${fontSize}px`);
        root.style.setProperty('--a11y-letter-spacing', `${letterSpacing}px`);
        root.style.setProperty('--a11y-word-spacing', `${wordSpacing}px`);
        root.style.setProperty('--a11y-line-height', `${lineHeight}`);

        // High contrast
        if (highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        // Focus mode
        if (focusMode) {
            document.body.classList.add('focus-mode');
        } else {
            document.body.classList.remove('focus-mode');
        }

        return () => {
            document.body.classList.remove('dyslexic-mode', 'high-contrast', 'focus-mode');
        };
    }, [dyslexicFont, fontSize, letterSpacing, wordSpacing, lineHeight, highContrast, focusMode]);

    return <>{children}</>;
}
