"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function ProductFilters({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.get(name)?.split(",") || [];
      const index = currentValues.indexOf(value);

      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(value);
      }

      if (currentValues.length === 0) {
        params.delete(name);
      } else {
        params.set(name, currentValues.join(","));
      }

      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const setSingleQuery = (name: string, value: string | null) => {
    router.push(pathname + "?" + createQueryString(name, value), { scroll: false });
  };

  const categories = ["Jackets & Coats", "Shirts", "T-shirts", "Jeans", "Shorts"];
  const colors = [
    { name: "Black", code: "#000000" },
    { name: "Gray", code: "#808080" },
    { name: "Red", code: "#FF0000" },
    { name: "Teal", code: "#008080" },
    { name: "Brown", code: "#A52A2A" },
    { name: "Purple", code: "#800080" },
    { name: "Green", code: "#008000" },
    { name: "Yellow", code: "#FFFF00" },
    { name: "Blue", code: "#0000FF" },
    { name: "Cream", code: "#FFFDD0" },
  ];
  const sizes = ["4XL", "M", "3XL", "S", "XXL", "XS", "XL", "XXS", "L", "All Size"];

  const activeCategory = searchParams.get("category");
  const activeSizes = searchParams.get("size")?.split(",") || [];
  const activeColors = searchParams.get("color")?.split(",") || [];
  
  const minPrice = searchParams.get("minPrice") || "100";
  const maxPrice = searchParams.get("maxPrice") || "500";
  
  const [priceRange, setPriceRange] = useState([parseInt(minPrice), parseInt(maxPrice)]);

  useEffect(() => {
    setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
  }, [minPrice, maxPrice]);

  const handlePriceChange = (value: number | readonly number[]) => {
    if (Array.isArray(value) || (typeof value !== 'number' && 'length' in value)) {
       setPriceRange(value as number[]);
    } else {
       setPriceRange([value as number, priceRange[1]]);
    }
  };
  
  const applyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-xl font-bold mb-6 text-foreground">Filter Products</h2>
      
      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2 bg-muted/50 p-2 rounded-md text-foreground">Category</h3>
        <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm">Men Fashion</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2 ml-1">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cat-${cat}`} 
                        checked={activeCategory === cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}
                        onCheckedChange={(checked) => {
                          const val = cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                          setSingleQuery("category", checked ? val : null);
                        }}
                      />
                      <label
                        htmlFor={`cat-${cat}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
                      >
                        {cat}
                      </label>
                    </div>
                    <span className="text-xs text-muted-foreground">127</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm text-muted-foreground">Woman Fashion</AccordionTrigger>
            <AccordionContent>
              <div className="text-xs text-muted-foreground ml-1 pt-1">Coming soon</div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm text-muted-foreground">Shoes & Bag</AccordionTrigger>
            <AccordionContent>
              <div className="text-xs text-muted-foreground ml-1 pt-1">Coming soon</div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2 text-sm text-muted-foreground">Accessories</AccordionTrigger>
            <AccordionContent>
              <div className="text-xs text-muted-foreground ml-1 pt-1">Coming soon</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="h-px bg-border my-6" />

      {/* Price */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 bg-muted/50 p-2 rounded-md text-foreground">Price</h3>
        <Slider
          defaultValue={[100, 500]}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
          onValueCommitted={applyPrice}
          className="my-6"
        />
        <div className="flex items-center gap-4">
          <div className="space-y-1 w-full">
            <label className="text-xs text-muted-foreground">From</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input 
                type="number" 
                value={priceRange[0]} 
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setPriceRange([val, priceRange[1]]);
                }}
                onBlur={applyPrice}
                onKeyDown={(e) => { if (e.key === 'Enter') applyPrice() }}
                className="pl-6 h-8 text-sm" 
              />
            </div>
          </div>
          <div className="space-y-1 w-full">
            <label className="text-xs text-muted-foreground">To</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input 
                type="number" 
                value={priceRange[1]} 
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setPriceRange([priceRange[0], val]);
                }}
                onBlur={applyPrice}
                onKeyDown={(e) => { if (e.key === 'Enter') applyPrice() }}
                className="pl-6 h-8 text-sm" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border my-6" />

      {/* Color */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 bg-muted/50 p-2 rounded-md text-foreground">Color</h3>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((c) => {
            const isActive = activeColors.includes(c.name.toLowerCase());
            return (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  className={`size-6 rounded-full border shadow-sm transition-transform ${isActive ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'border-border hover:scale-110'}`}
                  style={{ backgroundColor: c.code }}
                  onClick={() => toggleQueryString("color", c.name.toLowerCase())}
                  aria-label={c.name}
                  title={c.name}
                />
                <span className="text-[10px] text-muted-foreground">{c.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-border my-6" />

      {/* Size */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 bg-muted/50 p-2 rounded-md text-foreground">Size</h3>
        <div className="grid grid-cols-2 gap-y-3">
          {sizes.map((s) => (
            <div key={s} className="flex items-center space-x-2 group">
              <Checkbox 
                id={`size-${s}`} 
                checked={activeSizes.includes(s)}
                onCheckedChange={() => toggleQueryString("size", s)}
              />
              <label
                htmlFor={`size-${s}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
              >
                {s}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-px bg-border my-6" />
      
      <div className="mb-8">
        <h3 className="font-semibold mb-4 bg-muted/50 p-2 rounded-md text-foreground">Brands</h3>
      </div>
    </div>
  );
}
