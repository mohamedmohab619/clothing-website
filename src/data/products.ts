export type ColorOption = {
  name: string;
  value: string;
  images: string[];
};

export type Product = {
  id: string;
  title: string;
  price: string;
  originalPrice: string;
  isFavorite: boolean;
  image: string;
  colorOptions?: ColorOption[];
};

export const products: Product[] = [
  {
    id: "1",
    title: "Loose fit hoodie",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
    image: "/images/product1-green.jpg",
    colorOptions: [
      { name: "Green", value: "#2E8B57", images: ["/images/product1-green.jpg", "/images/product1-green2.jpg", "/images/product1-green3.jpg", "/images/product1-green4.jpg"] },
      { name: "Burgundy", value: "#800020", images: ["/images/product1-burgundy.jpg", "/images/product1-burgundy2.jpg", "/images/product1-burgundy3.jpg", "/images/product1-burgundy4.jpg"] },
      { name: "Grey", value: "#808080", images: ["/images/product1-grey.jpg", "/images/product1-grey2.jpg", "/images/product1-grey3.jpg", "/images/product1-grey4.jpg"] },
      { name: "Ice Blue", value: "#A5F2F3", images: ["/images/product1-iceblue.jpg", "/images/product1-iceblue2.jpg", "/images/product1-iceblue3.jpg", "/images/product1-iceblue4.jpg"] },
      { name: "Yellow", value: "#FFD700", images: ["/images/product1-yellow.jpg", "/images/product1-yellow2.jpg", "/images/product1-yellow3.jpg", "/images/product1-yellow4.jpg"] },
    ],
  },
  {
    id: "2",
    title: "Patterned scarf",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: true,
    image: "/images/product2-yellow.jpg",
    colorOptions: [
      { name: "Yellow", value: "#FFD700", images: ["/images/product2-yellow.jpg", "/images/product2-yellow2.jpg", "/images/product2-yellow3.jpg", "/images/product2-yellow4.jpg"] },
      { name: "Blue", value: "#4169E1", images: ["/images/product2-blue.jpg", "/images/product2-blue2.jpg", "/images/product2-blue3.jpg", "/images/product2-blue4.jpg"] },
      { name: "Black", value: "#000000", images: ["/images/product2-black.jpg", "/images/product2-black2.jpg", "/images/product2-black3.jpg", "/images/product2-black4.jpg"] },
    ],
  },
  {
    id: "3",
    title: "Relaxed fit cor jacket",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
    image: "/images/product3-blue.jpg",
    colorOptions: [
      { name: "Blue", value: "#4169E1", images: ["/images/product3-blue.jpg", "/images/product3-blue2.jpg", "/images/product3-blue3.jpg", "/images/product3-blue4.jpg"] }
    ],
  },
  {
    id: "4",
    title: "Rib-knit hat",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
    image: "/images/dark navy1.jpg",
    colorOptions: [
      { name: "Dark Navy", value: "#000040", images: ["/images/dark navy1.jpg", "/images/dark navy2.jpg", "/images/dark navy3.jpg", "/images/dark navy4.jpg", "/images/dark navy5.jpg"] },
      { name: "Ice Blue", value: "#A5F2F3", images: ["/images/ice blue2.jpg", "/images/ice blue5.jpg", "/images/ice blue4.jpg", "/images/ice blue1.jpg"] },
    ],
  },
  {
    id: "5",
    title: "baby blue shirt",
    price: "$39.99",
    originalPrice: "$79.99",
    isFavorite: false,
    image: "/images/women-shirt1.jpg",
    colorOptions: [
      { name: "Baby Blue", value: "#A5F2F3", images: ["/images/women-blue-shirt1.jpg", "/images/women-blue-shirt2.jpg", "/images/women-blue-shirt3.jpg", "/images/women-blue-shirt4.jpg"] },
    ],
  },
];
