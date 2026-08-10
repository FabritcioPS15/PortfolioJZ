'use client'

import { Mail, ArrowUp } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer id="contacto" className="relative bg-[#0F2440] text-white py-8 md:py-10 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Image src="/images/JLZlogo.png" alt="José Luis Zelada" width={120} height={32} className="h-8 w-auto" style={{ width: 'auto' }} />
            <div className="text-[11px] text-gray-400 leading-tight text-center md:text-left">
              <p>© {new Date().getFullYear()} José Luis Zelada</p>
              <p>Todos los derechos reservados.</p>
            </div>
          </div>

          {/* Middle: Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <a
              href="mailto:contacto@joseluiszelada.pe"
              className="flex items-center gap-2 text-[11px] text-gray-300 hover:text-brand-gold transition-colors duration-300"
            >
              <Mail size={14} className="text-brand-gold" />
              <span>contacto@joseluiszelada.pe</span>
            </a>

            <a
              href="https://linkedin.com/in/joseluiszelada"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-gray-300 hover:text-brand-gold transition-colors duration-300"
            >
              <svg className="w-3.5 h-3.5 text-brand-gold fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>linkedin.com/in/joseluiszelada</span>
            </a>
          </div>

          {/* Right: Legal & Scroll to Top */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-3 text-[11px] text-gray-400">
              <a
                href="/politica-de-privacidad"
                className="hover:text-brand-gold transition-colors duration-300"
              >
                Política de Privacidad
              </a>
              <span className="hidden sm:inline text-gray-600">|</span>
              <a
                href="/terminos-y-condiciones"
                className="hover:text-brand-gold transition-colors duration-300"
              >
                Términos y Condiciones
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 bg-brand-gold text-brand-navy rounded-full flex items-center justify-center hover:bg-brand-gold/90 transition-colors duration-300"
              aria-label="Subir"
            >
              <ArrowUp size={16} />
            </button>
          </div>

        </div>
      </div>
    </footer>
  )
}
