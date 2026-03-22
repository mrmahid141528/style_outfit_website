import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <div className="flex-1 min-h-screen flex flex-col pt-4 bg-white text-gray-900 font-sans">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-4 block">Our Story</span>
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            About Us
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            We built STYLE to solve a simple problem: finding curated, cohesive outfits without endless scrolling. Our platform connects you with signature pieces hand-picked by fashion experts, ensuring every look is effortlessly put together.
          </p>
        </div>

        <div className="relative w-full h-[50dvh] min-h-[400px] rounded-[2.5rem] overflow-hidden mb-20 shadow-xl">
          <Image 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=900&fit=crop" 
            alt="About Us Fashion Styling" 
            fill 
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto mb-20">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Curation First</h3>
            <p className="text-gray-600 font-light">Every item on our platform is selected for its quality, versatility, and aesthetic alignment.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Direct Access</h3>
            <p className="text-gray-600 font-light">We link you directly to the original retailers, ensuring authentic products at the best prices.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Community</h3>
            <p className="text-gray-600 font-light">Join thousands of others discovering their signature style through our daily drops.</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
