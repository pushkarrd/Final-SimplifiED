// Landing page for EchoNotes with animated orb background
// Sections: Hero with Orb, Features, How It Works, CTA
// Hero has animated 3D orb background using WebGL
// Orb reacts to mouse hover for interactive feel
// All text dyslexia-friendly, large and clear

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Silk from '../components/common/Silk';
import { Mic, Bot, BookOpen, Accessibility, Sparkles, Download, Linkedin, Instagram } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, useInView } from 'framer-motion';

export default function Landing() {
  const { isDark } = useTheme();
  const { currentUser } = useAuth();
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: '#5227FF' }}>
      {/* Silk Background - Covers entire page */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <Silk
          speed={10}
          scale={1}
          color="#5227FF"
          noiseIntensity={1.8}
          rotation={0}
        />
      </div>

      {/* Content wrapper - positioned above background */}
      <div className={`relative z-10 min-h-screen`}>
        <Navbar />
        
        {/* Hero Section */}
        {/* Full viewport, content centered and on top */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 py-20 text-center overflow-hidden">
          {/* Content - relative positioned to appear on top of background */}
          <div className="relative z-10 max-w-4xl w-full">
          {/* Main Heading */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 md:mb-12 leading-tight ${
            isDark ? 'text-white' : 'text-white'
          }`}>
            Make Every Lecture <span className={isDark ? 'text-white' : 'text-white'}>Easy to Understand</span> — Instantly.
          </h1>
          
          {/* Primary Description */}
          <p className={`text-lg sm:text-xl md:text-2xl mb-6 leading-relaxed drop-shadow-lg font-medium ${
            isDark ? 'text-blue-100' : 'text-white'
          }`} style={isDark ? {textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'} : {}}>
            SimplifiED helps students with dyslexia and reading challenges by turning complex lectures into clear, simple, and accessible notes in real time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 md:gap-4 justify-center items-center flex-wrap">
            {currentUser ? (
              <Link to="/dashboard" className="w-full sm:w-auto">
                <button className="w-full px-9 py-3 rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-2xl bg-white text-black hover:bg-gray-100">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/signup" className="w-full sm:w-auto">
                <button className="w-full px-9 py-3 rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-2xl bg-white text-black hover:bg-gray-100">
                  Try SimplifiED Now
                </button>
              </Link>
            )}
            <a href="#features" className="w-full sm:w-auto">
              <button className="w-full px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg border-2 bg-transparent text-white hover:bg-white/10 border-white/30">
                Learn More
              </button>
            </a>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 px-6 sm:px-8 md:px-12 transition-colors duration-300" ref={featuresRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight drop-shadow-lg ${
              isDark ? 'text-white' : 'text-white'
            }`}>
              Designed for Everyone
            </h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md ${
              isDark ? 'text-gray-100' : 'text-white'
            }`}>
              With features built specifically for students with dyslexia and reading challenges
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Feature Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`group relative p-8 md:p-10 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30' 
                  : 'bg-white/70 hover:bg-white/90 border-gray-200 hover:border-gray-300'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glare effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 via-transparent to-purple-400/20 animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="mb-5 flex justify-center">
                  <Mic className="w-14 h-14 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Real-time Recording
                </h3>
                <p className={`text-base md:text-lg leading-relaxed ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  Record lectures directly in your browser with crystal-clear audio capture and automatic transcription as you listen.
                </p>
              </div>
            </motion.div>
            
            {/* Feature Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`group relative p-8 md:p-10 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30' 
                  : 'bg-white/70 hover:bg-white/90 border-gray-200 hover:border-gray-300'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glare effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-pink-400/20 animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="mb-5 flex justify-center">
                  <Bot className="w-14 h-14 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  AI Simplification
                </h3>
                <p className={`text-base md:text-lg leading-relaxed ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  Complex academic language is automatically simplified into clear, easy-to-read text that everyone can understand.
                </p>
              </div>
            </motion.div>
            
            {/* Feature Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`group relative p-8 md:p-10 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30' 
                  : 'bg-white/70 hover:bg-white/90 border-gray-200 hover:border-gray-300'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glare effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-400/20 animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="mb-5 flex justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  🔗
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Fully Accessible
                </h3>
                <p className={`text-base md:text-lg leading-relaxed ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  OpenDyslexic font, adjustable spacing, color themes, and WCAG compliance—built for accessibility from the ground up.
                </p>
              </div>
            </motion.div>
            
            {/* Feature Card 4 - Dyslexia Friendly */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`group relative p-8 md:p-10 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30' 
                  : 'bg-white/70 hover:bg-white/90 border-gray-200 hover:border-gray-300'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glare effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-orange-400/20 animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="mb-5 flex justify-center">
                  <BookOpen className="w-14 h-14 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Dyslexia Friendly
                </h3>
                <p className={`text-base md:text-lg leading-relaxed ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  Specially designed with OpenDyslexic font, adjustable line spacing, high contrast modes, and customizable text size for optimal reading comfort.
                </p>
              </div>
            </motion.div>
            
            {/* Feature Card 5 - Smart Summaries */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`group relative p-8 md:p-10 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30' 
                  : 'bg-white/70 hover:bg-white/90 border-gray-200 hover:border-gray-300'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glare effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-transparent to-rose-400/20 animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="mb-5 flex justify-center">
                  <Sparkles className="w-14 h-14 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Smart Summaries
                </h3>
                <p className={`text-base md:text-lg leading-relaxed ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  AI extracts key points and creates chapter breakdowns automatically. Get instant review notes with the most important concepts highlighted.
                </p>
              </div>
            </motion.div>
            
            {/* Feature Card 6 - Export & Save */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className={`group relative p-8 md:p-10 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30' 
                  : 'bg-white/70 hover:bg-white/90 border-gray-200 hover:border-gray-300'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glare effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-yellow-400/20 animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="mb-5 flex justify-center">
                  <Download className="w-14 h-14 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Export & Save
                </h3>
                <p className={`text-base md:text-lg leading-relaxed ${
                  isDark ? 'text-gray-100' : 'text-gray-700'
                }`}>
                  Save notes in multiple formats—PDF, Word, or plain text. Cloud sync keeps everything accessible offline and easy to share with classmates.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-24 md:py-32 px-6 sm:px-8 md:px-12 text-center overflow-hidden transition-colors duration-300">
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className={`backdrop-blur-md rounded-3xl shadow-2xl border-2 p-8 md:p-10 ${
              isDark 
                ? 'bg-white/10 border-white/20 hover:border-white/30' 
                : 'bg-white/70 border-white/40 hover:border-white/50'
            }`}
          >
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight drop-shadow-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Ready to Transform Your Learning?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-base md:text-lg mb-8 md:mb-10 leading-relaxed ${
                isDark ? 'text-gray-100' : 'text-gray-700'
              }`}
            >
              Join thousands of students who are already experiencing better understanding and retention with SimplifiED. Start your journey today.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center items-center"
            >
              <Link to="/lecture" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-10 py-4 rounded-full font-semibold text-base sm:text-lg md:text-xl transition-all shadow-lg bg-white hover:bg-gray-100 text-gray-900"
                >
                  Start Your First Lecture
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-24 md:py-32 px-6 sm:px-8 md:px-12 overflow-hidden transition-colors duration-300">
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight drop-shadow-lg ${
              isDark ? 'text-white' : 'text-white'
            }`}>
              Meet Our Team
            </h2>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              isDark ? 'text-gray-100' : 'text-white'
            }`}>
              Passionate developers and designers creating SimplifiED to make education accessible for everyone.
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Team Member 1 - Pushkar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-transparent hover:bg-white/10 border-white/20 hover:border-white/30' 
                  : 'bg-transparent hover:bg-white/50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20 animate-pulse"></div>
              </div>

              <div className="relative z-10">
                {/* Name */}
                <h3 className={`text-2xl md:text-xl font-bold mb-2 whitespace-nowrap ${
                  isDark ? 'text-white' : 'text-white'
                }`}>
                  Pushkar R Deshpande
                </h3>

                {/* Role */}
                <p className={`text-sm md:text-base font-semibold mb-1 ${
                  isDark ? 'text-blue-300' : 'text-white'
                }`}>
                  Frontend Developer
                </p>


                {/* College Info */}
                <p className={`text-xs md:text-sm mb-6 pb-4 border-b ${
                  isDark ? 'text-gray-400 border-white/10' : 'text-white border-white/30'
                }`}>
                  3rd Sem EIE, BIT Bangalore
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  <a
                    href="https://www.linkedin.com/in/pushkar-r-deshpande-510177334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-blue-500/30 text-white' 
                        : 'bg-gray-200 hover:bg-blue-500/30 text-gray-900'
                    }`}
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/pushkar__deshpande?igsh=MWdwbmlwcDF4amUwcg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-pink-500/30 text-white' 
                        : 'bg-gray-200 hover:bg-pink-500/30 text-gray-900'
                    }`}
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Team Member 2 - Hemsagar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-transparent hover:bg-white/10 border-white/20 hover:border-white/30' 
                  : 'bg-transparent hover:bg-white/50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-green-400/20 via-transparent to-teal-400/20 animate-pulse"></div>
              </div>

              <div className="relative z-10">
                {/* Name */}
                <h3 className={`text-2xl md:text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-white'
                }`}>
                  Hemsagar B C
                </h3>

                {/* Role */}
                <p className={`text-sm md:text-base font-semibold mb-1 ${
                  isDark ? 'text-green-300' : 'text-white'
                }`}>
                  Backend Developer
                </p>

              

                {/* College Info */}
                <p className={`text-xs md:text-sm mb-6 pb-4 border-b ${
                  isDark ? 'text-gray-400 border-white/10' : 'text-white border-white/30'
                }`}>
                  3rd Sem EIE, BIT Bangalore
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  <a
                    href="https://www.linkedin.com/in/hemsagar-b-c-b2610a318?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-blue-500/30 text-white' 
                        : 'bg-gray-200 hover:bg-blue-500/30 text-gray-900'
                    }`}
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/hemsagar_36?igsh=dWcxa3pteG5kcWdr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-pink-500/30 text-white' 
                        : 'bg-gray-200 hover:bg-pink-500/30 text-gray-900'
                    }`}
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Team Member 3 - V S Kiran */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-transparent hover:bg-white/10 border-white/20 hover:border-white/30' 
                  : 'bg-transparent hover:bg-white/50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-purple-400/20 via-transparent to-pink-400/20 animate-pulse"></div>
              </div>

              <div className="relative z-10">
                {/* Name */}
                <h3 className={`text-2xl md:text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-white'
                }`}>
                  V S Kiran
                </h3>

                {/* Role */}
                <p className={`text-sm md:text-base font-semibold mb-1 ${
                  isDark ? 'text-purple-300' : 'text-white'
                }`}>
                  Feature Contributor
                </p>

                

                {/* College Info */}
                <p className={`text-xs md:text-sm mb-6 pb-4 border-b ${
                  isDark ? 'text-gray-400 border-white/10' : 'text-white border-white/30'
                }`}>
                  3rd Sem EIE, BIT Bangalore
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  <a
                    href="https://www.linkedin.com/in/vs-kiran-16b178394?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-blue-500/30 text-white' 
                        : 'bg-gray-200 hover:bg-blue-500/30 text-gray-900'
                    }`}
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-pink-500/30 text-white' 
                        : 'bg-gray-200 hover:bg-pink-500/30 text-gray-900'
                    }`}
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Team Member 4 - Anurag Rao */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 overflow-hidden ${
                isDark 
                  ? 'bg-transparent hover:bg-white/10 border-white/20 hover:border-white/30' 
                  : 'bg-transparent hover:bg-white/50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-orange-400/20 via-transparent to-red-400/20 animate-pulse"></div>
              </div>

              <div className="relative z-10">
                {/* Name */}
                <h3 className={`text-2xl md:text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-white'
                }`}>
                  Anurag Rao
                </h3>

                {/* Role */}
                <p className={`text-sm md:text-base font-semibold mb-1 ${
                  isDark ? 'text-orange-300' : 'text-white'
                }`}>
                  Feature Contributor
                </p>

                

                {/* College Info */}
                <p className={`text-xs md:text-sm mb-6 pb-4 border-b ${
                  isDark ? 'text-gray-400 border-white/10' : 'text-white border-white/30'
                }`}>
                  NITK Surathkal
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-blue-500/30 text-white' 
                        : 'bg-gray-200 hover:bg-blue-500/30 text-gray-900'
                    }`}
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/10 hover:bg-pink-500/30 text-white' 
                        : 'bg-gray-200 hover:bg-pink-500/30 text-gray-900'
                    }`}
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-950' : 'bg-gray-900'} text-white py-12 md:py-16 px-6 sm:px-8 md:px-12 transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-black mb-4">SimplifiED</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Making education accessible for everyone, one lecture at a time.
              </p>
            </div>
            
            
          </div>
          
          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-800'} pt-8 text-center text-gray-400 text-sm`}>
            <p>© 2025 Code Lunatics. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}