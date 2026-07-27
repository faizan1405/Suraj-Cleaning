"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";

import { ProductImage } from "./ProductImage";

/* ─── Product Card ─── */

function ProductCard({
  product,
  index,
  onView,
}: {
  product: Product;
  index: number;
  onView: (product: Product) => void;
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
        <ProductImage
          src={product.image}
          alt={product.name}
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
          <button
            onClick={() => onView(product)}
            className="text-[13px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3.5 h-3.5 arrow-nudge" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Product Modal (detail + checkout) ─── */

function ProductModal({
  product,
  relatedProducts,
  onClose,
}: {
  product: Product;
  relatedProducts: Product[];
  onClose: () => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const hasMultiple = gallery.length > 1;

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setCurrentImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-white rounded-[24px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-[#334155]" />
        </motion.button>

        <div className="grid md:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative aspect-square bg-[#f8fafc] p-6">
            <ProductImage
              src={gallery[currentImage]}
              alt={`${product.name} - image ${currentImage + 1}`}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 text-[#334155]" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 text-[#334155]" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentImage ? "bg-[#2563eb]" : "bg-slate-300"
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8">
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#2563eb] uppercase">
              {product.category}
            </span>
            <h3 className="text-[24px] font-bold text-[#0f172a] mt-1 mb-2">
              {product.name}
            </h3>
            <p className="text-[14px] text-[#64748b] mb-4">
              {product.description}
            </p>

            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-[28px] font-bold text-[#2563eb]">
                ₹{product.price}
              </span>
              <span className="text-[13px] text-[#94a3b8]">
                / {product.sizes[0]}
              </span>
            </div>

            <div className="mb-5">
              <h4 className="text-[13px] font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                Key Benefits
              </h4>
              <ul className="space-y-1.5">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#475569]">
                    <span className="text-green-500 mt-0.5 shrink-0">✔</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-[13px] font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                How to Use
              </h4>
              <ol className="space-y-1">
                {product.directions.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#475569]">
                    <span className="text-[#2563eb] font-bold shrink-0">{i + 1}.</span>
                    {d}
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={async () => {
                if (!product) return;
                try {
                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: product.price,
                      productName: product.name,
                      productId: product.id,
                    }),
                  });

                  if (!res.ok) throw new Error("Failed to create order");

                  const { orderId, keyId, amount, currency } = await res.json();

                  const options = {
                    key: keyId,
                    amount: amount,
                    currency: currency,
                    name: "Swaraj Enterprises",
                    description: product.name,
                    order_id: orderId,
                    image: "/images/logo.png",
                    handler: function (response: {
                      razorpay_payment_id: string;
                      razorpay_order_id: string;
                      razorpay_signature: string;
                    }) {
                      window.location.href = `/order-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
                    },
                    prefill: {
                      name: "",
                      email: "",
                      contact: "",
                    },
                    theme: {
                      color: "#2563eb",
                    },
                  };

                  if (!(window as any).Razorpay) {
                    await new Promise<void>((resolve, reject) => {
                      const script = document.createElement("script");
                      script.src = "https://checkout.razorpay.com/v1/checkout.js";
                      script.async = true;
                      script.onload = () => resolve();
                      script.onerror = () => reject(new Error("Failed to load Razorpay"));
                      document.body.appendChild(script);
                    });
                  }

                  const rzp = new (window as any).Razorpay(options);
                  rzp.open();
                } catch (err) {
                  console.error("Payment initiation failed:", err);
                  alert("Unable to start payment. Please try again.");
                }
              }}
              className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563eb] text-white text-[13px] font-semibold rounded-full hover:bg-[#1d4ed8] transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-100 p-6 md:p-8">
            <h4 className="text-[16px] font-bold text-[#0f172a] mb-4">
              Related Products
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedProducts.map((rp) => (
                <div key={rp.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl card-lift">
                  <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0">
                    <ProductImage src={rp.image} alt={rp.name} className="object-contain p-1" sizes="48px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#0f172a] truncate">{rp.name}</p>
                    <p className="text-[12px] text-[#2563eb] font-semibold">₹{rp.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Main Products View ─── */

export default function ProductsView({
  products,
  allProducts,
  categories,
  categoryFilter,
}: {
  products: Product[];
  allProducts: Product[];
  categories: { id: string; name: string; description?: string; image?: string }[];
  categoryFilter?: string;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  useEffect(() => {
    const handleResize = () => {
      setGridCols(window.innerWidth >= 1280 ? 4 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const relatedProducts: Product[] = selectedProduct
    ? allProducts
        .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    : [];

  return (
    <div>
      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-slate-50">
        <div className="mx-auto max-w-[1260px] px-5 md:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[#64748b] mr-2">
              <span className="text-[13px] font-medium">Categories:</span>
            </div>
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="px-4 py-2 text-[13px] font-medium rounded-full bg-slate-100 text-[#334155]"
              >
                {cat.name}
              </span>
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
                {products.length}
              </span>{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
          </div>

          {products.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-5 md:gap-6`}>
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onView={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[16px] text-[#64748b]">
                No products found in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            relatedProducts={relatedProducts}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
