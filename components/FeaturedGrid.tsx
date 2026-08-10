'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Section } from '@/lib/sections'
import SectionCarouselCard from './SectionCarouselCard'
import SectionBookCard from './SectionBookCard'

function SectionCard({
  section,
  isVisible,
  delay,
}: {
  section: Section
  isVisible: boolean
  delay: string
}) {
  if (section.type === 'book') {
    return <SectionBookCard section={section} isVisible={isVisible} delay={delay} />
  }
  return <SectionCarouselCard section={section} isVisible={isVisible} delay={delay} />
}

export default function FeaturedGrid({ sections }: { sections: Section[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const mainSections = sections.slice(0, 3)
  const extraSections = sections.slice(3)

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
    const el = carouselRef.current
    if (!el || extraSections.length === 0) return

    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const slide = el.querySelector<HTMLElement>('[data-slide]')
        const w = slide ? slide.offsetWidth : el.clientWidth
        const idx = Math.round(el.scrollLeft / w)
        setActiveIndex(Math.min(Math.max(idx, 0), extraSections.length - 1))
      })
    }

    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [extraSections.length])

  const scrollToSlide = (i: number) => {
    const el = carouselRef.current
    if (!el) return
    const slide = el.querySelector<HTMLElement>('[data-slide]')
    const w = slide ? slide.offsetWidth : el.clientWidth
    el.scrollTo({ left: i * w, behavior: 'smooth' })
  }

  if (sections.length === 0) return null

  return (
    <section id="proyectos" className="relative py-12 md:py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {mainSections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              isVisible={isVisible}
              delay={`${0.2 + index * 0.1}s`}
            />
          ))}
        </div>

        {extraSections.length > 0 && (
          <div className="mt-12">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center">
                  <Plus size={16} className="text-brand-gold" />
                </div>
                <h2 className="text-lg md:text-xl font-serif font-bold text-brand-navy tracking-wider uppercase">
                  Más publicaciones
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToSlide(Math.max(activeIndex - 1, 0))}
                  disabled={activeIndex === 0}
                  aria-label="Anterior"
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-brand-navy flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    scrollToSlide(Math.min(activeIndex + 1, extraSections.length - 1))
                  }
                  disabled={activeIndex === extraSections.length - 1}
                  aria-label="Siguiente"
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-brand-navy flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
                <Link
                  href="/publicaciones"
                  className="ml-1 text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors duration-300"
                >
                  Ver todas
                </Link>
              </div>
            </div>

            {/* Carousel */}
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2"
            >
              {extraSections.map((section, index) => (
                <div
                  key={section.id}
                  data-slide
                  className="w-[85%] sm:w-[420px] lg:w-[400px] flex-shrink-0 snap-center"
                >
                  <SectionCard
                    section={section}
                    isVisible={isVisible}
                    delay={`${0.2 + index * 0.1}s`}
                  />
                </div>
              ))}
            </div>

            {/* Dots */}
            {extraSections.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {extraSections.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSlide(i)}
                    aria-label={`Ir a la publicación ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === i
                        ? 'w-6 bg-brand-gold'
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA a todas las publicaciones */}
        <div className="flex justify-center mt-12">
          <Link
            href="/publicaciones"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-navy text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-brand-navy/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Ver todas las publicaciones <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
