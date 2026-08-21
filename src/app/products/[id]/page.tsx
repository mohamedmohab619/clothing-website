"use client";

import { useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";
import { products, type ColorOption } from "@/data/products";

export default function ProductPage() {
  // handling path paramenters for "ID"
  const params = useParams();
  const id = params?.id as string;

  // handling query parameters
  const searchParams = useSearchParams();

  const product = products.find((p) => p.id === id);
  const coption = product?.colorOptions?.filter((option) => option.name.toLowerCase() == searchParams.get('coption')?.toLowerCase())[0] || product?.colorOptions?.[0]
  const [selectedColorOption, setSelectedColorOption] = useState<ColorOption | undefined>(coption);

  const router = useRouter();
  const pathname = usePathname();

  function handleColorChange(color: ColorOption) {
    setSelectedColorOption(color);
    const params = new URLSearchParams(searchParams);
    params.set("coption", color.name);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-xl text-muted-foreground">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const images = selectedColorOption?.images || [product.image];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" key={product.id}>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={images} />
            <ProductInfo
              product={product}
              selectedColorOption={selectedColorOption}
              onColorChange={handleColorChange}
            />
          </div>
          <div className="mt-16 sm:mt-24">
            <ProductTabs />
          </div>
          <div className="mt-16 sm:mt-24">
            <YouMayAlsoLike />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
