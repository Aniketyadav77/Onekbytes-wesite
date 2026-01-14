'use client'

import { motion } from 'framer-motion'
import { Users, Target, Award, Globe } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 sm:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-4xl sm:text-6xl font-bold text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Onekbyte 
              </span>
            </motion.h1>
            
            <motion.p
              className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We are pioneers in artificial intelligence, dedicated to creating 
              innovative solutions that shape the future of technology.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                At Onekbyte, we believe in the transformative power of artificial intelligence. 
                Our mission is to develop and deploy cutting-edge AI models and technologies 
                that solve real-world problems and enhance human capabilities.
              </p>
              <p className="text-lg text-gray-300">
                We are committed to advancing the field of AI through rigorous research, 
                ethical development practices, and collaboration with leading institutions 
                and organizations worldwide.
              </p>
            </motion.div>
            
            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl backdrop-blur-sm">
                <Users className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">50+</h3>
                <p className="text-sm text-gray-400">AI Researchers</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl backdrop-blur-sm">
                <Target className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">100+</h3>
                <p className="text-sm text-gray-400">Projects Delivered</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl backdrop-blur-sm">
                <Award className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">25+</h3>
                <p className="text-sm text-gray-400">Industry Awards</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl backdrop-blur-sm">
                <Globe className="w-8 h-8 text-orange-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">15+</h3>
                <p className="text-sm text-gray-400">Countries Served</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              These principles guide everything we do and shape our approach 
              to AI development and deployment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-8 bg-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full mb-6">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Innovation Excellence
              </h3>
              <p className="text-gray-300">
                We push the boundaries of what&apos;s possible in AI, constantly exploring 
                new frontiers and developing groundbreaking solutions.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center p-8 bg-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 border border-green-500/30 rounded-full mb-6">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Ethical AI
              </h3>
              <p className="text-gray-300">
                We are committed to developing AI systems that are fair, transparent, 
                and beneficial to society as a whole.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center p-8 bg-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full mb-6">
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Global Impact
              </h3>
              <p className="text-gray-300">
                Our solutions are designed to make a positive impact on a global scale, 
                addressing challenges that matter most to humanity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Meet the visionaries and experts leading Onekbyte into the future of AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Chen',
                role: 'Chief Executive Officer',
                bio: 'Former AI research lead at major tech companies with 15+ years in machine learning.',
              },
              {
                name: 'Dr. Michael Rodriguez',
                role: 'Chief Technology Officer',
                bio: 'PhD in Computer Science, published researcher in deep learning and neural networks.',
              },
              {
                name: 'Dr. Emily Johnson',
                role: 'Head of Research',
                bio: 'Leading expert in ethical AI and responsible machine learning practices.',
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="text-center p-6 bg-gray-900/30 border border-gray-800 rounded-2xl backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
              >
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
