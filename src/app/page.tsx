'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Shield, Phone, Mail, MapPin, Facebook, Twitter, Youtube, Linkedin, Instagram } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SparklesCore } from '@/components/ui/sparkles'

export default function Home() {

  

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          <motion.h1
            className="text-5xl sm:text-7xl lg:text-9xl font-bold text-white tracking-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="md:text-7xl text-3xl lg:text-9xl font-bold text-center relative z-20 inline-block">
              {/* Animated Onekbyte text - each letter appears one by one */}
              {['O', 'n', 'e', 'k', 'b', 'y', 't', 'e'].map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block relative"
                  initial={{ 
                    opacity: 0, 
                    y: 50, 
                    z: -100,
                    rotateX: -90,
                    scale: 0.5
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    z: 0,
                    rotateX: 0,
                    scale: 1
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center bottom"
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotateY: 15,
                    z: 20,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Base metallic layer */}
                  <span
                    style={{
                      background: `linear-gradient(
                        180deg,
                        #ffffff 0%,
                        #f0f0f0 5%,
                        #d4d4d4 10%,
                        #a8a8a8 25%,
                        #6b6b6b 45%,
                        #4a4a4a 50%,
                        #6b6b6b 55%,
                        #a8a8a8 75%,
                        #d4d4d4 90%,
                        #f0f0f0 95%,
                        #ffffff 100%
                      )`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: 'inline-block',
                      position: 'relative',
                      filter: 'drop-shadow(2px 2px 0px #2a2a2a) drop-shadow(-1px -1px 0px #555555)'
                    }}
                  >
                    {letter}
                  </span>
                  {/* Highlight shine overlay */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(
                        135deg,
                        rgba(255,255,255,0.9) 0%,
                        rgba(255,255,255,0.4) 10%,
                        transparent 30%,
                        transparent 70%,
                        rgba(255,255,255,0.2) 90%,
                        rgba(255,255,255,0.5) 100%
                      )`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      pointerEvents: 'none',
                      mixBlendMode: 'overlay'
                    }}
                  >
                    {letter}
                  </span>
                </motion.span>
              ))}
            </span>
            
            {/* Labs text - positioned bottom right, dark metallic orange */}
            <div className="flex justify-end mt-[-10px] mr-[-5px]">
              <span className="md:text-2xl text-lg lg:text-3xl font-bold relative z-20 inline-block tracking-wider">
                {['L', 'a', 'b', 's'].map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block relative"
                    initial={{ 
                      opacity: 0, 
                      y: 30, 
                      scale: 0.5
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 1.2 + index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "center bottom"
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotateY: 15,
                      z: 20,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {/* Base metallic grey layer */}
                    <span
                      style={{
                        background: `linear-gradient(
                          180deg,
                          #ffffff 0%,
                          #f0f0f0 5%,
                          #d4d4d4 10%,
                          #a8a8a8 25%,
                          #6b6b6b 45%,
                          #4a4a4a 50%,
                          #6b6b6b 55%,
                          #a8a8a8 75%,
                          #d4d4d4 90%,
                          #f0f0f0 95%,
                          #ffffff 100%
                        )`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'inline-block',
                        position: 'relative',
                        filter: 'drop-shadow(2px 2px 0px #2a2a2a) drop-shadow(-1px -1px 0px #555555)'
                      }}
                    >
                      {letter}
                    </span>
                    {/* Highlight shine overlay */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(
                          135deg,
                          rgba(255,255,255,0.9) 0%,
                          rgba(255,255,255,0.4) 10%,
                          transparent 30%,
                          transparent 70%,
                          rgba(255,255,255,0.2) 90%,
                          rgba(255,255,255,0.5) 100%
                        )`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        pointerEvents: 'none',
                        mixBlendMode: 'overlay'
                      }}
                    >
                      {letter}
                    </span>
                  </motion.span>
                ))}
              </span>
            </div>
          </motion.h1>
          
          {/* Gradient Lines */}
          <div className="w-[40rem] h-40 relative mx-auto mb-8">
            {/* Gradients */}
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>

          
          <motion.p
            className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            
          </motion.p>
        </div>
      </section>

      {/* IIT Roorkee + MITS Logo Section */}
      <section
        id="iit-logo"
        className="relative min-h-screen flex flex-col items-center justify-center bg-black -mt-40"
      >
        <div className="flex items-center justify-center gap-12 -mt-16">
          {/* MITS Logo (left) + Label */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src="/images/mits_logo.jpg"
                alt="MITS Logo"
                width={160}
                height={160}
                className="object-cover"
                priority
              />
            </div>
            <p className="text-center text-slate-400 font-light tracking-tight text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
              MITS Gwalior
            </p>
          </div>
          {/* X sign (center) */}
          <div className="flex items-center justify-center text-white/80 font-bold text-[10rem] leading-none select-none -mt-2">
            ×
          </div>
          {/* IIT Roorkee Logo (right) + Label */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src="/images/iitr_logo.png"
                alt="IIT Roorkee Logo"
                width={160}
                height={160}
                className="object-cover"
                priority
              />
            </div>
            <p className="text-center text-slate-400 font-light tracking-tight text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
              IIT Roorkee
            </p>
          </div>
        </div>
        <p className="text-center font-light  tracking-tight text-3xl sm:text-4xl md:text-6xl lg:text-5xl mt-16 relative z-20">
          {/* Alumni */}
          <span className="inline-flex gap-0 align-middle">
            {['A', 'l', 'u', 'm', 'n', 'i'].map((letter, index) => (
              <motion.span
                key={`alumni-${index}`}
                className="inline-block relative"
                initial={{ 
                  opacity: 0, 
                  y: 30, 
                  scale: 0.5
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1
                }}
                transition={{
                  duration: 0.6,
                  delay: 1.6 + index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center bottom"
                }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 15,
                  z: 20,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Base metallic layer */}
                <span
                  style={{
                    background: `linear-gradient(
                      180deg,
                      #ffffff 0%,
                      #f0f0f0 5%,
                      #d4d4d4 10%,
                      #a8a8a8 25%,
                      #6b6b6b 45%,
                      #4a4a4a 50%,
                      #6b6b6b 55%,
                      #a8a8a8 75%,
                      #d4d4d4 90%,
                      #f0f0f0 95%,
                      #ffffff 100%
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    position: 'relative',
                    filter: 'drop-shadow(2px 2px 0px #2a2a2a) drop-shadow(-1px -1px 0px #555555)'
                  }}
                >
                  {letter}
                </span>
                {/* Highlight shine overlay */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(
                      135deg,
                      rgba(255,255,255,0.9) 0%,
                      rgba(255,255,255,0.4) 10%,
                      transparent 30%,
                      transparent 70%,
                      rgba(255,255,255,0.2) 90%,
                      rgba(255,255,255,0.5) 100%
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay'
                  }}
                >
                  {letter}
                </span>
              </motion.span>
            ))}
          </span>

          {/* Spacer between words */}
          <span className="inline-block mx-3 sm:mx-5" aria-hidden="true"></span>

          {/* Startup */}
          <span className="inline-flex gap-0 align-middle">
            {['S', 't', 'a', 'r', 't', 'u', 'p'].map((letter, index) => (
              <motion.span
                key={`startup-${index}`}
                className="inline-block relative"
                initial={{ 
                  opacity: 0, 
                  y: 30, 
                  scale: 0.5
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1
                }}
                transition={{
                  duration: 0.6,
                  delay: 1.6 + (6 * 0.08) + index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center bottom"
                }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 15,
                  z: 20,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Base metallic layer */}
                <span
                  style={{
                    background: `linear-gradient(
                      180deg,
                      #ffffff 0%,
                      #f0f0f0 5%,
                      #d4d4d4 10%,
                      #a8a8a8 25%,
                      #6b6b6b 45%,
                      #4a4a4a 50%,
                      #6b6b6b 55%,
                      #a8a8a8 75%,
                      #d4d4d4 90%,
                      #f0f0f0 95%,
                      #ffffff 100%
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    position: 'relative',
                    filter: 'drop-shadow(2px 2px 0px #2a2a2a) drop-shadow(-1px -1px 0px #555555)'
                  }}
                >
                  {letter}
                </span>
                {/* Highlight shine overlay */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(
                      135deg,
                      rgba(255,255,255,0.9) 0%,
                      rgba(255,255,255,0.4) 10%,
                      transparent 30%,
                      transparent 70%,
                      rgba(255,255,255,0.2) 90%,
                      rgba(255,255,255,0.5) 100%
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay'
                  }}
                >
                  {letter}
                </span>
              </motion.span>
            ))}
          </span>
        </p>
      </section>

      {/* Our Product Section - Horizontal Scroll */}
      <section 
        id="our-product" 
        data-section
        className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
        
        <div className="relative w-full max-w-7xl mx-auto z-10">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-12" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Card 1: Video */}
            <div className="flex-shrink-0 w-full snap-center px-4 sm:px-6 lg:px-8">
              <motion.div
                className="relative w-full h-[70vh] sm:h-[75vh] lg:h-[80vh]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-3xl" />
                
                {/* Video Container */}
                <motion.div
                  className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm bg-black/30 shadow-2xl"
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ 
                    borderColor: 'rgba(255,255,255,0.2)',
                    boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/images/mvp-image.png"
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/product.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </motion.div>
            </div>

            {/* Card 2: Image */}
            

             <div className="flex-shrink-0 w-full snap-center px-4 sm:px-6 lg:px-8">
              <motion.div
                className="relative w-full h-[70vh] sm:h-[75vh] lg:h-[80vh]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-3xl" />
                
                {/* Video Container */}
                <motion.div
                  className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm bg-black/30 shadow-2xl"
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ 
                    borderColor: 'rgba(255,255,255,0.2)',
                    boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/images/mvp-image.png"
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/cctv-camera.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </motion.div>
            </div>

            {/* Card 3: Text Content */}
             <div className="flex-shrink-0 w-full snap-center px-4 sm:px-6 lg:px-8">
              <motion.div
                className="relative w-full h-[70vh] sm:h-[75vh] lg:h-[80vh]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
              >
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-3xl" />
                
                {/* Video Container */}
                <motion.div
                  className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm bg-black/30 shadow-2xl"
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ 
                    borderColor: 'rgba(255,255,255,0.2)',
                    boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/images/mvp-image.png"
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/cctv-camera.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      

      {/* Features Section */}
      <section className="relative py-20 bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Leading Innovation in AI
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our expertise spans across multiple domains of artificial intelligence, 
              delivering solutions that make a real-world impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-8 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Advanced Machine Learning
              </h3>
              <p className="text-gray-300">
                State-of-the-art ML models designed for complex problem-solving 
                and intelligent automation across industries.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center p-8 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                High-Performance Computing
              </h3>
              <p className="text-gray-300">
                Optimized algorithms and infrastructure for rapid deployment 
                and scalable AI solutions in production environments.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center p-8 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Secure & Ethical AI
              </h3>
              <p className="text-gray-300">
                Building responsible AI systems with robust security measures 
                and ethical considerations at the core of our development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand + logo */}
            <div>
              <div className="relative w-40 h-20 mb-4">
                <div className="relative w-40 h-20 mb-12 -mt-2">
                  <Image
                    src="/images/logo2.png"
                    alt="Onekbytes Labs Logo"
                    width={160}
                    height={80}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-10">
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="#" aria-label="X" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
                  <Youtube className="w-5 h-5 text-white" />
                </a>
                <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/careers">Services</Link></li>
                <li><Link href="/mvp">Technology</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-white font-semibold mb-4">Solutions</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/research">Research</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/70" /> Gwalior, India</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/70" /> Global Operations</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-white/70" /> +91 7987021642</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-white/70" /> info@onekbyteslabs.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6 text-center">
            <Link href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</Link>
            <p className="text-gray-400 mt-3">© {new Date().getFullYear()} Onekbytes Labs. All rights reserved.</p>
            <p className="text-gray-400 mt-2">Made with ❤️ by Aniket</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
