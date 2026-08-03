'use client'

import { useEffect, useRef, useState } from 'react'
import { User, Briefcase, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  return (
    <section ref={containerRef} id="inicio" className="relative min-h-[85vh] lg:min-h-screen pt-24 md:pt-32 pb-8 md:pb-16 flex items-center bg-white overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-brand-navy/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">

          {/* Left Column */}
          <div className="col-span-1 md:col-span-7 relative z-10 space-y-6 md:space-y-8">
            <div
              className="space-y-4 text-center md:text-left"
              style={{
                animationName: isVisible ? 'fadeInUp' : 'none',
                animationDuration: '0.8s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                opacity: 0,
              }}
            >
              <h1 className="text-[36px] leading-[1.1] sm:text-5xl lg:text-[72px] font-serif font-bold text-brand-navy tracking-tight">
                José Luis Zelada<br className="hidden lg:block" />
              </h1>

              {/* Single left border for the whole group */}
              <div className="flex items-center justify-center md:justify-start gap-x-2 sm:gap-x-3 text-[13px] sm:text-lg text-gray-600 font-medium tracking-wide mt-3 md:mt-4">
                <span className="text-brand-navy font-bold">Consultor</span>
                <span className="text-gray-300">|</span>
                <span className="text-brand-navy font-bold">Autor</span>
                <span className="text-gray-300">|</span>
                <span className="text-brand-navy font-bold">Coach</span>
              </div>
            </div>

            {/* Quote */}
            <div
              className="relative py-2 text-center md:text-left mx-auto md:mx-0 max-w-2xl px-2 md:px-0"
              style={{
                animationName: isVisible ? 'fadeInUp' : 'none',
                animationDuration: '0.8s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationDelay: '0.2s',
                opacity: 0,
              }}
            >
              <p className="text-sm sm:text-lg md:text-xl text-gray-600 leading-relaxed font-serif italic">
                “Transformando el talento humano en una ventaja competitiva, desarrollando líderes, fortaleciendo equipos y creando organizaciones preparadas para los desafíos del futuro”.
              </p>
            </div>

            {/* Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto px-4 sm:px-0"
              style={{
                animationName: isVisible ? 'fadeInUp' : 'none',
                animationDuration: '0.8s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationDelay: '0.4s',
                opacity: 0,
              }}
            >
              <button 
                onClick={() => document.getElementById('trayectoria')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-navy text-white px-6 py-3 sm:px-8 sm:py-4 rounded font-bold text-[11px] sm:text-xs tracking-[0.1em] transition-all duration-300 hover:bg-brand-navy/90 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 group"
              >
                <User size={16} className="text-brand-gold group-hover:scale-110 transition-transform duration-300" />
                <span>CONOCE MÁS</span>
              </button>
              <button 
                onClick={() => document.getElementById('consultorías')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 text-brand-navy px-6 py-3 sm:px-8 sm:py-4 rounded font-bold text-[11px] sm:text-xs tracking-[0.1em] transition-all duration-300 hover:border-brand-navy hover:bg-gray-50 hover:shadow-md hover:-translate-y-1 active:translate-y-0 group"
              >
                <span>MIS CONSULTORÍAS</span>
                <ArrowRight size={16} className="text-brand-navy group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Right Column - Placeholder Frame */}
          <div
            className="col-span-1 md:col-span-5 flex justify-center md:justify-end relative mt-8 md:mt-0"
            style={{
              animationName: isVisible ? 'fadeInScale' : 'none',
              animationDuration: '1s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
              animationDelay: '0.3s',
              opacity: 0,
            }}
          >
            <div className="relative w-[65%] max-w-[240px] sm:w-[85%] sm:max-w-[320px] md:max-w-[360px] group z-10 mx-auto">
              {/* Decorative background element */}
              <div className="absolute -inset-4 bg-brand-gold/10 rounded-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-6 -z-10"></div>
              <div className="absolute -inset-4 bg-brand-navy/5 rounded-2xl transform -rotate-2 transition-transform duration-500 group-hover:-rotate-4 -z-10"></div>

              {/* Main placeholder container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] bg-white border border-gray-100 p-2 aspect-[4/5]">
                <div className="relative rounded-xl overflow-hidden w-full h-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                  <p className="text-xs sm:text-sm font-bold text-gray-400 tracking-widest uppercase">Espacio para Foto</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
