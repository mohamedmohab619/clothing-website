import Link from "next/link";

const demographics = [
  { id: "men", label: "Men", href: "#men" },
  { id: "women", label: "Women", href: "#women" },
  { id: "kids", label: "Kids", href: "#kids" },
] as const;

export default function DemographicsGrid() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {demographics.map((item) => (
          <article
            key={item.id}
            className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden bg-neutral-800 p-6 sm:p-8"
          >
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold tracking-wide text-white uppercase sm:text-4xl">
                {item.label}
              </h3>
              <Link
                href={item.href}
                className="mt-4 inline-flex bg-white px-5 py-2.5 text-xs font-medium tracking-wide text-black uppercase transition-opacity hover:opacity-90"
              >
                Shop now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
