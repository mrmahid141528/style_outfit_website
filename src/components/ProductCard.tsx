import Image from "next/image";

interface ProductCardProps {
  title: string;
  itemType: string;
  imageUrl: string | null;
  affiliateUrl: string | null;
}

export default function ProductCard({
  title,
  itemType,
  imageUrl,
  affiliateUrl,
}: ProductCardProps) {
  return (
    <div
      className="bg-[var(--color-brand-card)] p-4 sm:p-5 flex gap-4 sm:gap-6 items-center border border-white/10 clip-corner hover:bg-[#6f8395] transition-colors duration-300 group"
    >
      {/* Product Image Tech Frame */}
      <div
        className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-white/5 border border-white/20 tech-border mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 96px, 112px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">N/A</span>
          </div>
        )}
      </div>

      {/* Product Info & CTA */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-none bg-white/50"></span>
          <p className="text-[9px] text-[var(--color-brand-text-muted)] uppercase tracking-[0.2em] font-mono">
            [ TYPE: {itemType} ]
          </p>
        </div>
        
        <h3
          className="text-sm sm:text-base font-bold text-white mb-4 truncate uppercase tracking-widest"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        
        {affiliateUrl ? (
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 border border-white/30 bg-transparent text-white text-[10px] font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
          >
            <span className="w-1 h-3 bg-white/50" /> 
            ACCESS LINK
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 border border-white/10 bg-black/20 text-white/40 text-[10px] font-mono tracking-widest uppercase cursor-not-allowed"
          >
            OFFLINE
          </button>
        )}
      </div>
    </div>
  );
}
