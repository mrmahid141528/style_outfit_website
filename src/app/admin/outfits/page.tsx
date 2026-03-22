"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Outfit {
  id: string;
  title: string;
  main_image_url: string | null;
  is_published: boolean;
  categories: { name: string } | null;
}

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    const { data } = await supabase
      .from("outfits")
      .select("id, title, main_image_url, is_published, categories(name)")
      .order("created_at", { ascending: false });

    if (data) {
      setOutfits(data as unknown as Outfit[]);
    }
    setLoading(false);
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("outfits")
      .update({ is_published: !currentStatus })
      .eq("id", id);

    if (!error) fetchOutfits();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this outfit? All associated products will also be deleted.")) return;

    // Supabase cascading delete should handle products based on FK
    // Also delete image from storage (simplification: leaving image cleanup for later if needed)
    const { error } = await supabase.from("outfits").delete().eq("id", id);
    if (!error) fetchOutfits();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-brand-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Outfits
          </h1>
          <p className="text-sm text-brand-gray-medium mt-1">
            Manage your curated outfit lookbooks.
          </p>
        </div>
        <Link
          href="/admin/outfits/new"
          className="btn-premium inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-black text-white text-sm font-semibold hover:bg-brand-gray-dark transition-all whitespace-nowrap"
          style={{ borderRadius: "var(--radius-full)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Outfit
        </Link>
      </div>

      <div
        className="bg-white border border-brand-gray/50 overflow-hidden"
        style={{ borderRadius: "var(--radius-card)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-gray-light border-b border-brand-gray/50 text-brand-gray-dark">
              <tr>
                <th className="px-5 sm:px-6 py-4 font-semibold uppercase tracking-wider text-xs">Image</th>
                <th className="px-5 sm:px-6 py-4 font-semibold uppercase tracking-wider text-xs">Title</th>
                <th className="px-5 sm:px-6 py-4 font-semibold uppercase tracking-wider text-xs hidden md:table-cell">Category</th>
                <th className="px-5 sm:px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="px-5 sm:px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-brand-gray-medium">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading outfits...
                    </div>
                  </td>
                </tr>
              ) : outfits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-gray-medium flex flex-col items-center">
                    <svg className="w-12 h-12 mb-3 text-brand-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No outfits found. Create your first lookbook!</p>
                  </td>
                </tr>
              ) : (
                outfits.map((outfit) => (
                  <tr key={outfit.id} className="hover:bg-brand-gray-light/30 transition-colors">
                    <td className="px-5 sm:px-6 py-4 w-20">
                      {outfit.main_image_url ? (
                        <div className="relative w-12 h-16 rounded-md overflow-hidden bg-brand-gray-light border border-brand-gray">
                          <Image
                            src={outfit.main_image_url}
                            alt={outfit.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-16 rounded-md bg-brand-gray-light border border-brand-gray flex items-center justify-center">
                          <svg className="w-5 h-5 text-brand-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className="font-semibold text-brand-black">{outfit.title}</span>
                      {/* Show category on mobile below title instead of separate column */}
                      <div className="md:hidden mt-1 text-xs text-brand-gray-medium uppercase tracking-wider">
                        {outfit.categories?.name || "Uncategorized"}
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-4 hidden md:table-cell text-brand-gray-medium text-xs font-medium tracking-wider uppercase">
                      <span className="bg-brand-gray-light px-2.5 py-1 rounded-full border border-brand-gray/50">
                        {outfit.categories?.name || "None"}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <button
                        onClick={() => togglePublish(outfit.id, outfit.is_published)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
                          outfit.is_published
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-brand-gray-light text-brand-gray-dark border-brand-gray hover:bg-brand-gray"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${outfit.is_published ? 'bg-green-500' : 'bg-brand-gray-dark'}`}></span>
                        {outfit.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/outfit/${outfit.id}`}
                          target="_blank"
                          className="text-brand-gray-dark hover:text-brand-black hover:bg-brand-gray-light p-2 rounded-lg transition-colors"
                          title="View on Site"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(outfit.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Delete Outfit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
