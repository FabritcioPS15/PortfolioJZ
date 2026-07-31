'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Building2, BookOpen, PenTool } from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: '15+',
    label: 'Años de experiencia',
  },
  {
    icon: Building2,
    number: '10+',
    label: 'Organizaciones asesoradas',
  },
  {
    icon: BookOpen,
    number: '3+',
    label: 'Libros escritos',
  },
  {
    icon: PenTool,
    number: '50+',
    label: 'Artículos publicados',
  },
]

function AnimatedCounter({ value, isVisible }: { value: string; isVisible: boolean }) {
  const [count, setCount] = useState(0)
  const endNum = parseInt(value.replace(/\D/g, '')) || 0
  const suffix = value.replace(/[0-9]/g, '')

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const duration = 2000 // 2 seconds animation

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // easeOutExpo for smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      setCount(Math.floor(easeProgress * endNum))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [endNum, isVisible])

  return <>{count}{suffix}</>
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
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
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  return (
    <section ref={sectionRef} className="relative py-16 md:py-20 bg-brand-navy text-white overflow-hidden">
      {/* Decorative gradient lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-16 gap-x-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center group relative ${index !== stats.length - 1 ? 'lg:after:content-[""] lg:after:absolute lg:after:right-0 lg:after:top-1/4 lg:after:h-1/2 lg:after:w-px lg:after:bg-white/20' : ''
                  } ${index % 2 === 0 ? 'sm:after:content-[""] sm:after:absolute sm:after:right-0 sm:after:top-1/4 sm:after:h-1/2 sm:after:w-px sm:after:bg-white/20 lg:sm:after:content-none' : ''
                  }`}
                style={{
                  animationName: isVisible ? 'fadeInUp' : 'none',
                  animationDuration: '0.6s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'forwards',
                  animationDelay: `${0.1 + index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={36} className="text-brand-gold" />
                </div>
                <p className="text-4xl sm:text-5xl font-serif font-bold mb-2 group-hover:text-brand-gold transition-colors duration-300">
                  <AnimatedCounter value={stat.number} isVisible={isVisible} />
                </p>
                <p className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors duration-300 tracking-wide font-medium">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
