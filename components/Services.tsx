'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, TrendingUp, Target } from 'lucide-react'

const services = [
  {
    icon: Users,
    title: 'Gestión del Talento Humano',
    description:
      'Diseño e implemento estrategias para atraer, desarrollar y retener el talento que impulsa los resultados.',
  },
  {
    icon: TrendingUp,
    title: 'Desarrollo Organizacional',
    description:
      'Fortalezco la cultura, los procesos y la estructura organizacional para lograr equipos más ágiles y efectivos.',
  },
  {
    icon: Target,
    title: 'Consultoría Estratégica',
    description:
      'Acompaño a líderes y organizaciones en la toma de decisiones y en la ejecución de estrategias de alto impacto.',
  },
]

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  return (
    <section id="consultorías" className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-brand-gold text-xs md:text-sm font-bold mb-3 uppercase tracking-[0.2em] flex items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="w-8 h-px bg-brand-gold"></span>
            LO QUE HAGO
            <span className="w-8 h-px bg-brand-gold"></span>
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4 text-balance animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Acompaño a personas y organizaciones
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Brindo consultoría especializada y soluciones estratégicas para impulsar el talento humano, la productividad y el desarrollo organizacional sostenible.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group flex gap-4 p-5 md:p-6 rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-lg"
                style={{
                  animationName: isVisible ? 'fadeInUp' : 'none',
                  animationDuration: '0.6s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'forwards',
                  animationDelay: `${0.2 + index * 0.1}s`,
                  opacity: 0,
                }}
              >
                {/* Icon Column (left) */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-[#FDF3E3] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                    <Icon size={24} className="text-brand-gold" />
                  </div>
                </div>
                
                {/* Content Column (right) */}
                <div className="flex-grow pt-1">
                  <h3 className="text-lg font-serif font-bold text-brand-navy mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
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
