"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Filter, X } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import ProductsPageHeader from "@/components/products/ProductsPageHeader";
import type { Product } from "@/data/product-types";

function ProductsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const categoryFilter = searchParams.get("category") || undefined;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const products = await res.json();
        if (!cancelled) {
          setAllProducts(products);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(allProducts.filter((p) => p.active).map((p) => p.category)));
  }, [allProducts]);

  const activeProducts = useMemo(() => allProducts.filter((p) => p.active), [allProducts]);
  const filteredProducts = useMemo(() => {
    if (!categoryFilter) return activeProducts;
    return activeProducts.filter((p) => p.category === categoryFilter);
  }, [activeProducts, categoryFilter]);

  const setCategory = useCallback((cat: string | undefined) => {
    const url = cat ? `/products?category=${encodeURIComponent(cat)}` : "/products";
    router.push(url, { scroll: true });
  }, [router]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-3">Unable to Load Products</h1>
          <p className="text-[15px] text-[#64748b] mb-6 max-w-md">We are having trouble loading our products right now. Please try refreshing the page.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200">Go Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProductsPageHeader />

      <section className="py-6 bg-white border-b border-slate-50 sticky top-[72px] md:top-[80px] z-30">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[#64748b] mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-[13px] font-medium">Filter:</span>
            </div>
            <button
              onClick={() => setCategory(undefined)}
              className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all ${
                !categoryFilter
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-200"
                  : "bg-slate-100 text-[#334155] hover:bg-slate-200"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all ${
                  categoryFilter === cat
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-200"
                    : "bg-slate-100 text-[#334155] hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
            {categoryFilter && (
              <button
                onClick={() => setCategory(undefined)}
                className="inline-flex items-center gap-1 text-[12px] text-[#64748b] hover:text-[#2563eb] transition-colors ml-1"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-[60px] md:py-[72px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[20px] overflow-hidden border border-slate-100 animate-pulse">
                  <div className="aspect-square bg-slate-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-8 bg-slate-100 rounded-full w-1/3 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-[14px] text-[#64748b]">
                  Showing <span className="font-semibold text-[#0f172a]">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "product" : "products"}
                  {categoryFilter && <> in <span className="font-semibold text-[#2563eb]">{categoryFilter}</span></>}
                </p>
              </div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-[16px] text-[#64748b]">No products found in this category yet.</p>
                  <button onClick={() => setCategory(undefined)} className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px] mt-4 hover:gap-3 transition-all">
                    View all products <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <ProductsInner />
    </Suspense>
  );
}