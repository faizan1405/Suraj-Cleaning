"use client";

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Filter, Search, X } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import ProductsPageHeader from "@/components/products/ProductsPageHeader";
import type { Product } from "@/data/product-types";

function ProductsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim().toLowerCase()), 150);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const categories = useMemo(() => {
    return Array.from(new Set(allProducts.filter((p) => p.active).map((p) => p.category)));
  }, [allProducts]);

  const activeProducts = useMemo(() => allProducts.filter((p) => p.active), [allProducts]);

  const matchesSearch = useCallback((product: Product, query: string): boolean => {
    if (!query) return true;
    const haystack = [
      product.name,
      product.category,
      product.shortDescription,
      product.description,
      ...(product.benefits || []),
      ...(product.directions || []),
      product.badge || "",
    ]
      .join(" ")
      .toLowerCase();
    return query
      .split(/\s+/)
      .filter(Boolean)
      .every((token) => haystack.includes(token));
  }, []);

  const filteredProducts = useMemo(() => {
    let results = activeProducts;
    if (categoryFilter) {
      results = results.filter((p) => p.category === categoryFilter);
    }
    if (debouncedSearch) {
      results = results.filter((p) => matchesSearch(p, debouncedSearch));
    }
    return results;
  }, [activeProducts, categoryFilter, debouncedSearch, matchesSearch]);

  const setCategory = useCallback((cat: string | undefined) => {
    const url = cat ? `/products?category=${encodeURIComponent(cat)}` : "/products";
    router.push(url, { scroll: true });
  }, [router]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    searchInputRef.current?.focus();
  }, []);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      clearSearch();
    }
  }, [clearSearch]);

  const isSearching = debouncedSearch.length > 0;
  const isClearVisible = searchQuery.length > 0;

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
        <div className="mx-auto max-w-[1260px] px-5 md:px-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products by name, category, or keyword..."
              aria-label="Search products"
              autoComplete="off"
              spellCheck={false}
              className="w-full pl-11 pr-24 py-3 text-[14px] bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] focus:bg-white transition-all text-[#0f172a] placeholder:text-slate-400"
            />
            {isClearVisible && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-[#64748b] bg-white border border-slate-200 rounded-full hover:bg-slate-100 hover:text-[#0f172a] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

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
                <X className="w-3.5 h-3.5" /> Clear category
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
              <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
                <p className="text-[14px] text-[#64748b]">
                  Showing <span className="font-semibold text-[#0f172a]">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "product" : "products"}
                  {categoryFilter && !isSearching && <> in <span className="font-semibold text-[#2563eb]">{categoryFilter}</span></>}
                  {isSearching && <> matching <span className="font-semibold text-[#2563eb]">&ldquo;{debouncedSearch}&rdquo;</span></>}
                  {isSearching && categoryFilter && <> in <span className="font-semibold text-[#2563eb]">{categoryFilter}</span></>}
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
                  <div className="w-14 h-14 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-[16px] font-semibold text-[#0f172a] mb-2">
                    {isSearching ? "No products found" : "No products found in this category yet"}
                  </p>
                  <p className="text-[13px] text-[#64748b] mb-6 max-w-sm mx-auto">
                    {isSearching
                      ? `We couldn't find any products matching "${debouncedSearch}". Try a different keyword or check the spelling.`
                      : "Try a different category or browse all products."}
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {isSearching && (
                      <button
                        onClick={clearSearch}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white font-semibold text-[14px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200"
                      >
                        <X className="w-4 h-4" /> Clear search
                      </button>
                    )}
                    {(categoryFilter || isSearching) && (
                      <button
                        onClick={() => { clearSearch(); setCategory(undefined); }}
                        className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[14px] hover:gap-3 transition-all"
                      >
                        View all products <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
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