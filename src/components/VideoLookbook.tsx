"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function VideoLookbook() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative min-h-[400px] w-full overflow-hidden rounded-lg bg-muted sm:min-h-[480px]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/winter.mp4"
        playsInline
        loop
        muted
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <div className="absolute top-6 left-6 z-10 max-w-xs sm:top-8 sm:left-8">
        <h2 className="text-lg font-bold tracking-wide text-primary-foreground uppercase sm:text-xl">
          Wear to winter
        </h2>
        <p className="mt-1 text-xs tracking-wide text-primary-foreground/80 uppercase sm:text-sm">
          Let us love winter for it is the spring
        </p>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="icon-lg"
        aria-label={isPlaying ? "Pause lookbook video" : "Play lookbook video"}
        onClick={togglePlayback}
        className="absolute top-1/2 left-1/2 z-10 size-16 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background shadow-md sm:size-20"
      >
        {isPlaying ? (
          <Pause
            className="size-6 fill-foreground text-foreground sm:size-7"
            strokeWidth={0}
          />
        ) : (
          <Play
            className="size-6 fill-foreground text-foreground sm:size-7"
            strokeWidth={0}
          />
        )}
      </Button>

      <Link
        href="#shop"
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "absolute right-6 bottom-6 z-10 rounded-lg uppercase tracking-wide sm:right-8 sm:bottom-8"
        )}
      >
        Shop now
      </Link>
    </section>
  );
}
