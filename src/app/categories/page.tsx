import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function CategoriesIndexPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="flex-1 bg-[var(--color-brand-bg)] min-h-screen text-white flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 pt-32 sm:pt-40 pb-20 px-4 sm:px-8 xl:px-12">
        <div className="max-w-[1600px] mx-auto relative z-10">
          
          <div className="mb-16 sm:mb-24 flex flex-col animate-fade-in-up">
            <div className="flex items-center gap-4 text-[10px] tracking-widest font-mono uppercase text-[var(--color-brand-text-muted)] mb-4">
              <span className="w-8 h-px bg-white/30" />
              <span>[ DATABASE : CATEGORIES ]</span>
            </div>
            <h1
              className="text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tighter text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CATALOG
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group animate-fade-in-up"
                  style={{
                    opacity: 0,
                    animationFillMode: "forwards",
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div
                    className="relative bg-[#4e5e6b] hover:bg-white transition-colors duration-500 clip-corner border border-white/10 flex flex-col justify-between h-40 sm:h-48 p-6 group-hover:border-white"
                  >
                    <div className="flex justify-between items-start text-[10px] font-mono text-white/40 uppercase group-hover:text-black/40 transition-colors">
                      <span>[ DIR_{String(index + 1).padStart(2, '0')} ]</span>
                      <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19L19 5m0 0v11m0-11H8" />
                      </svg>
                    </div>
                    
                    <h2
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-white group-hover:text-black transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {category.name}
                    </h2>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 border border-white/10 clip-corner flex items-center justify-center">
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">[ NO CATEGORIES FOUND ]</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
