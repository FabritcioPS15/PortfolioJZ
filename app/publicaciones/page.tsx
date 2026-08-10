import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PublicacionesList from '@/components/PublicacionesList'
import { getSections } from '@/lib/sections'

export const metadata: Metadata = {
  title: 'Publicaciones | José Luis Zelada',
  description:
    'Investigaciones, artículos y publicaciones de José Luis Zelada sobre gestión del talento humano, liderazgo y desarrollo organizacional.',
}

export default async function PublicacionesPage() {
  const sections = await getSections()

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 md:pt-40 pb-12 md:pb-16 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[420px] h-[420px] bg-brand-navy/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-brand-gold text-xs md:text-sm font-bold mb-3 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-brand-gold"></span>
              PUBLICACIONES
              <span className="w-8 h-px bg-brand-gold"></span>
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-navy mb-4 text-balance">
              Todas mis publicaciones
            </h1>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed mb-6">
              Un espacio con las investigaciones, artículos y publicaciones destacadas sobre
              gestión del talento humano, liderazgo y desarrollo organizacional.
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream border border-brand-gold/30 text-[11px] font-bold uppercase tracking-wider text-brand-navy">
              {sections.reduce((acc, s) => acc + s.items.length, 0)} publicaciones disponibles
            </span>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="relative pb-16 md:pb-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <PublicacionesList sections={sections} />
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
