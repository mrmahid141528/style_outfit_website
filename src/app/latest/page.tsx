import { createClient } from "@/lib/supabase/server";
import OutfitCard from "@/components/OutfitCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function LatestPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const { data: outfits } = await supabase
    .from("outfits")
    .select("id, title, main_image_url, categories(name)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(24);

  return (
    <div className="flex-1 bg-[var(--color-brand-bg)] min-h-screen text-white flex flex-col font-sans">
      <SiteHeader categories={categories || []} />

      <main className="flex-1 pt-32 sm:pt-40 pb-20 px-4 sm:px-8 xl:px-12 relative overflow-hidden">
        
        {/* Background ambient text */}
        <div 
          className="absolute top-40 -left-20 text-[20vw] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter whitespace-nowrap z-0 relative" 
          style={{ fontFamily: "var(--font-display)" }}
        >
          LATEST MODULES
        </div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-4 text-[10px] tracking-widest font-mono uppercase text-[var(--color-brand-text-muted)] mb-4">
                <span className="w-8 h-px bg-white/30" />
                <span>[ MODULE : LATEST ]</span>
              </div>
              <h1
                className="text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tighter text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                LATEST
              </h1>
            </div>
            
            {/* Techwear style filter badges */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-widest uppercase text-[var(--color-brand-text-muted)]">
              <span className="px-3 py-1 border border-white/20 text-white truncate">ALL MODULES</span>
              <span className="px-3 py-1 border border-white/10 hover:border-white/40 cursor-pointer transition-colors truncate">SYSTEM</span>
              <span className="px-3 py-1 border border-white/10 hover:border-white/40 cursor-pointer transition-colors truncate">GEAR</span>
            </div>
          </div>

          {outfits && outfits.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {outfits.map((outfit, index) => (
                <div
                  key={outfit.id}
                  className="animate-fade-in-up"
                  style={{
                    opacity: 0,
                    animationFillMode: "forwards",
                    animationDelay: `${(index % 4) * 0.1}s`,
                  }}
                >
                  <OutfitCard
                    id={outfit.id}
                    title={outfit.title}
                    mainImageUrl={outfit.main_image_url}
                    categoryName={
                      (outfit.categories as unknown as { name: string })?.name
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full py-32 border border-white/10 clip-corner flex items-center justify-center">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">[ AWAITING DEPLOYMENT ]</span>
            </div>
          )}
        </div>
      </main>

      <SiteFooter categories={categories || []} />
    </div>
  );
}
