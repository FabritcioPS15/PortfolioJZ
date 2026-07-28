'use client'

import { useEffect, useRef } from 'react'
import { User, Briefcase } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (textRef.current) {
      observer.observe(textRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative pt-24 md:pt-36 pb-12 md:pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column */}
          <div ref={textRef} className="col-span-1 md:col-span-7 relative z-10 animate-fadeIn space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-[54px] font-serif font-bold text-brand-navy leading-tight tracking-tight mb-4">
                José Luis Zelada Minaya
              </h1>
              <p className="text-sm sm:text-base text-brand-navy font-semibold tracking-wider flex flex-wrap gap-2 items-center">
                <span>Consultor en Gestión del Talento Humano</span>
                <span className="text-gray-300">|</span>
                <span>Investigador</span>
                <span className="text-gray-300">|</span>
                <span>Autor</span>
              </p>
              
              {/* Gold Divider Line - matches screenshot length */}
              <div className="w-full max-w-lg h-[2px] bg-brand-gold mt-4"></div>
            </div>
            
            {/* Quote */}
            <p className="text-base sm:text-lg italic text-gray-700 leading-relaxed max-w-xl font-serif">
              "Generando conocimiento para desarrollar personas, fortalecer organizaciones y contribuir al progreso de la sociedad."
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="flex items-center justify-center gap-2 bg-brand-navy text-white px-6 py-3.5 rounded font-bold text-xs tracking-wider transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group">
                <User size={16} className="group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span>CONOCE MÁS SOBRE MÍ</span>
              </button>
              <button className="flex items-center justify-center gap-2 border-2 border-brand-navy text-brand-navy px-6 py-3.5 rounded font-bold text-xs tracking-wider transition-all duration-300 hover:bg-cream hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 group">
                <Briefcase size={16} className="group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span>MIS CONSULTORÍAS</span>
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="col-span-1 md:col-span-5 flex justify-center md:justify-end animate-fade-in-scale relative">
            <div className="relative w-full max-w-[360px] md:max-w-[400px] group z-10">
              {/* Soft shadows and clean image container as seen in the screenshot */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop"
                  alt="José Luis Zelada Minaya"
                  width={600}
                  height={700}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
