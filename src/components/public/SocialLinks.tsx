import { AtSign, Globe, MessageCircle } from 'lucide-react'
import { brand } from '../../brand/config'

const numeroWhatsapp = brand.contacto.whatsapp.replace(/[^\d]/g, '')

interface Props {
  className?: string
  tamano?: number
}

/**
 * Íconos de redes sociales, siempre visibles (header y footer) para reforzar
 * la presencia de marca. WhatsApp ya es funcional con el número confirmado;
 * Instagram y Facebook quedan listos para activarse en cuanto el cliente
 * confirme sus cuentas (se conectan en src/brand/config.ts).
 */
export function SocialLinks({ className = '', tamano = 16 }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={brand.contacto.instagram || undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        aria-disabled={!brand.contacto.instagram}
        title={brand.contacto.instagram ? 'Instagram' : 'Instagram — próximamente'}
        className={`text-cream-dim transition-colors hover:text-gold ${
          !brand.contacto.instagram ? 'pointer-events-none opacity-40' : ''
        }`}
      >
        <AtSign size={tamano} />
      </a>
      <a
        href={brand.contacto.facebook || undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        aria-disabled={!brand.contacto.facebook}
        title={brand.contacto.facebook ? 'Facebook' : 'Facebook — próximamente'}
        className={`text-cream-dim transition-colors hover:text-gold ${
          !brand.contacto.facebook ? 'pointer-events-none opacity-40' : ''
        }`}
      >
        <Globe size={tamano} />
      </a>
      <a
        href={`https://wa.me/${numeroWhatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="WhatsApp"
        className="text-cream-dim transition-colors hover:text-gold"
      >
        <MessageCircle size={tamano} />
      </a>
    </div>
  )
}
