import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-neutral-400">
      <div
        className="absolute inset-0 bg-neutral-500"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-black/25"
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-3xl font-bold tracking-wide text-white uppercase sm:text-4xl md:text-5xl md:leading-tight lg:text-6xl">
          In the right outfit anything is possible
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="#collections"
            className="rounded-full bg-white px-8 py-3 text-sm font-medium tracking-wide text-black uppercase transition-scale duration-300 hover:scale-105 hover:opacity-85"
          >
            Collections
          </Link>
          <Link
            href="#shop"
            className="rounded-full bg-black px-8 py-3 text-sm font-medium tracking-wide text-white uppercase transition-scale duration-300 hover:scale-105 hover:opacity-85"
          >
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}
