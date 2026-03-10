// Dyslexia-Friendly Reading Interface
// Students paste or upload text → rendered in accessible format
// Features: OpenDyslexic font, spacing controls, reading ruler, color overlays, TTS

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Upload, Play, Pause, ArrowLeft,
    Volume2, VolumeX, Type, Eye
} from 'lucide-react';
import useDyslexiaStore from '../stores/dyslexiaStore';

export default function ReadingPage() {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [isReading, setIsReading] = useState(false);
    const [displayMode, setDisplayMode] = useState('input'); // input | reading
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
    const textDisplayRef = useRef(null);
    const utteranceRef = useRef(null);

    const { dyslexicFont, fontSize, letterSpacing, wordSpacing, lineHeight } = useDyslexiaStore();

    const sampleTexts = [
        {
            title: "Photosynthesis",
            text: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a byproduct. The process takes place primarily in the leaves of plants. Light energy is absorbed by chlorophyll, a green pigment contained in structures called chloroplasts."
        },
        {
            title: "The Water Cycle",
            text: "The water cycle describes how water evaporates from the surface of the earth, rises into the atmosphere, cools and condenses into rain or snow in clouds, and falls again to the surface as precipitation. The water falling on land collects in rivers and lakes, soil, and porous layers of rock, and much of it flows back into the oceans, where it will once more evaporate. The cycling of water in and out of the atmosphere is a significant aspect of the weather patterns on Earth."
        },
        {
            title: "Simple Machines",
            text: "A simple machine is a device that changes the direction or magnitude of a force. The six classical simple machines are the lever, wheel and axle, pulley, inclined plane, wedge, and screw. Simple machines are the basis for all mechanical systems. They make work easier by allowing us to push or pull over increased distances or with less force."
        },
    ];

    const handleStartReading = () => {
        if (text.trim()) {
            setDisplayMode('reading');
            setIsReading(true);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setText(ev.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setHighlightedWordIndex(-1);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.0;

        const words = text.split(/\s+/);
        let wordIndex = 0;

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                setHighlightedWordIndex(wordIndex);
                wordIndex++;
            }
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setHighlightedWordIndex(-1);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    const words = text.split(/\s+/).filter(w => w.length > 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2e] to-[#1a0a2e] text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Dashboard</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <BookOpen size={24} className="text-indigo-400" />
                        <h1 className="text-xl font-bold">Reading Assistant</h1>
                    </div>
                    <div className="w-24" />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {displayMode === 'input' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Info banner */}
                        <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                            <div className="flex items-start gap-3">
                                <Eye size={24} className="text-indigo-400 mt-1 shrink-0" />
                                <div>
                                    <h2 className="text-lg font-semibold mb-1">Dyslexia-Friendly Reading</h2>
                                    <p className="text-white/60 text-sm">
                                        Paste or upload any text to read it with OpenDyslexic font, adjustable spacing,
                                        color overlays, reading ruler, and text-to-speech. Use the accessibility toolbar
                                        (bottom-right) to customize your experience.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Text input */}
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Paste your text here</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={8}
                                placeholder="Paste or type the text you want to read..."
                                className="w-full rounded-xl p-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none resize-none"
                                style={{ fontSize: '16px', lineHeight: '1.6' }}
                            />
                        </div>

                        {/* File upload */}
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                                <Upload size={18} />
                                <span className="text-sm">Upload .txt file</span>
                                <input
                                    type="file"
                                    accept=".txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-white/40 text-sm">or pick a sample →</span>
                        </div>

                        {/* Sample texts */}
                        <div>
                            <h3 className="text-sm text-white/60 mb-3">Sample Texts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {sampleTexts.map((sample, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setText(sample.text)}
                                        className="text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all"
                                    >
                                        <div className="font-medium text-sm mb-1">{sample.title}</div>
                                        <div className="text-xs text-white/40 line-clamp-2">{sample.text.substring(0, 80)}...</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start reading */}
                        <motion.button
                            onClick={handleStartReading}
                            disabled={!text.trim()}
                            className="w-full py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-30"
                            style={{
                                background: text.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#333',
                            }}
                            whileHover={text.trim() ? { scale: 1.02 } : {}}
                            whileTap={text.trim() ? { scale: 0.98 } : {}}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <BookOpen size={20} />
                                Start Reading
                            </div>
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Controls bar */}
                        <div className="flex items-center justify-between rounded-xl p-4 bg-white/5 border border-white/10">
                            <button
                                onClick={() => { setDisplayMode('input'); setIsSpeaking(false); window.speechSynthesis.cancel(); }}
                                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back to input
                            </button>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSpeak}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                                    style={{
                                        background: isSpeaking ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                                        border: `1px solid ${isSpeaking ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                                    }}
                                >
                                    {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    <span className="text-sm">{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Reading area */}
                        <div
                            ref={textDisplayRef}
                            className="reading-content p-8 rounded-2xl bg-white/5 border border-white/10"
                            style={{
                                fontFamily: dyslexicFont ? "'OpenDyslexic', sans-serif" : 'inherit',
                                fontSize: `${fontSize}px`,
                                letterSpacing: `${letterSpacing}px`,
                                wordSpacing: `${wordSpacing}px`,
                                lineHeight: lineHeight,
                                maxWidth: '100%',
                            }}
                        >
                            {words.map((word, i) => (
                                <span
                                    key={i}
                                    className={`inline transition-colors duration-150 ${highlightedWordIndex === i
                                            ? 'bg-indigo-500/30 text-white rounded px-1'
                                            : 'text-white/90'
                                        }`}
                                >
                                    {word}{' '}
                                </span>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-white/40">
                            <span>{words.length} words</span>
                            <span>~{Math.ceil(words.length / 200)} min read</span>
                            <span>{text.split(/[.!?]+/).length - 1} sentences</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
