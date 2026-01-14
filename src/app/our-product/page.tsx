'use client'

import { motion } from 'framer-motion'

export default function OurProductPage() {
  return (
    <div className="bg-black min-h-screen">
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

            {/* Card 2: Video */}
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

            {/* Card 3: Video */}
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
                    <source src="/videos/blackbox.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
