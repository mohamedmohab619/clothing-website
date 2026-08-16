import { Play } from "lucide-react";
import Link from "next/link";

export default function VideoLookbook() {
  return (
    <section className="relative min-h-[400px] w-full overflow-hidden bg-gray-300 sm:min-h-[480px]">
      <div className="absolute top-6 left-6 z-10 max-w-xs sm:top-8 sm:left-8">
        <h2 className="text-lg font-bold tracking-wide text-black uppercase sm:text-xl">
          Wear to winter
        </h2>
        <p className="mt-1 text-xs tracking-wide text-neutral-700 uppercase sm:text-sm">
          Let us love winter for it is the spring
        </p>
      </div>

      <button
        type="button"
        aria-label="Play lookbook video"
        className="absolute top-1/2 left-1/2 z-10 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-105 sm:size-20"
      >
        <Play className="size-6 fill-black text-black sm:size-7" strokeWidth={0} />
      </button>

      <Link
        href="#shop"
        className="absolute right-6 bottom-6 z-10 bg-black px-5 py-2.5 text-xs font-medium tracking-wide text-white uppercase transition-opacity hover:opacity-90 sm:right-8 sm:bottom-8"
      >
        Shop now
      </Link>
    </section>
  );
}
