import { getProducts, getCategories } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import type { Product } from "@/data/products";
import ProductsView from "@/components/products/ProductsView";

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="bg-white border border-slate-100 rounded-[20px] overflow-hidden card-lift flex flex-col"
    >
      <div className="relative aspect-square bg-[#f8fafc] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 img-zoom"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.bestSeller && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#2563eb] text-white text-[10px] font-bold rounded-full">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-medium text-[#2563eb] mb-0.5">
          {product.category}
        </span>
        <h3 className="text-[15px] font-bold text-[#0f172a] mb-1">
          {product.name}
        </h3>
        <p className="text-[12px] text-[#64748b] mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[18px] font-bold text-[#2563eb]">
            ₹{product.price}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="text-[13px] font-semibold text-white bg-[#2563eb] px-3.5 py-1.5 rounded-full hover:bg-[#1d4ed8] transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryFilter } = await searchParams;
  const products = await getProducts();
  const categories = await getCategories();

  const activeProducts = products.filter((p) => p.active);
  const filteredProducts = categoryFilter
    ? activeProducts.filter((p) => p.category === categoryFilter)
    : activeProducts;

  return (
    <div>
      {/* Page Header */}
      <section className="pt-[120px] pb-[40px] md:pt-[140px] md:pb-[50px] bg-white">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[44px] font-bold text-[#0f172a] mb-3"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[15px] md:text-[16px] text-[#64748b] max-w-lg mx-auto"
          >
            Discover our range of premium cleaning solutions for every need.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-12 h-1 bg-[#2563eb] rounded-full mx-auto mt-4"
          />
        </div>
      </section>

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
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all ${
                  categoryFilter === cat.name
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-200"
                    : "bg-slate-100 text-[#334155] hover:bg-slate-200"
                }`}
              >
                {cat.name}
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
