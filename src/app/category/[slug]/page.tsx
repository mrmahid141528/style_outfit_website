import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OutfitCard from "@/components/OutfitCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const title = decodedSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${title} | RECORD`,
    description: `[ ACCESSING DIRECTORY : ${title} ]`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = await createClient();

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", decodedSlug)
    .single();

  if (categoryError || !category) {
    notFound();
  }

  const { data: outfits } = await supabase
    .from("outfits")
    .select("id, title, main_image_url")
    .eq("category_id", category.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 bg-[var(--color-brand-bg)] min-h-screen text-white flex flex-col font-sans">
      <SiteHeader categories={[]} />

      <main className="flex-1 pt-32 sm:pt-40 pb-20 px-4 sm:px-8 xl:px-12 relative overflow-hidden">
        
        {/* Background ambient text */}
        <div 
          className="absolute top-40 -left-10 text-[15vw] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter whitespace-nowrap z-0 relative" 
          style={{ fontFamily: "var(--font-display)" }}
        >
          {category.name.toUpperCase()}
        </div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-4 text-[10px] tracking-widest font-mono uppercase text-[var(--color-brand-text-muted)] mb-4">
                <span className="w-8 h-px bg-white/30" />
                <span>[ DIRECTORY : {category.name} ]</span>
              </div>
              <h1
                className="text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tighter text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {category.name}
              </h1>
            </div>
            
            <div className="flex flex-col gap-1 text-[10px] font-mono tracking-widest uppercase text-[var(--color-brand-text-muted)] text-right">
              <span>RECORDS FOUND: {outfits?.length || 0}</span>
              <span>FILTER: DEFAULT</span>
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
                    categoryName={category.name}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full py-32 border border-white/10 clip-corner flex items-center justify-center">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">[ NO RECORDS IN THIS DIRECTORY ]</span>
            </div>
          )}
        </div>
      </main>

      <SiteFooter categories={[]} />
    </div>
  );
}
