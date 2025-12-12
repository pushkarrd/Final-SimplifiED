// Lecture page with live transcription and AI processing
// Side-by-side layout: Audio recorder on left, tabs on right
// 5 tabs: Live Transcription, Simple Text, Detailed Steps, Mind Map, Summary

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import AudioRecorder from '../components/lecture/AudioRecorder';
import Navbar from '../components/layout/Navbar';
import Silk from '../components/common/Silk';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import {
  createLecture,
  getLecture,
  getLatestLecture,
  processLecture,
  deleteLecture
} from '../services/backendApi';

export default function LecturePage() {
  const { isDark } = useTheme();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('live');
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [simpleText, setSimpleText] = useState('');
  const [detailedSteps, setDetailedSteps] = useState('');
  const [mindMap, setMindMap] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [isLoadingLecture, setIsLoadingLecture] = useState(true);

  const tabs = [
    { id: 'live', label: 'Live Transcription', icon: '🎙️' },
    { id: 'simple', label: 'Simple Text', icon: '📝' },
    { id: 'steps', label: 'Detailed Steps', icon: '📋' },
    { id: 'mindmap', label: 'Mind Map', icon: '🧠' },
    { id: 'summary', label: 'Summary', icon: '📄' }
  ];

  // Load the latest lecture from Firestore (memoized to prevent re-renders)
  const loadLatestLecture = useCallback(async () => {
    if (!currentUser) return;
    
    setIsLoadingLecture(true);
    try {
      const latestLecture = await getLatestLecture(currentUser.uid);
      
      if (latestLecture) {
        setCurrentLectureId(latestLecture.id);
        setLiveTranscription(latestLecture.transcription || '');
        setSimpleText(latestLecture.simpleText || '');
        setDetailedSteps(latestLecture.detailedSteps || '');
        setMindMap(latestLecture.mindMap || '');
        setSummary(latestLecture.summary || '');
      }
    } catch (error) {
      console.error('Error loading latest lecture:', error);
    } finally {
      setIsLoadingLecture(false);
    }
  }, [currentUser]);

  // Load latest lecture on component mount
  useEffect(() => {
    loadLatestLecture();
  }, [loadLatestLecture]);

  // Handle live transcription updates
  const handleTranscriptionUpdate = (text) => {
    setLiveTranscription(text);
  };

  // Clear all data and start fresh
  const handleClearLecture = async () => {
    if (!currentLectureId) {
      // Just clear local state if no lecture ID
      setLiveTranscription('');
      setSimpleText('');
      setDetailedSteps('');
      setMindMap('');
      setSummary('');
      return;
    }

    if (window.confirm('Are you sure you want to delete this lecture? This action cannot be undone.')) {
      try {
        await deleteLecture(currentLectureId);
        setCurrentLectureId(null);
        setLiveTranscription('');
        setSimpleText('');
        setDetailedSteps('');
        setMindMap('');
        setSummary('');
        alert('Lecture deleted successfully!');
      } catch (error) {
        console.error('Error deleting lecture:', error);
        alert('Failed to delete lecture. Please try again.');
      }
    }
  };

  // Process transcription through backend API (memoized)
  const processTranscription = useCallback(async (lectureId) => {
    if (!lectureId) return;
    
    setIsProcessing(true);
    
    try {
      setProcessingStage('Processing lecture through AI...');
      
      // Call backend API to process all stages
      const result = await processLecture(lectureId);
      
      // Update local state with results
      setSimpleText(result.simpleText);
      setDetailedSteps(result.detailedSteps);
      setMindMap(result.mindMap);
      setSummary(result.summary);
      
      setProcessingStage('Processing complete!');
    } catch (error) {
      console.error('Error processing transcription:', error);
      setProcessingStage('Error processing. Please try again.');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStage('');
      }, 2000);
    }
  }, []);

  // Handle recording complete - save to Firestore only (don't process yet)
  const handleRecordingComplete = useCallback(async (audioBlob, transcription) => {
    if (!currentUser) {
      setProcessingStage('Please log in to save your recording');
      setTimeout(() => setProcessingStage(''), 3000);
      return;
    }

    if (!transcription || !transcription.trim()) {
      setProcessingStage('No speech detected. Please try speaking again.');
      setTimeout(() => setProcessingStage(''), 3000);
      return;
    }

    try {
      // Save transcription to Firestore (keep it visible in live tab)
      setProcessingStage('Saving transcription...');
      const lectureId = await createLecture(currentUser.uid, transcription);
      setCurrentLectureId(lectureId);
      setProcessingStage('Transcription saved! Click "Process" button to generate AI content.');
      
      // Don't auto-process - wait for user to click delete or process button
    } catch (error) {
      console.error('Error saving transcription:', error);
      alert('Failed to save transcription. Please try again.');
    } finally {
      setTimeout(() => setProcessingStage(''), 3000);
    }
  }, [currentUser]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'live':
        return (
          <div className="space-y-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Live transcription appears here as you speak...
            </p>
            <div className={`whitespace-pre-wrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {liveTranscription || 'Start recording to see live transcription...'}
            </div>
            {liveTranscription && currentLectureId && (
              <button
                onClick={() => processTranscription(currentLectureId)}
                className={`mt-4 px-6 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Process with AI'}
              </button>
            )}
          </div>
        );
      
      case 'simple':
        return (
          <div className="space-y-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Simplified, dyslexic-friendly text
            </p>
            <div className={`whitespace-pre-wrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {simpleText || 'Processing will begin after recording stops...'}
            </div>
          </div>
        );
      
      case 'steps':
        return (
          <div className="space-y-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Step-by-step breakdown
            </p>
            <div className={`whitespace-pre-wrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {detailedSteps || 'Detailed steps will appear here...'}
            </div>
          </div>
        );
      
      case 'mindmap':
        return (
          <div className="space-y-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Visual mind map structure
            </p>
            <div className={`whitespace-pre-wrap font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {mindMap || 'Mind map will be generated...'}
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div className="space-y-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Final simplified summary
            </p>
            <div className={`whitespace-pre-wrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {summary || 'Summary will be generated...'}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Silk Background */}
      {isDark ? (
        <>
          <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-blue-950 to-slate-950 pointer-events-none z-0"></div>
          <div className="fixed inset-0 w-full h-full pointer-events-none opacity-60 z-0">
            <Silk speed={8} scale={1.5} color="#3B82F6" noiseIntensity={0.7} rotation={0.3} />
          </div>
          <div className="fixed inset-0 w-full h-full pointer-events-none opacity-50 z-0">
            <Silk speed={10} scale={1.2} color="#1E40AF" noiseIntensity={0.6} rotation={-0.2} />
          </div>
        </>
      ) : (
        <>
          <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 pointer-events-none z-0"></div>
          <div className="fixed inset-0 w-full h-full pointer-events-none opacity-30 z-0">
            <Silk speed={8} scale={1.5} color="#93C5FD" noiseIntensity={0.5} rotation={0.3} />
          </div>
        </>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
          >
            <div>
              <h1 className={`text-4xl md:text-5xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📚 New Lecture
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Record your lecture and get AI-powered transcription and simplification
              </p>
            </div>
            {/* Delete Button */}
            {(liveTranscription || simpleText || detailedSteps || mindMap || summary) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearLecture}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isDark 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50' 
                    : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
                }`}
              >
                <Trash2 className="w-5 h-5" />
                Delete Lecture
              </motion.button>
            )}
          </motion.div>

          {/* Processing Status */}
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-blue-100 border border-blue-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className={isDark ? 'text-blue-200' : 'text-blue-900'}>{processingStage}</span>
              </div>
            </motion.div>
          )}

          {/* Side-by-Side Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Audio Recorder */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AudioRecorder 
                onRecordingComplete={handleRecordingComplete}
                onTranscriptionUpdate={handleTranscriptionUpdate}
              />
            </motion.div>

            {/* Right: Tabs */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`backdrop-blur-md rounded-3xl shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/70 border-white/40'
              }`}
            >
              {/* Tab Headers */}
              <div className={`flex overflow-x-auto border-b ${isDark ? 'border-white/20' : 'border-gray-300'}`}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-fit px-4 py-4 text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? isDark
                          ? 'bg-white/20 text-white border-b-2 border-blue-400'
                          : 'bg-white/90 text-gray-900 border-b-2 border-blue-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-white/10'
                          : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {renderTabContent()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
