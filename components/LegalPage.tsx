import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import { Shield, FileText } from 'lucide-react'

export interface LegalBlock {
  heading: string
  body: string[]
}

export default function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  blocks,
  icon = 'shield',
}: {
  eyebrow: string
  title: string
  updated: string
  intro: string
  blocks: LegalBlock[]
  icon?: 'shield' | 'file'
}) {
  const Icon = icon === 'file' ? FileText : Shield

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 md:pt-40 pb-12 md:pb-16 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-brand-navy/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cream flex items-center justify-center mb-5">
              <Icon size={26} className="text-brand-gold" />
            </div>
            <p className="text-brand-gold text-xs md:text-sm font-bold mb-3 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-brand-gold"></span>
              {eyebrow}
              <span className="w-8 h-px bg-brand-gold"></span>
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-navy mb-4 text-balance">
              {title}
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] text-gray-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
              Última actualización: {updated}
            </div>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {intro}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-8 md:px-10 md:py-12 space-y-10">
            {blocks.map((block, index) => (
              <div key={index} className="relative pl-5">
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gradient-to-b from-brand-gold/60 to-brand-gold/10"></span>
                <h2 className="font-serif font-bold text-lg md:text-xl text-brand-navy mb-3">
                  {block.heading}
                </h2>
                <div className="space-y-3">
                  {block.body.map((paragraph, i) => (
                    <p key={i} className="text-sm md:text-[15px] text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
