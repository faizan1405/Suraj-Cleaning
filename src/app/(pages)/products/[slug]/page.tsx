import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/data/products";
import { getCompany } from "@/data/company";
import ProductDetailView from "@/components/products/ProductDetailView";

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products
      .filter((p) => p.active)
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found - Swaraj Enterprises" };
  }

  return {
    title: `${product.name} - ${product.category} | Swaraj Enterprises`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} - Swaraj Enterprises`,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const allProducts = await getProducts();
  const company = await getCompany();

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter(
      (p) => p.category === product.category && p.id !== product.id && p.active
    )
    .slice(0, 3);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      whatsappNumber={company.phoneRaw}
    />
  );
}