import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Política de Privacidad | José Luis Zelada',
  description:
    'Política de privacidad del sitio web de José Luis Zelada, consultor en gestión del talento humano. Conoce qué datos recopilamos y cómo los utilizamos.',
}

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Política de Privacidad"
      updated="9 de agosto de 2026"
      icon="shield"
      intro="En José Luis Zelada nos comprometemos a proteger tu privacidad. Esta política explica cómo recopilamos, utilizamos y protegemos la información personal cuando visitas nuestro sitio web."
      blocks={[
        {
          heading: '1. Responsable del tratamiento',
          body: [
            'El responsable del tratamiento de los datos personales recopilados a través de este sitio web es José Luis Zelada, consultor independiente en gestión del talento humano, con domicilio en Perú.',
            'Para cualquier consulta relacionada con esta política puedes escribirnos a contacto@joseluiszelada.pe.',
          ],
        },
        {
          heading: '2. Datos que recopilamos',
          body: [
            'Este sitio es informativo. No recopilamos datos personales de forma activa salvo en los siguientes casos:',
            '• Cuando nos contactas por correo electrónico (nombre y dirección de correo).\n• Datos técnicos de navegación, como dirección IP, tipo de navegador y páginas visitadas, obtenidos a través de herramientas de análisis estadístico.',
          ],
        },
        {
          heading: '3. Uso de la información',
          body: [
            'La información recopilada se utiliza exclusivamente para:',
            '• Responder a tus consultas y solicitudes de información.\n• Mejorar la experiencia y el contenido de este sitio web.\n• Enviarte información únicamente si nos lo has solicitado expresamente.',
          ],
        },
        {
          heading: '4. Cookies',
          body: [
            'Este sitio web puede utilizar cookies para mejorar el rendimiento y la experiencia de navegación. Las cookies son pequeños archivos que se almacenan en tu dispositivo.',
            'Puedes configurar tu navegador para bloquear o eliminar las cookies en cualquier momento. Al deshabilitarlas, algunas funcionalidades del sitio podrían verse afectadas.',
          ],
        },
        {
          heading: '5. Almacenamiento y seguridad',
          body: [
            'Implementamos medidas de seguridad razonables para proteger tu información contra accesos no autorizados, alteración, divulgación o destrucción.',
            'No vendemos, alquilamos ni compartimos tus datos personales con terceros, salvo que la ley lo exija o cuentes con tu consentimiento expreso.',
          ],
        },
        {
          heading: '6. Tus derechos',
          body: [
            'Tienes derecho a solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos personales, así como la portabilidad de los mismos, de acuerdo con la normativa vigente en Perú.',
            'Para ejercer estos derechos, escríbenos a contacto@joseluiszelada.pe indicando el motivo de tu solicitud.',
          ],
        },
        {
          heading: '7. Cambios a esta política',
          body: [
            'Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios se publicarán en esta página, indicando la fecha de la última actualización.',
            'Te recomendamos revisar periódicamente esta sección para estar informado sobre cómo protegemos tu información.',
          ],
        },
      ]}
    />
  )
}
