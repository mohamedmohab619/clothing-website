"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";
import RecentlyViewed from "@/components/RecentlyViewed";
import { Button } from "@/components/ui/button";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import type { Product, ColorOption } from "@/data/products";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColorOption, setSelectedColorOption] = useState<ColorOption | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Track product in recently viewed when loaded
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (isMounted && res.success && res.data) {
          const fetchedProduct: Product = res.data;
          setProduct(fetchedProduct);

          const requestedCoption = searchParams.get("coption")?.toLowerCase();
          const matchedOption = fetchedProduct.colorOptions?.find(
            (opt) => opt.name.toLowerCase() === requestedCoption
          ) || fetchedProduct.colorOptions?.[0];

          setSelectedColorOption(matchedOption);
        } else if (isMounted) {
          setProduct(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        if (isMounted) setProduct(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Sync color when user navigates with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (!product?.colorOptions) return;
      const params = new URLSearchParams(window.location.search);
      const coption = params.get("coption")?.toLowerCase();
      if (coption) {
        const matched = product.colorOptions.find(
          (opt) => opt.name.toLowerCase() === coption
        );
        if (matched) setSelectedColorOption(matched);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [product]);

  function handleColorChange(color: ColorOption) {
    setSelectedColorOption(color);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("coption", color.name);
      window.history.replaceState(null, "", url.toString());
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="aspect-square bg-muted rounded-lg animate-pulse" />
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-24" />
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-8 bg-muted rounded w-1/3" />
                <div className="h-24 bg-muted rounded w-full mt-4" />
                <div className="h-12 bg-muted rounded w-full mt-6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
          <p className="text-2xl font-semibold text-foreground">Product not found</p>
          <p className="text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
          <Button render={<Link href="/products" />}>
            Back to Products
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = selectedColorOption?.images && selectedColorOption.images.length > 0
    ? selectedColorOption.images
    : [product.image];

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
            <YouMayAlsoLike currentProductId={product.slug || product.id} />
          </div>
          <div className="mt-16 sm:mt-24">
            <RecentlyViewed currentProductId={product.slug || product.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
