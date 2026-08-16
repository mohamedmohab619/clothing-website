import { Caveat } from "next/font/google";
import Link from "next/link";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export default function PromoSplitBanner() {
  return (
    <section className="grid w-full grid-cols-1 overflow-hidden md:grid-cols-2">
      <div className="relative aspect-[4/3] bg-gray-200 md:aspect-auto md:min-h-[420px]">
        <p
          className={`${caveat.className} absolute top-6 left-6 max-w-[12rem] text-3xl leading-tight text-red-600 sm:text-4xl`}
        >
          Just for collections
        </p>
      </div>

      <div className="flex flex-col justify-center bg-white px-8 py-12 sm:px-12 lg:px-16">
        <h2 className="max-w-md text-lg font-bold tracking-wide text-black uppercase sm:text-xl">
          Find your perfect look at harfa sty new on paris
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation.
        </p>

        <div className="mt-8">
          <p className="text-sm font-bold tracking-wide text-black uppercase">
            Sales and discount!
          </p>
          <p className="text-6xl font-bold tracking-tight text-black sm:text-7xl lg:text-8xl">
            87%
          </p>
        </div>

        <Link
          href="#store"
          className="mt-8 inline-flex w-fit bg-black px-5 py-2.5 text-xs font-medium tracking-wide text-white uppercase transition-opacity hover:opacity-90"
        >
          Find the store
        </Link>
      </div>
    </section>
  );
}
