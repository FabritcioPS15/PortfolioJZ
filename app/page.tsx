'use client'

import { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import Featured from '@/components/Featured'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export default function Page() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} />
      <Hero />
      <Stats />
      <Services />
      <Featured />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
