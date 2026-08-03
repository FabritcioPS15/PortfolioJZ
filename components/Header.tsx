'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ArrowRight, Mail } from 'lucide-react'

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

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { label: 'INICIO', target: 'top' },
    { label: 'SOBRE MÍ', target: 'inicio' },
    { label: 'CONSULTORÍAS', target: 'consultorías' },
    { label: 'INVESTIGACIONES', target: 'proyectos' },
    { label: 'ARTÍCULOS', target: 'proyectos' },
  ]

  const scrollToSection = (target: string) => {
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
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
            <Image src="/images/LogoJLZ.png" alt="Logo" width={150} height={40} className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" style={{ width: 'auto' }} priority />
            <div className="hidden sm:block h-8 w-px bg-brand-gold opacity-70"></div>
            <div className="hidden sm:block transition-all duration-300">
              <p className="text-brand-navy font-sans font-bold text-sm tracking-wider leading-tight group-hover:text-brand-gold transition-colors duration-300 whitespace-nowrap">
                JOSÉ LUIS ZELADA
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className={`text-sm font-semibold tracking-wider transition-all duration-300 relative pb-2 ${index === 0
                  ? 'text-brand-navy'
                  : 'text-brand-navy hover:text-brand-gold'
                  } group`}
              >
                {item.label}
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
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            className={`md:hidden p-2.5 rounded-lg text-brand-navy transition-all duration-300 hover:text-brand-gold active:scale-95 ${isMobileMenuOpen ? 'bg-brand-navy/5' : ''
              }`}
          >
            {isMobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 top-20 bg-brand-navy/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
      ></div>

      {/* Mobile Navigation Panel */}
      <div
        className={`md:hidden fixed inset-x-0 top-20 z-40 px-4 pt-2 transition-all duration-300 ease-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 pointer-events-none opacity-0'
          }`}
      >
        <nav className="rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-cream/60 to-transparent">
            <p className="text-[11px] font-bold tracking-[0.2em] text-brand-navy/60 uppercase">Menú</p>
            <span className="h-px flex-1 mx-4 bg-brand-gold/30"></span>
            <span className="text-[11px] font-bold text-brand-gold">JZ</span>
          </div>

          <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto">
            {navItems.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold tracking-wider text-brand-navy transition-colors duration-200 hover:bg-cream hover:text-brand-gold border-b border-gray-100 last:border-b-0 active:bg-cream"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-navy/5 text-[10px] font-bold text-brand-gold group-hover:bg-brand-navy group-hover:text-white transition-colors duration-200">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </span>
                <ArrowRight size={16} className="text-gray-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-gold" />
              </button>
            ))}
          </div>

          <a
            href="mailto:contacto@joseluiszelada.pe"
            className="flex items-center justify-center gap-2 px-5 py-4 bg-brand-navy text-white text-xs font-bold tracking-wider hover:bg-brand-navy/90 transition-colors duration-200"
          >
            <Mail size={14} className="text-brand-gold" />
            CONTÁCTAME
          </a>
        </nav>
      </div>
    </header>
  )
}
