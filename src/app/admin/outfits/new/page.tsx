"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface ProductItem {
  item_type: "top" | "bottom" | "shoes" | "accessory";
  title: string;
  image_url: string;
  affiliate_url: string;
  uploading: boolean;
}

const PRODUCT_SECTIONS: { type: ProductItem["item_type"]; label: string }[] = [
  { type: "top", label: "Top" },
  { type: "bottom", label: "Bottom" },
  { type: "shoes", label: "Shoes" },
  { type: "accessory", label: "Accessory" },
];

export default function NewOutfitPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>(
    PRODUCT_SECTIONS.map((s) => ({
      item_type: s.type,
      title: "",
      image_url: "",
      affiliate_url: "",
      uploading: false,
    }))
  );
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    setCategories(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `outfits/${fileName}`;

    const { error } = await supabase.storage
      .from("style-images")
      .upload(filePath, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("style-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageUploading(true);
    try {
      const url = await uploadImage(file);
      setMainImageUrl(url);
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    }
    setMainImageUploading(false);
  };

  const handleProductImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, uploading: true } : p))
    );
    try {
      const url = await uploadImage(file);
      setProducts((prev) =>
        prev.map((p, i) =>
          i === index ? { ...p, image_url: url, uploading: false } : p
        )
      );
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
      setProducts((prev) =>
        prev.map((p, i) => (i === index ? { ...p, uploading: false } : p))
      );
    }
  };

  const updateProduct = (
    index: number,
    field: keyof ProductItem,
    value: string
  ) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !categoryId || !mainImageUrl) {
      alert("Please fill in the outfit title, category, and main image.");
      return;
    }

    // Validate at least one product has data
    const validProducts = products.filter(
      (p) => p.title && p.affiliate_url
    );
    if (validProducts.length === 0) {
      alert("Please add at least one product with a title and affiliate URL.");
      return;
    }

    setSaving(true);

    try {
      // Step 1: Insert outfit
      const { data: outfit, error: outfitError } = await supabase
        .from("outfits")
        .insert({
          title,
          category_id: categoryId,
          main_image_url: mainImageUrl,
          is_published: true,
        })
        .select("id")
        .single();

      if (outfitError) throw outfitError;

      // Step 2: Insert products
      const productInserts = validProducts.map((p) => ({
        outfit_id: outfit.id,
        item_type: p.item_type,
        title: p.title,
        image_url: p.image_url || null,
        affiliate_url: p.affiliate_url,
      }));

      const { error: productsError } = await supabase
        .from("products")
        .insert(productInserts);

      if (productsError) throw productsError;

      router.push("/admin/outfits");
      router.refresh();
    } catch (err) {
      alert("Error saving outfit: " + (err as Error).message);
    }

    setSaving(false);
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h1
          className="text-3xl mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Add New Outfit
        </h1>
        <p className="text-brand-gray-medium">
          Create a new curated outfit with affiliate products.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* =========================================
            SECTION 1: Outfit Details
           ========================================= */}
        <div
          className="bg-white p-6 sm:p-8 border border-brand-gray"
          style={{
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: "var(--font-sans)" }}>
            Outfit Details
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="outfit-title"
                className="block text-sm font-medium text-brand-gray-dark mb-1.5"
              >
                Title
              </label>
              <input
                id="outfit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. The Dark Minimalist"
                className="w-full px-4 py-3 border border-brand-gray bg-brand-gray-light text-brand-black placeholder-brand-gray-medium focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-transparent transition-all"
                style={{ borderRadius: "var(--radius-input)" }}
              />
            </div>
            <div>
              <label
                htmlFor="outfit-category"
                className="block text-sm font-medium text-brand-gray-dark mb-1.5"
              >
                Category
              </label>
              <select
                id="outfit-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 border border-brand-gray bg-brand-gray-light text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-transparent transition-all cursor-pointer"
                style={{ borderRadius: "var(--radius-input)" }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* =========================================
            SECTION 2: Main Image Upload
           ========================================= */}
        <div
          className="bg-white p-6 sm:p-8 border border-brand-gray"
          style={{
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: "var(--font-sans)" }}>
            Main Outfit Image
          </h2>

          {mainImageUrl ? (
            <div className="relative">
              <Image
                src={mainImageUrl}
                alt="Main outfit"
                width={400}
                height={500}
                className="object-cover border border-brand-gray"
                style={{ borderRadius: "var(--radius-input)" }}
              />
              <button
                type="button"
                onClick={() => setMainImageUrl("")}
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-white transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-brand-gray hover:border-brand-gray-dark cursor-pointer transition-colors"
              style={{ borderRadius: "var(--radius-input)" }}
            >
              {mainImageUploading ? (
                <div className="flex items-center gap-2 text-brand-gray-medium">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Uploading...
                </div>
              ) : (
                <>
                  <svg
                    className="w-10 h-10 text-brand-gray-medium mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-brand-gray-medium">
                    Click to upload outfit image
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* =========================================
            SECTION 3: Product Items
           ========================================= */}
        <div
          className="bg-white p-6 sm:p-8 border border-brand-gray"
          style={{
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: "var(--font-sans)" }}>
            Product Items (Affiliate Links)
          </h2>

          <div className="space-y-6">
            {products.map((product, index) => (
              <div
                key={product.item_type}
                className="p-5 bg-brand-gray-light border border-brand-gray"
                style={{ borderRadius: "var(--radius-input)" }}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-gray-dark mb-4">
                  {PRODUCT_SECTIONS[index].label}
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={product.title}
                    onChange={(e) =>
                      updateProduct(index, "title", e.target.value)
                    }
                    placeholder="Product title (e.g. Black Oversized Linen Shirt)"
                    className="w-full px-4 py-2.5 border border-brand-gray bg-white text-brand-black placeholder-brand-gray-medium focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-transparent transition-all text-sm"
                    style={{ borderRadius: "var(--radius-input)" }}
                  />

                  <input
                    type="url"
                    value={product.affiliate_url}
                    onChange={(e) =>
                      updateProduct(index, "affiliate_url", e.target.value)
                    }
                    placeholder="Affiliate URL (e.g. https://amzn.to/...)"
                    className="w-full px-4 py-2.5 border border-brand-gray bg-white text-brand-black placeholder-brand-gray-medium focus:outline-none focus:ring-2 focus:ring-brand-black focus:border-transparent transition-all text-sm"
                    style={{ borderRadius: "var(--radius-input)" }}
                  />

                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image_url}
                          alt={product.title || "Product"}
                          width={60}
                          height={60}
                          className="object-cover border border-brand-gray rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateProduct(index, "image_url", "")
                          }
                          className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 text-sm text-brand-gray-medium hover:text-brand-black cursor-pointer transition-colors">
                        {product.uploading ? (
                          "Uploading..."
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                              />
                            </svg>
                            Upload product image
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProductImageUpload(index, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            SECTION 4: Submit
           ========================================= */}
        <div
          className="bg-white p-6 sm:p-8 border border-brand-gray sticky bottom-4"
          style={{
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-brand-black text-white text-lg font-semibold tracking-wide hover:bg-brand-gray-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              style={{ borderRadius: "var(--radius-button)" }}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving Outfit...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Publish Outfit
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-4 border-2 border-brand-gray text-brand-gray-dark font-semibold hover:bg-brand-gray-light transition-all cursor-pointer"
              style={{ borderRadius: "var(--radius-button)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
