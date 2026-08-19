"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";
import { products, type ColorOption } from "@/data/products";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const product = products.find((p) => p.id === id);
  const [selectedColorOption, setSelectedColorOption] = useState<ColorOption | undefined>(product?.colorOptions?.[0]);

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
              onColorChange={setSelectedColorOption}
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
