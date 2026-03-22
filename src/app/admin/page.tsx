import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch counts
  const [{ count: totalOutfits }, { count: publishedOutfits }, { count: totalCategories }, { count: totalProducts }] = await Promise.all([
    supabase.from("outfits").select("*", { count: "exact", head: true }),
    supabase.from("outfits").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      name: "Total Outfits",
      value: totalOutfits || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "Published",
      value: publishedOutfits || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
    },
    {
      name: "Categories",
      value: totalCategories || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: "bg-purple-50 text-purple-600",
    },
    {
      name: "Total Products",
      value: totalProducts || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-brand-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Dashboard
          </h1>
          <p className="text-sm text-brand-gray-medium mt-1">
            Overview of your platform's content.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.name}
            className="bg-white p-5 sm:p-6 card-hover border border-brand-gray/50"
            style={{
              borderRadius: "var(--radius-card)",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-brand-gray-dark uppercase tracking-wider">
                  {stat.name}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-brand-black mt-0.5">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions (visible mostly on desktop, stacked on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
        <div
          className="bg-brand-black text-white p-6 sm:p-8 relative overflow-hidden group"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Add New Outfit</h3>
            <p className="text-white/70 text-sm mb-6 max-w-xs">
              Create a new premium lookbook containing multiple affiliate products.
            </p>
            <a
              href="/admin/outfits/new"
              className="inline-flex items-center gap-2 bg-white text-brand-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
              style={{ borderRadius: "var(--radius-full)" }}
            >
              Create Outfit
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </a>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
