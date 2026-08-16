import Masonry from "@/components/Masonry";

const items = [
  {
    id: "jeans",
    img: "https://picsum.photos/id/1015/600/800?grayscale",
    url: "#jeans",
    height: 400,
  },
  {
    id: "hoodie",
    img: "https://picsum.photos/id/1011/600/900?grayscale",
    url: "#hoodie",
    height: 600,
  },
  {
    id: "bags",
    img: "https://picsum.photos/id/1020/600/700?grayscale",
    url: "#bags",
    height: 300,
  },
  {
    id: "t-shirts",
    img: "https://picsum.photos/id/1016/600/850?grayscale",
    url: "#t-shirts",
    height: 500,
  },
  {
    id: "sneakers",
    img: "https://picsum.photos/id/103/600/750?grayscale",
    url: "#sneakers",
    height: 350,
  },
  {
    id: "jacket",
    img: "https://picsum.photos/id/1005/600/900?grayscale",
    url: "#jacket",
    height: 550,
  },
];

export default function FeaturedCollections() {
  return (
    <section className="w-full">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-wide text-black uppercase sm:text-4xl">
          Featured collections
        </h2>
        <p className="mt-4 text-xs tracking-[0.2em] text-neutral-500 uppercase sm:text-sm">
          Top new collections with harfa brand explore now
        </p>
      </div>

      <div className="relative min-h-[600px] w-full sm:min-h-[700px]">
        <Masonry
          items={items}
          ease="power1.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
      </div>
    </section>
  );
}
