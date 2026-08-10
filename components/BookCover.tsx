export default function BookCover({
  title,
  author,
  size = 'sm',
}: {
  title?: string
  author?: string
  size?: 'sm' | 'lg'
}) {
  const isLg = size === 'lg'

  return (
    <div
      className={`relative bg-[#0F2440] border border-brand-gold/40 rounded shadow-md flex flex-col justify-between text-center overflow-hidden transition-transform duration-300 ${
        isLg ? 'w-56 h-80 p-4' : 'w-[85px] h-[125px] p-2'
      }`}
    >
      {/* Spine highlight */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/30 to-transparent"></div>
      {/* Inner gold frame */}
      <div className="absolute inset-1 border border-brand-gold/20 rounded-sm pointer-events-none"></div>

      <div className={`mt-1 space-y-0.5 ${isLg ? 'mt-3 space-y-1' : ''}`}>
        {title ? (
          <p
            className={`text-brand-gold font-bold leading-tight uppercase line-clamp-4 ${
              isLg ? 'text-sm md:text-base tracking-wide' : 'text-[7px] tracking-[0.05em]'
            }`}
          >
            {title}
          </p>
        ) : (
          <div className={`space-y-0.5 ${isLg ? 'space-y-1' : ''}`}>
            <span className={`text-brand-gold tracking-[0.1em] font-bold block leading-none ${isLg ? 'text-xs' : 'text-[7px]'}`}>
              COMUNICA
            </span>
            <span className={`text-brand-gold tracking-[0.1em] font-bold block leading-none ${isLg ? 'text-xs' : 'text-[7px]'}`}>
              LIDERA
            </span>
            <span className={`text-brand-gold tracking-[0.1em] font-bold block leading-none ${isLg ? 'text-xs' : 'text-[7px]'}`}>
              IMPACTA
            </span>
          </div>
        )}
      </div>

      <div className="mb-1">
        <div className={`mx-auto mb-1 bg-brand-gold/30 ${isLg ? 'w-8 h-[1.5px]' : 'w-4 h-[1px]'}`}></div>
        <span className={`text-gray-300 uppercase tracking-widest block leading-none ${isLg ? 'text-[9px]' : 'text-[5px]'}`}>
          {author || 'J. L. ZELADA'}
        </span>
      </div>
    </div>
  )
}
