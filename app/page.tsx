import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import Featured from '@/components/Featured'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

// Render dinámico: siempre lee las secciones más recientes de Supabase
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <Services />
      <Featured />
      <Footer />
      <ScrollToTop />
    </main>
  )
}