import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import OutfitCard from "@/components/OutfitCard";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Fetch publsihed outfits for the scrolling marquee
  const { data: outfits } = await supabase
    .from("outfits")
    .select("id, title, main_image_url, categories(name)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(8);

  // Duplicate outfits list once so the CSS marquee can scroll seamlessly endlessly
  const marqueeItems = outfits && outfits.length > 0 ? [...outfits, ...outfits, ...outfits] : [];

  return (
    <div className="flex-1 min-h-screen text-[#1a1a1a] flex flex-col pt-4">
      <SiteHeader />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* =========================================
            HERO SECTION (Giant Image Wrapper)
           ========================================= */}
        <section className="mt-6 mb-8 sm:mb-12">
          <div className="w-full bg-gray-100 rounded-[2.5rem] h-[60vh] min-h-[500px] flex items-center justify-center relative overflow-hidden shadow-lg group">
            {outfits?.[0]?.main_image_url ? (
               <>
                 <Image
                   src={outfits[0].main_image_url}
                   alt="Featured Outfit"
                   fill
                   className="object-cover object-top group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                   priority
                 />
                 {/* Dark Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white pt-32">
                   <h1 
                     className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4 drop-shadow-xl"
                     style={{ fontFamily: "var(--font-serif)" }}
                   >
                     Signature Style
                   </h1>
                   <p className="text-lg sm:text-xl text-white/90 max-w-xl mx-auto font-light drop-shadow-md">
                     Discover hand-picked collections shaping the modern aesthetic.
                   </p>
                   <Link 
                     href={`/outfit/${outfits[0].id}`}
                     className="mt-8 px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-black hover:text-white transition-all shadow-xl"
                   >
                     Explore Collection
                   </Link>
                 </div>
               </>
            ) : (
               <div className="text-gray-400 font-medium">Hero Image Space</div>
            )}
          </div>
        </section>

        {/* =========================================
            CATEGORY ROW (Pill Navigation)
           ========================================= */}
        <section className="mb-20 sm:mb-28 flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-4 px-2">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="whitespace-nowrap flex-shrink-0 px-6 sm:px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-900 hover:text-white hover:shadow-md transition-all border border-gray-200"
              >
                {cat.name}
              </Link>
            ))
          ) : (
             <div className="whitespace-nowrap flex-shrink-0 px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-medium">
               Editorial
             </div>
          )}
          
          <Link href="/categories" className="flex-shrink-0 w-12 h-12 bg-white border border-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all ml-auto shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </section>

        {/* =========================================
            LATEST OUTFIT (Infinite Right-to-Left Marquee)
           ========================================= */}
        <section className="mb-24 sm:mb-32">
          <h2 
            className="text-4xl sm:text-5xl lg:text-6xl text-center mb-16 text-black tracking-tight" 
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Latest Outfit
          </h2>
          
          {/* Seamless Infinite Marquee Wrapper */}
          <div className="relative flex overflow-hidden group w-full">
            {/* White gradient fade edges for smooth scroll entrance/exit */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
              {/* Track 1 */}
              <div className="flex gap-6 sm:gap-8 px-3">
                {marqueeItems.length > 0 ? (
                  marqueeItems.map((outfit, index) => (
                    <div key={`t1-${outfit.id}-${index}`} className="flex-shrink-0">
                      <OutfitCard
                        id={outfit.id}
                        title={outfit.title}
                        mainImageUrl={outfit.main_image_url}
                      />
                    </div>
                  ))
                ) : (
                  [1,2,3,4].map((num) => (
                    <div key={`t1-${num}`} className="flex-shrink-0">
                      <OutfitCard id="latest" title={`Outfit image ${num}`} mainImageUrl={null} />
                    </div>
                  ))
                )}
              </div>
              
              {/* Track 2 (Exact Duplicate for seamless loop) */}
              <div className="flex gap-6 sm:gap-8 px-3">
                {marqueeItems.length > 0 ? (
                  marqueeItems.map((outfit, index) => (
                    <div key={`t2-${outfit.id}-${index}`} className="flex-shrink-0">
                      <OutfitCard
                        id={outfit.id}
                        title={outfit.title}
                        mainImageUrl={outfit.main_image_url}
                      />
                    </div>
                  ))
                ) : (
                  [1,2,3,4].map((num) => (
                    <div key={`t2-${num}`} className="flex-shrink-0">
                      <OutfitCard id="latest" title={`Outfit image ${num}`} mainImageUrl={null} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            TESTIMONIAL SECTION
           ========================================= */}
        <section className="mb-24 sm:mb-36">
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-4 block">Words from the community</span>
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight" 
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Testimonial Section
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-6 text-gray-900">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed font-light">
                "The curation on this platform is unmatched. I've found so many signature pieces that completely elevated my winter wardrobe."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User View" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Jenkins</h4>
                  <p className="text-sm text-gray-500">Stylist, NY</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 hover:shadow-xl transition-shadow text-white shadow-lg transform md:-translate-y-4">
              <div className="flex items-center gap-1 mb-6 text-white">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed font-light">
                "Absolutely brilliant. Being able to see how the pieces fit together before buying has saved me so much time and money."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User View" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Marcus Thorne</h4>
                  <p className="text-sm text-gray-400">Creative Director</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-6 text-gray-900">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed font-light">
                "The aesthetic is just perfectly minimalist. It's my daily destination for finding exactly what pieces are trending."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop" alt="User View" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Elena Rostova</h4>
                  <p className="text-sm text-gray-500">Fashion Blogger</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
