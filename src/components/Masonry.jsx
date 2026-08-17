"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Simplified animated grid wrapper.
 * Prefer defining explicit bento spans in the parent (e.g. FeaturedCollections).
 */
const Masonry = ({
  items = [],
  children,
  className = "grid grid-cols-2 md:grid-cols-4 gap-4",
  duration = 0.6,
  stagger = 0.05,
  ease = "power1.out",
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll("[data-masonry-item]");
    if (!targets.length) return;

    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        clearProps: "transform",
      }
    );

    return () => {
      tween.kill();
    };
  }, [duration, ease, stagger, items]);

  return (
    <div ref={containerRef} className={className}>
      {children ??
        items.map((item) => (
          <div
            key={item.id}
            data-masonry-item
            className="relative overflow-hidden rounded-lg bg-muted"
            style={{
              backgroundImage: item.img ? `url(${item.img})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: 180,
            }}
          />
        ))}
    </div>
  );
};

export default Masonry;
