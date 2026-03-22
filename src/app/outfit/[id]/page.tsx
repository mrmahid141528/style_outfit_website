import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: outfit } = await supabase
    .from("outfits")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: outfit ? `${outfit.title} | FPRN™` : "RECORD | FPRN™",
    description: "[ SYSTEM DATA RECORD REACHED ]",
  };
}

export default async function OutfitPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch outfit and its products
  const { data: outfit, error } = await supabase
    .from("outfits")
    .select(
      `
      *,
      categories (name),
      products (*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !outfit) {
    notFound();
  }

  // Ensure products order is top, bottom, shoes, accessory
  const productOrder = ["Top", "Bottom", "Shoes", "Accessory"];
  const sortedProducts = outfit.products.sort((a: any, b: any) => {
    return productOrder.indexOf(a.item_type) - productOrder.indexOf(b.item_type);
  });

  const shareUrl = `https://style.com/outfit/${outfit.id}`;
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`[ LOG ]: Accessing data record: ${outfit.title}`);

  return (
    <main className="min-h-screen bg-[var(--color-brand-bg)] text-white flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Nav (Back Button) */}
      <div className="md:hidden sticky top-0 z-50 bg-[#3f4d59]/90 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-[10px] font-mono tracking-widest text-white/70 hover:text-white uppercase">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          [ RETURN ]
        </Link>
        <div className="font-bold tracking-tighter text-xl uppercase" style={{ fontFamily: "var(--font-display)" }}>FPRN™</div>
      </div>

      {/* LEFT COLUMN: Sticky Image Cyberpunk Frame */}
      <div className="w-full md:w-[50%] lg:w-[55%] md:h-screen md:sticky md:top-0 relative border-r border-white/10 bg-[#4e5e6b] overflow-hidden p-4 sm:p-8 lg:p-12 flex items-center justify-center">
        {/* Tech decorative background layers */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] md:text-[20vw] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter z-0" style={{ fontFamily: "var(--font-display)" }}>
          {outfit.categories?.name?.substring(0,3).toUpperCase() || "SYS"}
        </div>
        
        {/* The Frame */}
        <div className="relative z-10 w-full h-full max-h-[80vh] tech-border bg-[var(--color-brand-bg)] p-2">
          {outfit.main_image_url ? (
            <div className="relative w-full h-full">
              <Image
                src={outfit.main_image_url}
                alt={outfit.title}
                fill
                className="object-contain object-top animate-fade-in"
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/5">
              <span className="text-white/40 font-mono text-[10px] tracking-widest uppercase">IMAGE_SOURCE_MISSING</span>
            </div>
          )}
          
          {/* Frame Meta Overlays */}
          <div className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-white/60">
            [ ID: {outfit.id.substring(0,8)} ]
          </div>
          <div className="absolute bottom-4 right-4 text-[9px] font-mono tracking-widest text-white/60">
            [ SRC: VERIFIED ]
          </div>
        </div>

        {/* Desktop Back Button */}
        <Link
          href="/"
          className="hidden md:flex absolute top-8 left-8 z-20 items-center justify-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          [ MAIN_TERMINAL ]
        </Link>
      </div>

      {/* RIGHT COLUMN: Details & Products */}
      <div className="w-full md:w-[50%] lg:w-[45%] relative">
        <div className="max-w-xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-20">
          
          {/* Header */}
          <div className="mb-12 sm:mb-16 animate-slide-in-right">
            <div className="flex items-center gap-4 text-[10px] tracking-widest font-mono uppercase text-[var(--color-brand-text-muted)] mb-6">
              <span className="w-6 h-px bg-white/30" />
              <span>[ RECORD: {outfit.categories?.name || "DATABASE"} ]</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-white leading-none mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {outfit.title}
            </h1>
            
            {/* Share Log (Buttons) */}
            <div className="flex items-center gap-4 pt-8 border-t border-white/10">
              <span className="text-[10px] text-[var(--color-brand-text-muted)] font-mono uppercase tracking-[0.2em] mr-2">TRANSMIT DATA:</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all rounded-sm"
                title="Transmit via X"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961h-1.92z" />
                </svg>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodedTitle} %0A%0A ${encodedShareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all rounded-sm"
                title="Transmit via Secure Channel"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Connected Gear / Products List */}
          <div className="animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
            <h2 className="text-[14px] font-mono tracking-[0.2em] text-white uppercase mb-8 flex items-center justify-between border-b border-white/10 pb-4">
              [ CONNECTED GEAR ]
              <span className="text-[10px] text-white/50 bg-white/5 px-2 py-1">
                {sortedProducts.length} ITEMS
              </span>
            </h2>
            
            {sortedProducts.length > 0 ? (
              <div className="space-y-4">
                {sortedProducts.map((product: any, index: number) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{
                      opacity: 0,
                      animationFillMode: "forwards",
                      animationDelay: `${(index * 0.1) + 0.3}s`,
                    }}
                  >
                    <ProductCard
                      title={product.title}
                      itemType={product.item_type}
                      imageUrl={product.image_url}
                      affiliateUrl={product.affiliate_url}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 bg-[var(--color-brand-card)] p-8 border border-white/10 text-center font-mono text-[10px] uppercase tracking-widest clip-corner">
                [ DATABASE ENTRY EMPTY ]
              </p>
            )}
          </div>
          
        </div>
      </div>
    </main>
  );
}
