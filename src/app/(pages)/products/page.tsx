export const dynamic = "force-dynamic";

import { getProducts } from "@/data/products";
import type { Product } from "@/data/products";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import ProductsPageHeader from "@/components/products/ProductsPageHeader";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  let products: Product[] = [];
  let categoryFilter: string | undefined;
  let renderError = false;

  try {
    const params = await searchParams;
    categoryFilter = params.category;
    products = await getProducts();
    console.log("[ProductsPage] getProducts returned:", products.length, "products");
  } catch (err) {
    console.error("[ProductsPage] Error:", err);
    renderError = true;
  }

  if (renderError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-3">
            Unable to Load Products
          </h1>
          <p className="text-[15px] text-[#64748b] mb-6 max-w-md">
            We are having trouble loading our products right now. Please try refreshing the page.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white font-bold text-[15px] rounded-full hover:bg-[#1d4ed8] transition-colors shadow-md shadow-blue-200"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const activeProducts = products.filter((p) => p.active);
  const categories = Array.from(
    new Set(activeProducts.map((p) => p.category))
  );
  const filteredProducts = categoryFilter
    ? activeProducts.filter((p) => p.category === categoryFilter)
    : activeProducts;

  return (
    <div>
      <ProductsPageHeader />

      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-slate-50 sticky top-[72px] md:top-[80px] z-30">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[#64748b] mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-[13px] font-medium">Filter:</span>
            </div>
            <Link
              href="/products"
              className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all ${
                !categoryFilter
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-200"
                  : "bg-slate-100 text-[#334155] hover:bg-slate-200"
              }`}
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all ${
                  categoryFilter === cat
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-200"
                    : "bg-slate-100 text-[#334155] hover:bg-slate-200"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-[60px] md:py-[72px] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[14px] text-[#64748b]">
              Showing{" "}
              <span className="font-semibold text-[#0f172a]">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
              {categoryFilter && (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-[#2563eb]">
                    {categoryFilter}
                  </span>
                </>
              )}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[16px] text-[#64748b]">
                No products found in this category yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[#2563eb] font-semibold text-[15px] mt-4 hover:gap-3 transition-all"
              >
                View all products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}