// Audio recorder component with visual feedback and live transcription
// Shows large record/stop button with pulse animation when recording
// Displays duration timer in MM:SS format
// Shows waveform animation when recording
// Props: onRecordingComplete - callback with audio blob when done
// Props: onTranscriptionUpdate - callback for live transcription updates
// Uses Web Speech API for live transcription

import React, { useEffect, useState, useRef } from 'react';
import useAudioRecorder from '../../hooks/useAudioRecorder';
import Button from '../common/Button';

export default function AudioRecorder({ onRecordingComplete, onTranscriptionUpdate }) {
  const { isRecording, audioBlob, duration, error, startRecording, stopRecording } = useAudioRecorder();
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = transcription + finalTranscript + interimTranscript;
        setTranscription(transcription + finalTranscript);
        
        // Send live updates to parent
        if (onTranscriptionUpdate) {
          onTranscriptionUpdate(fullTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        // Ignore 'no-speech' and 'aborted' errors - they're normal during continuous recognition
        if (event.error === 'no-speech' || event.error === 'aborted') {
          console.log('Speech recognition:', event.error, '- will auto-restart');
        } else if (event.error === 'audio-capture') {
          console.error('Microphone error - please check your microphone');
          setIsListening(false);
        } else {
          console.error('Speech recognition error:', event.error);
        }
      };

      recognitionRef.current.onend = () => {
        // Auto-restart if still recording (with small delay to prevent conflicts)
        if (isListening && isRecording) {
          setTimeout(() => {
            if (isListening && isRecording && recognitionRef.current) {
              try {
                recognitionRef.current.start();
                console.log('Speech recognition restarted');
              } catch (e) {
                console.log('Could not restart recognition:', e.message);
              }
            }
          }, 100);
        } else {
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [transcription, onTranscriptionUpdate, isListening]);

  // Handle start recording
  const handleStartRecording = async () => {
    setTranscription('');
    await startRecording();
    
    // Start speech recognition with a small delay after microphone starts
    if (recognitionRef.current) {
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          console.log('Speech recognition started');
        } catch (e) {
          console.error('Could not start speech recognition:', e.message);
        }
      }, 300);
    }
  };

  // Handle stop recording
  const handleStopRecording = () => {
    stopRecording();
    
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  // When recording stops and audioBlob is ready, pass it to parent
  useEffect(() => {
    if (audioBlob && onRecordingComplete) {
      onRecordingComplete(audioBlob, transcription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob, transcription]);
  
  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Title */}
      <h2 className="text-3xl font-bold text-white drop-shadow-lg">
        {isRecording ? '🎙️ Recording...' : '🎤 Ready to Record'}
      </h2>
      
      {/* Microphone & Speech Recognition Status */}
      {isRecording && (
        <div className="flex gap-4 items-center text-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-200">Microphone Active</span>
          </div>
          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-200">Speech Recognition On</span>
            </div>
          )}
        </div>
      )}
      
      {/* Record/Stop button */}
      {/* Large circular button, 32x32, red when recording with pulse */}
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`
          w-32 h-32 rounded-full flex items-center justify-center text-4xl
          transition-all duration-300 transform hover:scale-110 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-blue-500/50
          ${isRecording 
            ? 'bg-red-600 animate-pulse shadow-lg shadow-red-600/50' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
          }
        `}
      >
        {isRecording ? '⏹️' : '⏺️'}
      </button>
      
      {/* Duration display */}
      <div className="text-2xl font-mono text-white drop-shadow-md">
        {formatDuration(duration)}
      </div>
      
      {/* Status text */}
      <p className="text-lg text-gray-100 text-center max-w-md drop-shadow-md">
        {isRecording 
          ? 'Recording your lecture. Click the stop button when finished.' 
          : 'Click the record button to start recording your lecture.'}
      </p>
      
      {/* Error message if any */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Waveform animation when recording */}
      {isRecording && (
        <div className="flex items-center gap-1 h-16">
          {/* 5 animated bars with different delays */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-blue-400 rounded-full animate-pulse"
              style={{
                height: '100%',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}