import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | José Luis Zelada',
  description:
    'Términos y condiciones de uso del sitio web de José Luis Zelada, consultor en gestión del talento humano.',
}

export default function TerminosYCondicionesPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Términos y Condiciones"
      updated="9 de agosto de 2026"
      icon="file"
      intro="Estos términos y condiciones regulan el acceso y uso del sitio web de José Luis Zelada. Al navegar en este sitio aceptas las condiciones descritas a continuación."
      blocks={[
        {
          heading: '1. Aceptación de los términos',
          body: [
            'Al acceder y utilizar este sitio web, aceptas cumplir con los presentes términos y condiciones. Si no estás de acuerdo con alguno de ellos, te pedimos que no continúes utilizando el sitio.',
            'José Luis Zelada se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán publicados en esta página y entrarán en vigencia desde el momento de su publicación.',
          ],
        },
        {
          heading: '2. Uso del sitio',
          body: [
            'El contenido de este sitio tiene fines informativos y educativos relacionados con la gestión del talento humano, el liderazgo y el desarrollo organizacional.',
            'Te comprometes a utilizar este sitio de manera lícita y a no realizar acciones que puedan dañar, sobrecargar o perjudicar el funcionamiento del mismo, ni interferir con el uso de otros usuarios.',
          ],
        },
        {
          heading: '3. Propiedad intelectual',
          body: [
            'Todos los contenidos de este sitio web —incluyendo textos, imágenes, gráficos, logotipos y material audiovisual— son propiedad de José Luis Zelada o de sus respectivos titulares, y están protegidos por las leyes de propiedad intelectual.',
            'Está prohibida la reproducción, distribución, modificación o uso comercial de los contenidos sin autorización previa y por escrito del titular.',
          ],
        },
        {
          heading: '4. Enlaces a terceros',
          body: [
            'Este sitio puede contener enlaces a páginas web de terceros. Estos enlaces se facilitan únicamente con fines informativos y no implican la aprobación ni responsabilidad sobre el contenido de dichas páginas.',
            'No nos hacemos responsables de las políticas de privacidad ni de las prácticas de los sitios externos a los que puedas acceder desde este sitio.',
          ],
        },
        {
          heading: '5. Limitación de responsabilidad',
          body: [
            'La información publicada en este sitio se proporciona "tal cual", sin garantías de exactitud, integridad o idoneidad para un propósito particular.',
            'José Luis Zelada no será responsable de los daños o perjuicios derivados del uso de la información contenida en este sitio web, ni de las decisiones que los usuarios adopten con base en ella.',
          ],
        },
        {
          heading: '6. Ley aplicable',
          body: [
            'Estos términos y condiciones se rigen por las leyes de la República del Perú. Cualquier controversia que surja en relación con el uso de este sitio web estará sujeta a la jurisdicción de los tribunales de Perú.',
          ],
        },
        {
          heading: '7. Contacto',
          body: [
            'Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos a través del correo contacto@joseluiszelada.pe o por medio de nuestra página en LinkedIn.',
          ],
        },
      ]}
    />
  )
}
