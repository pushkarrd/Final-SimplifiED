// Zustand store for dyslexia accessibility settings
// Persisted to localStorage so settings survive page refreshes

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDyslexiaStore = create(
    persist(
        (set, get) => ({
            // Font settings
            dyslexicFont: false,
            fontSize: 18,

            // Spacing settings
            letterSpacing: 0,    // 0 = normal, 1-5 = increased
            wordSpacing: 0,      // 0 = normal, 1-5 = increased
            lineHeight: 1.6,     // 1.6 = default, up to 3.0

            // Visual settings
            colorOverlay: 'none', // none, cream, blue, green, pink, yellow
            highContrast: false,
            focusMode: false,

            // Reading ruler
            readingRuler: false,
            rulerHeight: 40,

            // Toolbar visibility
            toolbarOpen: false,

            // Actions
            toggleDyslexicFont: () => set((s) => ({ dyslexicFont: !s.dyslexicFont })),
            setFontSize: (size) => set({ fontSize: size }),
            setLetterSpacing: (val) => set({ letterSpacing: val }),
            setWordSpacing: (val) => set({ wordSpacing: val }),
            setLineHeight: (val) => set({ lineHeight: val }),
            setColorOverlay: (color) => set({ colorOverlay: color }),
            toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
            toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
            toggleReadingRuler: () => set((s) => ({ readingRuler: !s.readingRuler })),
            setRulerHeight: (h) => set({ rulerHeight: h }),
            toggleToolbar: () => set((s) => ({ toolbarOpen: !s.toolbarOpen })),

            // Reset all settings
            resetAll: () => set({
                dyslexicFont: false,
                fontSize: 18,
                letterSpacing: 0,
                wordSpacing: 0,
                lineHeight: 1.6,
                colorOverlay: 'none',
                highContrast: false,
                focusMode: false,
                readingRuler: false,
                rulerHeight: 40,
            }),
        }),
        {
            name: 'simplifi-ed-accessibility',
        }
    )
);

export default useDyslexiaStore;
