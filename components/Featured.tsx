'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, BookOpen, PenTool } from 'lucide-react'
import Image from 'next/image'

export default function Featured() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  const [currentResearch, setCurrentResearch] = useState(0)
  const [currentArticle, setCurrentArticle] = useState(0)

  const researchItems = [
    {
      title: 'Gestión del talento humano y desempeño organizacional: un análisis en el contexto peruano',
      year: '2024',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop',
    },
    {
      title: 'Impacto de la inteligencia artificial en la selección de personal',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&h=300&fit=crop',
    },
    {
      title: 'Estrategias de retención de talento en la nueva normalidad',
      year: '2023',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    }
  ]

  const articleItems = [
    {
      title: 'Liderazgo consciente: la clave para equipos comprometidos y organizaciones sostenibles',
      date: 'Mayo 2024',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=300&fit=crop',
    },
    {
      title: 'Cómo construir una cultura organizacional resiliente en tiempos de cambio',
      date: 'Abril 2024',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop',
    },
    {
      title: 'El rol del feedback continuo en el desarrollo profesional de tu equipo',
      date: 'Marzo 2024',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&h=300&fit=crop',
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            observer.disconnect()
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentResearch((prev) => (prev + 1) % researchItems.length)
      setCurrentArticle((prev) => (prev + 1) % articleItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [researchItems.length, articleItems.length])

  return (
    <section id="proyectos" className="relative py-12 md:py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {/* Card 1: Investigaciones Destacadas */}
          <div
            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            style={{
              animationName: isVisible ? 'fadeInUp' : 'none',
              animationDuration: '0.6s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
              animationDelay: '0.2s',
              opacity: 0,
            }}
          >
            {/* Header bar */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Search size={16} className="text-brand-navy" />
                <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                  INVESTIGACIONES DESTACADAS
                </p>
              </div>
              <a href="#" className="text-[11px] font-bold text-brand-navy hover:text-brand-gold transition-colors duration-300">
                Ver todas
              </a>
            </div>

            {/* Image */}
            <div className="relative w-full h-44 overflow-hidden bg-gray-100">
              {researchItems.map((item, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentResearch ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="p-5 flex-grow flex flex-col justify-between relative overflow-hidden">
              <div className="relative h-24">
                {researchItems.map((item, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 space-y-2 ${index === currentResearch ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
                  >
                    <h3 className="font-serif font-bold text-base text-brand-navy leading-snug line-clamp-3">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {item.year}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex flex-col gap-4 mt-auto z-10 bg-white">
                <a
                  href="#"
                  className="text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors duration-300 inline-flex items-center gap-1"
                >
                  Leer más <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                
                {/* Dots indicator */}
                <div className="flex justify-center gap-1.5 pt-2">
                  {researchItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentResearch(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentResearch ? 'w-4 bg-brand-gold' : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Artículos Recientes */}
          <div
            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            style={{
              animationName: isVisible ? 'fadeInUp' : 'none',
              animationDuration: '0.6s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
              animationDelay: '0.3s',
              opacity: 0,
            }}
          >
            {/* Header bar */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-brand-navy" />
                <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                  ARTÍCULOS RECIENTES
                </p>
              </div>
              <a href="#" className="text-[11px] font-bold text-brand-navy hover:text-brand-gold transition-colors duration-300">
                Ver todas
              </a>
            </div>

            {/* Image */}
            <div className="relative w-full h-44 overflow-hidden bg-gray-100">
              {articleItems.map((item, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentArticle ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="p-5 flex-grow flex flex-col justify-between relative overflow-hidden">
              <div className="relative h-24">
                {articleItems.map((item, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 space-y-2 ${index === currentArticle ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
                  >
                    <h3 className="font-serif font-bold text-base text-brand-navy leading-snug line-clamp-3">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {item.date}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex flex-col gap-4 mt-auto z-10 bg-white">
                <a
                  href="#"
                  className="text-xs font-semibold text-brand-navy hover:text-brand-gold transition-colors duration-300 inline-flex items-center gap-1"
                >
                  Leer más <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                
                {/* Dots indicator */}
                <div className="flex justify-center gap-1.5 pt-2">
                  {articleItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentArticle(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentArticle ? 'w-4 bg-brand-gold' : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Publicación Destacada */}
          <div
            className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            style={{
              animationName: isVisible ? 'fadeInUp' : 'none',
              animationDuration: '0.6s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
              animationDelay: '0.4s',
              opacity: 0,
            }}
          >
            {/* Header bar */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <PenTool size={16} className="text-brand-navy" />
                <p className="text-[11px] font-bold text-brand-navy tracking-wider uppercase">
                  PUBLICACIÓN DESTACADA
                </p>
              </div>
              <a href="#" className="text-[11px] font-bold text-brand-navy hover:text-brand-gold transition-colors duration-300">
                Ver más
              </a>
            </div>

            {/* Content Body with 2 columns: Book Cover + Details */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div className="grid grid-cols-12 gap-4 items-center mb-4">
                {/* Left: Book Cover Mockup */}
                <div className="col-span-4 flex justify-center py-2">
                  <div className="w-[85px] h-[125px] bg-[#0F2440] border border-brand-gold/40 rounded shadow-md relative flex flex-col justify-between p-2 text-center transform -rotate-3 transition-transform duration-300 group-hover:rotate-0">
                    {/* Spine highlight */}
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/30 to-transparent"></div>
                    {/* Inner gold frame */}
                    <div className="absolute inset-1 border border-brand-gold/20 rounded-sm pointer-events-none"></div>
                    
                    <div className="mt-2 space-y-0.5">
                      <span className="text-[7px] text-brand-gold tracking-[0.1em] font-bold block leading-none">COMUNICA</span>
                      <span className="text-[7px] text-brand-gold tracking-[0.1em] font-bold block leading-none">LIDERA</span>
                      <span className="text-[7px] text-brand-gold tracking-[0.1em] font-bold block leading-none">IMPACTA</span>
                    </div>
                    
                    <div className="mb-1">
                      <div className="w-4 h-[1px] bg-brand-gold/30 mx-auto mb-1"></div>
                      <span className="text-[5px] text-gray-300 uppercase tracking-widest block leading-none">J. L. ZELADA</span>
                    </div>
                  </div>
                </div>

                {/* Right: Book Details */}
                <div className="col-span-8 space-y-2">
                  <h3 className="font-serif font-bold text-base text-brand-navy leading-snug">
                    Comunica, Lidera, Impacta
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Estrategias prácticas para desarrollar liderazgo, comunicación efectiva e influencia positiva.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button className="w-full py-2.5 rounded border border-brand-gold text-brand-gold hover:bg-[#FDF3E3] hover:text-brand-navy font-bold text-xs tracking-wider transition-colors duration-300">
                  CONOCE MÁS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
