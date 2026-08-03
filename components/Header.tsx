'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = ['INICIO', 'SOBRE MÍ', 'CONSULTORÍAS', 'INVESTIGACIONES', 'ARTÍCULOS']

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-md ${isScrolled ? 'bg-white/95 shadow-lg' : 'bg-white'
        }`}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-3 flex-shrink-0 group">
            <Image src="/images/LogoJLZ.png" alt="Logo" width={150} height={40} className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" priority />
            <div className="hidden sm:block h-8 w-px bg-brand-gold opacity-70"></div>
            <div className="hidden sm:block transition-all duration-300">
              <p className="text-brand-navy font-sans font-bold text-xs tracking-wider leading-tight group-hover:text-brand-gold transition-colors duration-300">
                JOSÉ LUIS<br />ZELADA
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, ''))}
                className={`text-xs font-semibold tracking-wider transition-all duration-300 relative pb-2 ${index === 0
                  ? 'text-brand-navy'
                  : 'text-brand-navy hover:text-brand-gold'
                  } group`}
              >
                {item}
                {index === 0 ? (
                  <span className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-brand-gold transition-all duration-300"></span>
                ) : (
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-brand-gold group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300"></span>
                )}
              </button>
            ))}
          </nav>



          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-brand-navy transition-all duration-300 hover:text-brand-gold hover:scale-110"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 space-y-1 animate-fade-in-up">
            {navItems.map((item, idx) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, ''))}
                className="block w-full text-left px-4 py-3 text-sm font-semibold tracking-wider text-brand-navy hover:bg-cream hover:text-brand-gold transition-all duration-300 group border-l-2 border-transparent hover:border-brand-gold"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">{item}</span>
              </button>
            ))}

          </nav>
        )}
      </div>
    </header>
  )
}
