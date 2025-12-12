// Dashboard page - main hub after login
// Shows welcome message with user name
// Quick action cards: Start New Lecture, Upload Audio, View History
// Recent lectures list (empty state if no lectures)
// Stats cards: Total lectures, Total hours recorded, This week count
// Uses grid layout, responsive design

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Silk from '../components/common/Silk';
import Button from '../components/common/Button';
import AudioUpload from '../components/lecture/AudioUpload';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Folder, Clock, Calendar, Trash2 } from 'lucide-react';
import { getUserLectures, deleteLecture, createLecture } from '../services/backendApi';

export default function Dashboard() {
  const { isDyslexicMode, toggleDyslexicMode, isDark } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recentLectures, setRecentLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState({
    totalLectures: 0,
    totalHours: 0,
    thisWeek: 0,
  });
  
  // Get user's first name from display name or email
  const getUserFirstName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'Student';
  };
  
  const userName = getUserFirstName();
  
  // Fetch user's lectures
  useEffect(() => {
    const fetchLectures = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const lectures = await getUserLectures(currentUser.uid);
        
        // Sort by creation date (newest first)
        const sortedLectures = lectures.sort((a, b) => {
          const dateA = a.createdAt?._seconds || 0;
          const dateB = b.createdAt?._seconds || 0;
          return dateB - dateA;
        });
        
        // Assign lecture numbers (newest = Lecture 1)
        const lecturesWithNumbers = sortedLectures.map((lecture, index) => ({
          ...lecture,
          lectureNumber: index + 1
        }));
        
        // Show only top 6 most recent
        setRecentLectures(lecturesWithNumbers.slice(0, 6));
        
        // Calculate stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const thisWeekCount = lectures.filter(lecture => {
          const lectureDate = new Date((lecture.createdAt?._seconds || 0) * 1000);
          return lectureDate >= oneWeekAgo;
        }).length;
        
        setStats({
          totalLectures: lectures.length,
          totalHours: Math.round(lectures.length * 0.5), // Estimate 0.5 hours per lecture
          thisWeek: thisWeekCount,
        });
      } catch (error) {
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLectures();
  }, [currentUser]);
  
  // Delete old lectures beyond top 6
  const cleanupOldLectures = async () => {
    if (!currentUser?.uid) return;
    
    if (!window.confirm('This will delete all lectures except the 6 most recent. Continue?')) {
      return;
    }
    
    try {
      setLoading(true);
      const lectures = await getUserLectures(currentUser.uid);
      
      // Sort by creation date (newest first)
      const sortedLectures = lectures.sort((a, b) => {
        const dateA = a.createdAt?._seconds || 0;
        const dateB = b.createdAt?._seconds || 0;
        return dateB - dateA;
      });
      
      // Get lectures to delete (all except top 6)
      const lecturesToDelete = sortedLectures.slice(6);
      
      if (lecturesToDelete.length === 0) {
        alert('You have 6 or fewer lectures. Nothing to delete.');
        setLoading(false);
        return;
      }
      
      // Delete old lectures
      let deletedCount = 0;
      for (const lecture of lecturesToDelete) {
        try {
          await deleteLecture(lecture.id);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete lecture ${lecture.id}:`, error);
        }
      }
      
      alert(`Successfully deleted ${deletedCount} old lecture(s).`);
      
      // Refresh the lecture list
      window.location.reload();
    } catch (error) {
      console.error('Error cleaning up lectures:', error);
      alert('Failed to cleanup lectures. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle audio upload completion
  const handleAudioUploadComplete = async (transcription) => {
    try {
      setShowUploadModal(false);
      
      if (!currentUser?.uid) {
        alert('Please log in to save your recording');
        return;
      }

      // Create lecture with transcription
      const lectureId = await createLecture(currentUser.uid, transcription);
      
      // Navigate to lecture page which will auto-process
      navigate(`/lecture?id=${lectureId}&autoProcess=true`);
      
    } catch (error) {
      console.error('Error saving uploaded audio transcription:', error);
      alert('Failed to save transcription. Please try again.');
    }
  };
  
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp?._seconds) return 'Just now';
    const date = new Date(timestamp._seconds * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Silk Background - Covers entire page */}
      {/* Dark base layer */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-blue-950 to-slate-950 pointer-events-none z-0"></div>
      
      {/* Primary Silk layer - Bright Blue */}
      <div className="fixed inset-0 w-full h-full pointer-events-none opacity-60 z-0">
        <Silk
          speed={2}
          scale={1.2}
          color="#3B82F6"
          noiseIntensity={0.8}
          rotation={0.3}
        />
      </div>
      
      {/* Secondary Silk layer - Purple */}
      <div className="fixed inset-0 w-full h-full pointer-events-none opacity-40 z-0">
        <Silk
          speed={1.5}
          scale={1}
          color="#8B5CF6"
          noiseIntensity={1.2}
          rotation={-0.2}
        />
      </div>
      
      {/* Tertiary Silk layer - Cyan */}
      <div className="fixed inset-0 w-full h-full pointer-events-none opacity-30 z-0">
        <Silk
          speed={2.5}
          scale={0.8}
          color="#06B6D4"
          noiseIntensity={1}
          rotation={0.5}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
      
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome section with Dyslexic Mode Button */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-xl text-gray-100 drop-shadow-md">
                Ready to make learning easier today?
              </p>
            </div>
            
            {/* Dyslexic User Toggle Button */}
            <button
              onClick={toggleDyslexicMode}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-base
                transition-all duration-300 transform hover:scale-105 shadow-lg
                ${isDyslexicMode 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/50' 
                  : 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20'
                }
              `}
            >
              <Sparkles className={`w-5 h-5 ${isDyslexicMode ? 'animate-pulse' : ''}`} />
              <span>{isDyslexicMode ? 'Dyslexic Mode ON' : 'Dyslexic User'}</span>
            </button>
          </div>
          
          {/* Stats cards */}
          {/* 3 cards in grid: Total Lectures, Total Hours, This Week */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-3xl font-bold text-blue-400">{stats.totalLectures}</div>
              <div className="text-gray-100">Total Lectures</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-3xl font-bold text-purple-400">{stats.totalHours}h</div>
              <div className="text-gray-100">Hours Recorded</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-3xl font-bold text-cyan-400">{stats.thisWeek}</div>
              <div className="text-gray-100">This Week</div>
            </div>
          </div>
        
          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Start New Lecture card */}
            <Link to="/lecture" className="group">
              <div className="bg-gradient-to-br from-blue-600/80 to-purple-600/80 backdrop-blur-sm border-2 border-white/20 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">🎙️</div>
                <h3 className="text-2xl font-bold mb-2">Start New Lecture</h3>
                <p className="text-white/90">Record a new lecture with real-time transcription</p>
              </div>
            </Link>
            
            {/* Upload Audio card */}
            <div 
              onClick={() => setShowUploadModal(true)}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📤</div>
              <h3 className="text-2xl font-bold text-white mb-2">Upload Audio</h3>
              <p className="text-gray-100">Upload an existing audio file to transcribe</p>
            </div>
          </div>
          
          {/* Recent lectures section */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Recent Lectures</h2>
              {stats.totalLectures > 6 && (
                <button
                  onClick={cleanupOldLectures}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 transition-all"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                  Keep Only Top 6
                </button>
              )}
            </div>
            
            {/* Loading state */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-xl text-gray-100">Loading lectures...</p>
              </div>
            ) : recentLectures.length === 0 ? (
              /* Empty state if no lectures */
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl text-gray-100 mb-4">No lectures yet</p>
                <Link to="/lecture">
                  <button className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg hover:shadow-xl">
                    Record Your First Lecture
                  </button>
                </Link>
              </div>
            ) : (
              /* Lecture list - Square folder cards */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentLectures.map((lecture) => (
                  <Link
                    key={lecture.id}
                    to={`/lecture?id=${lecture.id}`}
                    className="block group"
                  >
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border-2 border-white/30 rounded-2xl overflow-hidden hover:border-blue-400/60 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 h-full">
                      {/* Folder Icon Header */}
                      <div className="bg-gradient-to-br from-blue-600/40 to-purple-600/40 p-6 border-b-2 border-white/20">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <Folder className="w-12 h-12 text-blue-300 group-hover:text-blue-200 transition-colors" strokeWidth={1.5} />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white text-center group-hover:text-blue-200 transition-colors">
                          Lecture {lecture.lectureNumber}
                        </h3>
                      </div>
                      
                      {/* Lecture Details */}
                      <div className="p-6">
                        <p className="text-gray-200 text-sm mb-4 line-clamp-3 min-h-[60px]">
                          {lecture.transcription?.substring(0, 120)}
                          {lecture.transcription?.length > 120 ? '...' : ''}
                        </p>
                        
                        {/* Status Badge */}
                        <div className="mb-4">
                          {lecture.simpleText || lecture.summary ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/30 text-green-200 border border-green-400/50">
                              ✓ Processed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/30 text-yellow-200 border border-yellow-400/50">
                              ⏳ Pending
                            </span>
                          )}
                        </div>
                        
                        {/* Metadata */}
                        <div className="space-y-2 text-xs text-gray-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span>{formatDate(lecture.createdAt)}</span>
                          </div>
                          {lecture.updatedAt && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-purple-400" />
                              <span>Updated {formatDate(lecture.updatedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Audio Upload Modal */}
      {showUploadModal && (
        <AudioUpload
          onUploadComplete={handleAudioUploadComplete}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}