import { NewProduct, NewProductImage, NewVariant } from "@/db/types";

// ============================================================================
// 1. PRODUCTS DATA
// ============================================================================
export const productsData: NewProduct[] = [
  {
    name: "Loose Fit Hoodie",
    slug: "loose-fit-hoodie",
    status: "active",
  },
  {
    name: "Patterned Scarf",
    slug: "patterned-scarf",
    status: "active",
  },
  {
    name: "Relaxed Fit Cor Jacket",
    slug: "relaxed-fit-cor-jacket",
    status: "active",
  },
  {
    name: "Rib-Knit Hat",
    slug: "rib-knit-hat",
    status: "active",
  },
  {
    name: "Baby Blue Shirt",
    slug: "baby-blue-shirt",
    status: "active",
  },
];

// ============================================================================
// 2. VARIANTS DATA (SKUs generated for sizes S through 2XL)
// ============================================================================
export const variantsData: NewVariant[] = [
  // --------------------------------------------------------------------------
  // PRODUCT 1: Loose Fit Hoodie
  // --------------------------------------------------------------------------
  // Green (#2E8B57)
  { productId: 1, sku: "HD-GRN-S", price: 3999, comparePrice: 7999, stockQuantity: 1, colorName: "Green", colorValue: "#2E8B57", size: "S", weightGrams: 850 },
  { productId: 1, sku: "HD-GRN-M", price: 3999, comparePrice: 7999, stockQuantity: 10, colorName: "Green", colorValue: "#2E8B57", size: "M", weightGrams: 900 },
  { productId: 1, sku: "HD-GRN-L", price: 3999, comparePrice: 7999, stockQuantity: 15, colorName: "Green", colorValue: "#2E8B57", size: "L", weightGrams: 950 },
  { productId: 1, sku: "HD-GRN-XL", price: 3999, comparePrice: 7999, stockQuantity: 8, colorName: "Green", colorValue: "#2E8B57", size: "XL", weightGrams: 1000 },
  { productId: 1, sku: "HD-GRN-2XL", price: 3999, comparePrice: 7999, stockQuantity: 5, colorName: "Green", colorValue: "#2E8B57", size: "2XL", weightGrams: 1050 },

  // Burgundy (#800020)
  { productId: 1, sku: "HD-BRG-S", price: 3999, comparePrice: 7999, stockQuantity: 1, colorName: "Burgundy", colorValue: "#800020", size: "S", weightGrams: 850 },
  { productId: 1, sku: "HD-BRG-M", price: 3999, comparePrice: 7999, stockQuantity: 12, colorName: "Burgundy", colorValue: "#800020", size: "M", weightGrams: 900 },
  { productId: 1, sku: "HD-BRG-L", price: 3999, comparePrice: 7999, stockQuantity: 18, colorName: "Burgundy", colorValue: "#800020", size: "L", weightGrams: 950 },
  { productId: 1, sku: "HD-BRG-XL", price: 3999, comparePrice: 7999, stockQuantity: 7, colorName: "Burgundy", colorValue: "#800020", size: "XL", weightGrams: 1000 },
  { productId: 1, sku: "HD-BRG-2XL", price: 3999, comparePrice: 7999, stockQuantity: 4, colorName: "Burgundy", colorValue: "#800020", size: "2XL", weightGrams: 1050 },

  // Grey (#808080)
  { productId: 1, sku: "HD-GRY-S", price: 3999, comparePrice: 7999, stockQuantity: 1, colorName: "Grey", colorValue: "#808080", size: "S", weightGrams: 850 },
  { productId: 1, sku: "HD-GRY-M", price: 3999, comparePrice: 7999, stockQuantity: 20, colorName: "Grey", colorValue: "#808080", size: "M", weightGrams: 900 },
  { productId: 1, sku: "HD-GRY-L", price: 3999, comparePrice: 7999, stockQuantity: 25, colorName: "Grey", colorValue: "#808080", size: "L", weightGrams: 950 },
  { productId: 1, sku: "HD-GRY-XL", price: 3999, comparePrice: 7999, stockQuantity: 14, colorName: "Grey", colorValue: "#808080", size: "XL", weightGrams: 1000 },
  { productId: 1, sku: "HD-GRY-2XL", price: 3999, comparePrice: 7999, stockQuantity: 6, colorName: "Grey", colorValue: "#808080", size: "2XL", weightGrams: 1050 },

  // Ice Blue (#A5F2F3)
  { productId: 1, sku: "HD-BLU-S", price: 3999, comparePrice: 7999, stockQuantity: 1, colorName: "Ice Blue", colorValue: "#A5F2F3", size: "S", weightGrams: 850 },
  { productId: 1, sku: "HD-BLU-M", price: 3999, comparePrice: 7999, stockQuantity: 8, colorName: "Ice Blue", colorValue: "#A5F2F3", size: "M", weightGrams: 900 },
  { productId: 1, sku: "HD-BLU-L", price: 3999, comparePrice: 7999, stockQuantity: 11, colorName: "Ice Blue", colorValue: "#A5F2F3", size: "L", weightGrams: 950 },
  { productId: 1, sku: "HD-BLU-XL", price: 3999, comparePrice: 7999, stockQuantity: 3, colorName: "Ice Blue", colorValue: "#A5F2F3", size: "XL", weightGrams: 1000 },
  { productId: 1, sku: "HD-BLU-2XL", price: 3999, comparePrice: 7999, stockQuantity: 2, colorName: "Ice Blue", colorValue: "#A5F2F3", size: "2XL", weightGrams: 1050 },

  // Yellow (#FFD700)
  { productId: 1, sku: "HD-YEL-S", price: 3999, comparePrice: 7999, stockQuantity: 1, colorName: "Yellow", colorValue: "#FFD700", size: "S", weightGrams: 850 },
  { productId: 1, sku: "HD-YEL-M", price: 3999, comparePrice: 7999, stockQuantity: 5, colorName: "Yellow", colorValue: "#FFD700", size: "M", weightGrams: 900 },
  { productId: 1, sku: "HD-YEL-L", price: 3999, comparePrice: 7999, stockQuantity: 7, colorName: "Yellow", colorValue: "#FFD700", size: "L", weightGrams: 950 },
  { productId: 1, sku: "HD-YEL-XL", price: 3999, comparePrice: 7999, stockQuantity: 4, colorName: "Yellow", colorValue: "#FFD700", size: "XL", weightGrams: 1000 },
  { productId: 1, sku: "HD-YEL-2XL", price: 3999, comparePrice: 7999, stockQuantity: 2, colorName: "Yellow", colorValue: "#FFD700", size: "2XL", weightGrams: 1050 },

  // --------------------------------------------------------------------------
  // PRODUCT 2: Patterned Scarf
  // --------------------------------------------------------------------------
  // Yellow (#FFD700)
  { productId: 2, sku: "SCF-YEL-O", price: 3999, comparePrice: 7999, stockQuantity: 12, colorName: "Yellow", colorValue: "#FFD700", size: "One Size", weightGrams: 200 },
  // Blue (#4169E1)
  { productId: 2, sku: "SCF-BLU-O", price: 3999, comparePrice: 7999, stockQuantity: 18, colorName: "Blue", colorValue: "#4169E1", size: "One Size", weightGrams: 200 },
  // Black (#000000)
  { productId: 2, sku: "SCF-BLK-O", price: 3999, comparePrice: 7999, stockQuantity: 9, colorName: "Black", colorValue: "#000000", size: "One Size", weightGrams: 200 },

  // --------------------------------------------------------------------------
  // PRODUCT 3: Relaxed Fit Cor Jacket
  // --------------------------------------------------------------------------
  // Blue (#4169E1)
  { productId: 3, sku: "JKT-BLU-S", price: 3999, comparePrice: 7999, stockQuantity: 4, colorName: "Blue", colorValue: "#4169E1", size: "S", weightGrams: 1100 },
  { productId: 3, sku: "JKT-BLU-M", price: 3999, comparePrice: 7999, stockQuantity: 10, colorName: "Blue", colorValue: "#4169E1", size: "M", weightGrams: 1150 },
  { productId: 3, sku: "JKT-BLU-L", price: 3999, comparePrice: 7999, stockQuantity: 14, colorName: "Blue", colorValue: "#4169E1", size: "L", weightGrams: 1200 },
  { productId: 3, sku: "JKT-BLU-XL", price: 3999, comparePrice: 7999, stockQuantity: 6, colorName: "Blue", colorValue: "#4169E1", size: "XL", weightGrams: 1250 },
  { productId: 3, sku: "JKT-BLU-2XL", price: 3999, comparePrice: 7999, stockQuantity: 3, colorName: "Blue", colorValue: "#4169E1", size: "2XL", weightGrams: 1300 },

  // --------------------------------------------------------------------------
  // PRODUCT 4: Rib-Knit Hat
  // --------------------------------------------------------------------------
  // Dark Navy (#000040)
  { productId: 4, sku: "HAT-NVY-O", price: 3999, comparePrice: 7999, stockQuantity: 25, colorName: "Dark Navy", colorValue: "#000040", size: "One Size", weightGrams: 120 },
  // Ice Blue (#A5F2F3)
  { productId: 4, sku: "HAT-BLU-O", price: 3999, comparePrice: 7999, stockQuantity: 15, colorName: "Ice Blue", colorValue: "#A5F2F3", size: "One Size", weightGrams: 120 },

  // --------------------------------------------------------------------------
  // PRODUCT 5: Baby Blue Shirt
  // --------------------------------------------------------------------------
  // Baby Blue (#A5F2F3)
  { productId: 5, sku: "SHT-BLU-S", price: 3999, comparePrice: 7999, stockQuantity: 5, colorName: "Baby Blue", colorValue: "#A5F2F3", size: "S", weightGrams: 300 },
  { productId: 5, sku: "SHT-BLU-M", price: 3999, comparePrice: 7999, stockQuantity: 12, colorName: "Baby Blue", colorValue: "#A5F2F3", size: "M", weightGrams: 320 },
  { productId: 5, sku: "SHT-BLU-L", price: 3999, comparePrice: 7999, stockQuantity: 16, colorName: "Baby Blue", colorValue: "#A5F2F3", size: "L", weightGrams: 340 },
  { productId: 5, sku: "SHT-BLU-XL", price: 3999, comparePrice: 7999, stockQuantity: 8, colorName: "Baby Blue", colorValue: "#A5F2F3", size: "XL", weightGrams: 360 },
  { productId: 5, sku: "SHT-BLU-2XL", price: 3999, comparePrice: 7999, stockQuantity: 3, colorName: "Baby Blue", colorValue: "#A5F2F3", size: "2XL", weightGrams: 380 },
];

