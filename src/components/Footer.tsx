import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: ["T-shirt", "Hoodie", "Jacket", "Jeans", "Bags", "Sneakers"],
  },
  {
    title: "Categories",
    links: ["Men", "Women", "Kids", "Gift", "Collection", "New arrivals"],
  },
  {
    title: "Help",
    links: [
      "Customer service",
      "Site map",
      "Find a store",
      "Legal & privacy",
      "Contact",
      "Cookie notice",
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-xl font-bold tracking-[0.2em] text-black uppercase">
            Milan
          </p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed tracking-wide text-neutral-500 uppercase">
            Get newsletters for upcoming products and best offers and discount
            for all items
          </p>
          <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="Email address"
              className="min-w-0 flex-1 border border-neutral-300 px-4 py-2.5 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black"
            />
            <button
              type="submit"
              className="bg-black px-6 py-2.5 text-xs font-medium tracking-wide text-white uppercase transition-opacity hover:opacity-90"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold tracking-wide text-black uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs tracking-wide text-neutral-500 uppercase transition-colors hover:text-black"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-950 px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] tracking-wide text-white uppercase">
          © 2026 Milan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
