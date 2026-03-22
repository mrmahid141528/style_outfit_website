"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setAdding(true);
    const slug = generateSlug(newName);

    const { error } = await supabase
      .from("categories")
      .insert([{ name: newName.trim(), slug }]);

    if (!error) {
      setNewName("");
      fetchCategories();
    } else {
      alert("Error adding category: " + error.message);
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will fail if there are outfits in this category.")) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      fetchCategories();
    } else {
      alert("Error deleting category: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-brand-black"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Categories
          </h1>
          <p className="text-sm text-brand-gray-medium mt-1">
            Manage organization categories for outfits.
          </p>
        </div>
      </div>

      {/* Add Category Form */}
      <div
        className="bg-white p-5 sm:p-6 border border-brand-gray/50"
        style={{ borderRadius: "var(--radius-card)" }}
      >
        <h2 className="text-lg font-semibold mb-4 text-brand-black">Add New Category</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Summer Wear, Office GenZ"
            className="flex-1 px-4 py-3 border border-brand-gray bg-brand-gray-light/50 focus:outline-none focus:ring-2 focus:ring-brand-black/80 transition-all text-sm"
            style={{ borderRadius: "var(--radius-input)" }}
            required
          />
          <button
            type="submit"
            disabled={adding || !newName.trim()}
            className="px-6 py-3 bg-brand-black text-white font-medium hover:bg-brand-gray-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm flex items-center justify-center gap-2"
            style={{ borderRadius: "var(--radius-input)" }}
          >
            {adding ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            Add Category
          </button>
        </form>
      </div>

      {/* Category List */}
      <div
        className="bg-white border border-brand-gray/50 overflow-hidden"
        style={{ borderRadius: "var(--radius-card)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-gray-light border-b border-brand-gray/50 text-brand-gray-dark">
              <tr>
                <th className="px-5 sm:px-6 py-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                <th className="px-5 sm:px-6 py-4 font-semibold uppercase tracking-wider text-xs hidden sm:table-cell">Slug</th>
                <th className="px-5 sm:px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray/50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-brand-gray-medium">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-brand-gray-medium text-sm">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-brand-gray-light/30 transition-colors">
                    <td className="px-5 sm:px-6 py-4 font-medium text-brand-black">{category.name}</td>
                    <td className="px-5 sm:px-6 py-4 text-brand-gray-medium hidden sm:table-cell font-mono text-xs">
                      {category.slug}
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
