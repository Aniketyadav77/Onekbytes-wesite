'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function Navbar() {
	const pathname = usePathname()
	const router = useRouter()
	const { user, isAdmin, signOut } = useAuth()
	const [activeSection, setActiveSection] = useState<string>('')

	// Intersection Observer for detecting active section (on home page only)
	useEffect(() => {
		if (pathname !== '/') return

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id)
					}
				})
			},
			{ threshold: 0.3 }
		)

		const sections = document.querySelectorAll('[data-section]')
		sections.forEach((section) => observer.observe(section))

		return () => observer.disconnect()
	}, [pathname])

	const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
		e.preventDefault()

		if (pathname === '/') {
			const element = document.getElementById(targetId)
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' })
			}
		} else {
			router.push(`/#${targetId}`)
		}
	}

	const handleSignInClick = () => {
		router.push('/signin')
	}

	const handleSignUpClick = () => {
		router.push('/signup')
	}

	const navItems: Array<{ name: string; href: string; isAnchor?: boolean }> = [
		{ name: 'Home', href: '/' },
		{ name: 'Research', href: '/research' },
		{ name: 'Careers', href: '/careers' },
		{ name: 'Our Product', href: '/our-product' },
		{ name: 'Contact', href: '/contact' },
	]

	const handleSignOut = async () => {
		try {
			await signOut()
			router.push('/')
		} catch {
			router.push('/')
		}
	}

	// On auth pages, hide full navbar and show only a small Home button
	if (pathname === '/signup' || pathname === '/signin') {
		return (
			<motion.nav
				className="fixed top-4 left-4 z-50"
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Link
					href="/"
					className="px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20 bg-black/70 hover:bg-black/80"
				>
					← Back to Home
				</Link>
			</motion.nav>
		)
	}

	return (
		<motion.nav
			className="fixed top-0 left-0 right-0 z-50 p-4"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex items-center justify-between gap-8">
					{/* Logo on the left (hidden on /signup) */}
					{pathname !== '/signup' && (
						<Link href="/" className="flex-shrink-0 -ml-16">
							<Image
								src="/images/logo2.png"
								alt="OneKbyte Labs"
								width={120}
								height={120}
								className="h-24 w-auto"
								priority
							/>
						</Link>
					)}
          
					{/* Centered Navigation */}
					<div className="flex-1 flex justify-center">
					{/* Animated Blue Gradient Border Container */}
					<div className="relative">
						{/* Animated blue gradient border */}
						<div className="absolute -inset-0.5 animate-blue-gradient rounded-full opacity-75 animate-spin blur-sm pointer-events-none"></div>
						<div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full opacity-50 animate-pulse pointer-events-none"></div>
            
						{/* Main Navigation Container */}
						<div className="relative flex items-center bg-black/90 backdrop-blur-lg rounded-full px-6 py-3 border border-gray-800 pointer-events-auto">
							{/* Purple Accent Dot */}
							<div className="w-3 h-3 bg-purple-500 rounded-full mr-6"></div>
              
							{/* Navigation Items */}
							<div className="flex items-center space-x-1">
								{navItems.map((item) => {
								const isActive = item.isAnchor 
									? pathname === '/' && activeSection === 'our-product'
									: pathname === item.href
                
								return item.isAnchor ? (
									<a
										key={item.name}
										href={item.href}
										onClick={(e) => handleSmoothScroll(e, 'our-product')}
										className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
											isActive
												? 'bg-gray-700 text-white'
												: 'text-gray-300 hover:text-white hover:bg-gray-800'
										}`}
									>
										{item.name}
									</a>
								) : (
									<Link
										key={item.name}
										href={item.href}
										className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
											isActive
												? 'bg-gray-700 text-white'
												: 'text-gray-300 hover:text-white hover:bg-gray-800'
										}`}
									>
										{item.name}
									</Link>
								)
							})}
                
								{/* Auth Buttons */}
								{user ? (
									<div className="flex items-center space-x-1 ml-2 pl-2 border-l border-gray-700">
										{isAdmin && (
											<Link
												href="/admin/jobs"
												className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
													pathname === '/admin/jobs'
														? 'bg-purple-600 text-white'
														: 'text-purple-400 hover:text-white hover:bg-purple-600'
												}`}
											>
												Admin
											</Link>
										)}
										<div className="px-3 py-2 text-sm text-gray-300">
											{user.email?.split('@')[0]}
										</div>
										<button
											onClick={handleSignOut}
											type="button"
											className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
										>
											Sign Out
										</button>
									</div>
								) : (
									<div className="flex items-center space-x-1 ml-2 pl-2 border-l border-gray-700">
										<button
											onClick={handleSignUpClick}
											className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
										>
											Sign up
										</button>
										<button
											onClick={handleSignInClick}
											className="px-4 py-2 rounded-full text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
										>
											Log in
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
					</div>

					{/* Corner video on the right (hidden on /research and /signup) */}
					{pathname !== '/research' && pathname !== '/signup' && (
						<div className="hidden sm:block flex-shrink-0 -mr-16">
							<div className="relative">
								<video
									src="/videos/Astronaut_Animation.mp4"
									className="h-28 w-28 rounded-lg object-cover shadow-lg"
									autoPlay
									loop
									muted
									playsInline
									aria-label="Astronaut animation"
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</motion.nav>
	)
}
