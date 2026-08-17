"use client";

import Image from "next/image";
import { CircleDot, Layers, Maximize2, Shirt, Users } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const details = [
  { icon: Maximize2, label: "Oversized fit" },
  { icon: Layers, label: "Soft & heavyweight fabric" },
  { icon: CircleDot, label: "Adjustable drawstring hood" },
  { icon: Shirt, label: "Ribbed cuffs and hem" },
  { icon: Users, label: "Unisex style" },
] as const;

export default function ProductTabs() {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Tabs defaultValue="details" className="w-full gap-6">
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap justify-start gap-0 rounded-none border-b border-border p-0"
        >
          <TabsTrigger value="details" className="rounded-none px-4 py-3">
            Details
          </TabsTrigger>
          <TabsTrigger value="materials" className="rounded-none px-4 py-3">
            Materials
          </TabsTrigger>
          <TabsTrigger value="size-fit" className="rounded-none px-4 py-3">
            Size & Fit
          </TabsTrigger>
          <TabsTrigger value="shipping" className="rounded-none px-4 py-3">
            Shipping & Returns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-5">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Designed for everyday wear, this essential oversized hoodie pairs a
            relaxed silhouette with premium heavyweight cotton. Layer it over
            tees or wear it on its own for an effortless street look.
          </p>
          <ul className="flex flex-col gap-3">
            {details.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <item.icon className="size-4 text-muted-foreground" />
                {item.label}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="materials" className="space-y-3">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            80% organic cotton, 20% recycled polyester. Brushed interior for
            softness with a durable, structured outer face.
          </p>
          <p className="text-sm text-muted-foreground">
            Machine wash cold. Tumble dry low. Do not bleach.
          </p>
        </TabsContent>

        <TabsContent value="size-fit" className="space-y-3">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Oversized unisex fit. Model is 6&apos;1&quot; and wears size M. For a
            closer fit, we recommend sizing down.
          </p>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-3">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Free shipping on orders over $99. Standard delivery 3–7 business
            days. Easy 30-day returns on unworn items with original tags.
          </p>
        </TabsContent>
      </Tabs>

      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted lg:aspect-[5/4]">
        <Image
          src="/images/hoodie2.jpg"
          alt="Essentials collection fabric close-up"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
