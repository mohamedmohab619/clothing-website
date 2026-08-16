import { Heart } from "lucide-react";

type ProductCardProps = {
  id: string;
  title: string;
  price: string;
  originalPrice: string;
  isFavorite: boolean;
};

export default function ProductCard({
  title,
  price,
  originalPrice,
  isFavorite,
}: ProductCardProps) {
  return (
    <article className="flex flex-col gap-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white shadow-sm transition-opacity hover:opacity-80"
        >
          <Heart
            className="size-4 text-black"
            strokeWidth={1.5}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold tracking-wide text-black uppercase">
            {title}
          </h3>
          <p className="shrink-0 text-sm font-medium text-black">{price}</p>
        </div>
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] tracking-wide text-neutral-400 uppercase">
            MRP inclusive of all taxes
          </p>
          <p className="shrink-0 text-sm text-neutral-400 line-through">
            {originalPrice}
          </p>
        </div>
      </div>
    </article>
  );
}
