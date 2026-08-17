import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ProductCard from "@/components/ProductCard";

const relatedProducts = [
  {
    id: "minimal-hoodie",
    title: "Minimal Hoodie",
    price: "$54.99",
    originalPrice: "$74.99",
    isFavorite: false,
    image: "/images/hoodie2.jpg",
  },
  {
    id: "classic-sweatshirt",
    title: "Classic Sweatshirt",
    price: "$49.99",
    originalPrice: "$69.99",
    isFavorite: false,
    image: "/images/product1.jpg",
  },
  {
    id: "zip-up-hoodie",
    title: "Zip Up Hoodie",
    price: "$64.99",
    originalPrice: "$89.99",
    isFavorite: true,
    image: "/images/jacket.jpg",
  },
  {
    id: "essential-hoodie",
    title: "Essential Hoodie",
    price: "$59.99",
    originalPrice: "$89.99",
    isFavorite: false,
    image: "/images/hoodie.jpg",
  },
] as const;

export default function YouMayAlsoLike() {
  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          You May Also Like
        </h2>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
        >
          View All
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
