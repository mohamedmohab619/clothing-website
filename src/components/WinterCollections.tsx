import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: "1",
    title: "Loose fit hoodie",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
    image: "/images/product1.jpg",
  },
  {
    id: "2",
    title: "Patterned scarf",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: true,
    image: "/images/product2.jpg",
  },
  {
    id: "3",
    title: "Relaxed fit cor jacket",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
    image: "/images/product3.jpg",
  },
  {
    id: "4",
    title: "Rib-knit hat",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
    image: "/images/product4.jpg",
  },
] as const;

export default function WinterCollections() {
  return (
    <section
      id="collections"
      className="bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-foreground uppercase sm:text-4xl">
            Winter collections
          </h2>
          <p className="mt-4 text-xs tracking-[0.25em] text-muted-foreground uppercase sm:text-sm">
            Let us love winter for it is the spring of genius
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
