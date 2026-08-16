import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: "1",
    title: "Loose fit hoodie",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Patterned scarf",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Relaxed fit cor jacket",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
  },
  {
    id: "4",
    title: "Rib-knit hat",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
  },
] as const;

export default function WinterCollections() {
  return (
    <section id="collections" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-wide text-black uppercase sm:text-4xl">
            Winter collections
          </h2>
          <p className="mt-4 text-xs tracking-[0.25em] text-neutral-500 uppercase sm:text-sm">
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