// ============================================================================
// 3. PRODUCT IMAGES DATA
// ============================================================================
export const productImagesData: NewProductImage[] = [
  // PRODUCT 1 IMAGES
  { productId: 1, colorName: "Green", imageUrl: "/images/product1-green.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 1, colorName: "Green", imageUrl: "/images/product1-green2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 1, colorName: "Green", imageUrl: "/images/product1-green3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 1, colorName: "Green", imageUrl: "/images/product1-green4.jpg", isPrimary: false, sortOrder: 3 },

  { productId: 1, colorName: "Burgundy", imageUrl: "/images/product1-burgundy.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 1, colorName: "Burgundy", imageUrl: "/images/product1-burgundy2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 1, colorName: "Burgundy", imageUrl: "/images/product1-burgundy3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 1, colorName: "Burgundy", imageUrl: "/images/product1-burgundy4.jpg", isPrimary: false, sortOrder: 3 },

  { productId: 1, colorName: "Grey", imageUrl: "/images/product1-grey.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 1, colorName: "Grey", imageUrl: "/images/product1-grey2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 1, colorName: "Grey", imageUrl: "/images/product1-grey3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 1, colorName: "Grey", imageUrl: "/images/product1-grey4.jpg", isPrimary: false, sortOrder: 3 },

  { productId: 1, colorName: "Ice Blue", imageUrl: "/images/product1-iceblue.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 1, colorName: "Ice Blue", imageUrl: "/images/product1-iceblue2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 1, colorName: "Ice Blue", imageUrl: "/images/product1-iceblue3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 1, colorName: "Ice Blue", imageUrl: "/images/product1-iceblue4.jpg", isPrimary: false, sortOrder: 3 },

  { productId: 1, colorName: "Yellow", imageUrl: "/images/product1-yellow.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 1, colorName: "Yellow", imageUrl: "/images/product1-yellow2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 1, colorName: "Yellow", imageUrl: "/images/product1-yellow3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 1, colorName: "Yellow", imageUrl: "/images/product1-yellow4.jpg", isPrimary: false, sortOrder: 3 },

  // PRODUCT 2 IMAGES
  { productId: 2, colorName: "Yellow", imageUrl: "/images/product2-yellow.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 2, colorName: "Yellow", imageUrl: "/images/product2-yellow2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 2, colorName: "Yellow", imageUrl: "/images/product2-yellow3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 2, colorName: "Yellow", imageUrl: "/images/product2-yellow4.jpg", isPrimary: false, sortOrder: 3 },

  { productId: 2, colorName: "Blue", imageUrl: "/images/product2-blue.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 2, colorName: "Blue", imageUrl: "/images/product2-blue2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 2, colorName: "Blue", imageUrl: "/images/product2-blue3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 2, colorName: "Blue", imageUrl: "/images/product2-blue4.jpg", isPrimary: false, sortOrder: 3 },

  { productId: 2, colorName: "Black", imageUrl: "/images/product2-black.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 2, colorName: "Black", imageUrl: "/images/product2-black2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 2, colorName: "Black", imageUrl: "/images/product2-black3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 2, colorName: "Black", imageUrl: "/images/product2-black4.jpg", isPrimary: false, sortOrder: 3 },

  // PRODUCT 3 IMAGES
  { productId: 3, colorName: "Blue", imageUrl: "/images/product3-blue.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 3, colorName: "Blue", imageUrl: "/images/product3-blue2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 3, colorName: "Blue", imageUrl: "/images/product3-blue3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 3, colorName: "Blue", imageUrl: "/images/product3-blue4.jpg", isPrimary: false, sortOrder: 3 },

  // PRODUCT 4 IMAGES
  { productId: 4, colorName: "Dark Navy", imageUrl: "/images/dark navy1.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 4, colorName: "Dark Navy", imageUrl: "/images/dark navy2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 4, colorName: "Dark Navy", imageUrl: "/images/dark navy3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 4, colorName: "Dark Navy", imageUrl: "/images/dark navy4.jpg", isPrimary: false, sortOrder: 3 },
  { productId: 4, colorName: "Dark Navy", imageUrl: "/images/dark navy5.jpg", isPrimary: false, sortOrder: 4 },

  { productId: 4, colorName: "Ice Blue", imageUrl: "/images/ice blue1.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 4, colorName: "Ice Blue", imageUrl: "/images/ice blue2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 4, colorName: "Ice Blue", imageUrl: "/images/ice blue4.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 4, colorName: "Ice Blue", imageUrl: "/images/ice blue5.jpg", isPrimary: false, sortOrder: 3 },

  // PRODUCT 5 IMAGES
  { productId: 5, colorName: "Baby Blue", imageUrl: "/images/women-blue-shirt1.jpg", isPrimary: true, sortOrder: 0 },
  { productId: 5, colorName: "Baby Blue", imageUrl: "/images/women-blue-shirt2.jpg", isPrimary: false, sortOrder: 1 },
  { productId: 5, colorName: "Baby Blue", imageUrl: "/images/women-blue-shirt3.jpg", isPrimary: false, sortOrder: 2 },
  { productId: 5, colorName: "Baby Blue", imageUrl: "/images/women-blue-shirt4.jpg", isPrimary: false, sortOrder: 3 },
];
