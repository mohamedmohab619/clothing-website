"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const fits = ["Snug", "True to size", "Relaxed"] as const;
const chartSizes = ["S", "M", "L", "XL", "XXL"] as const;

const sizeChart = [
  { label: "Chest (cm)", values: ["108", "114", "120", "126", "132"] },
  { label: "Length (cm)", values: ["68", "70", "72", "74", "76"] },
  { label: "Sleeve (cm)", values: ["60", "62", "64", "66", "68"] },
] as const;

type Fit = (typeof fits)[number];
type Size = (typeof chartSizes)[number];

function recommendSize(heightCm: number, weightKg: number, fit: Fit): Size {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const score = heightCm * 0.35 + weightKg * 1.1 + bmi * 2;

  let size: Size = "M";
  if (score < 145) size = "S";
  else if (score < 165) size = "M";
  else if (score < 185) size = "L";
  else if (score < 205) size = "XL";
  else size = "XXL";

  const index = chartSizes.indexOf(size);
  if (fit === "Snug") {
    return chartSizes[Math.max(0, index - 1)];
  }
  if (fit === "Relaxed") {
    return chartSizes[Math.min(chartSizes.length - 1, index + 1)];
  }
  return size;
}

export default function SizeGuideModal() {
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("75");
  const [fit, setFit] = useState<Fit>("True to size");
  const [recommendedSize, setRecommendedSize] = useState<Size | null>(null);

  const findSize = () => {
    const heightCm = Number(height);
    const weightKg = Number(weight);
    if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) return;
    setRecommendedSize(recommendSize(heightCm, weightKg, fit));
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="link" size="sm" className="h-auto px-0" />
        }
      >
        <Ruler className="size-3.5" />
        Size Guide
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-lg sm:max-w-lg">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl font-bold tracking-wide uppercase">
            Size Guide
          </DialogTitle>
          <DialogDescription className="sr-only">
            View the size chart or get a personalized size recommendation.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="recommendation" className="w-full gap-6">
          <TabsList
            variant="line"
            className="h-auto w-full justify-center gap-0 rounded-none border-b border-border p-0"
          >
            <TabsTrigger
              value="chart"
              className="rounded-none px-4 py-2 uppercase"
            >
              Size Chart
            </TabsTrigger>
            <TabsTrigger
              value="recommendation"
              className="rounded-none px-4 py-2 uppercase"
            >
              Size Recommendation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left font-medium text-muted-foreground">
                      Measurement
                    </th>
                    {chartSizes.map((size) => (
                      <th key={size} className="py-2 font-bold text-foreground">
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row) => (
                    <tr key={row.label} className="border-b border-border">
                      <td className="py-2.5 text-left text-muted-foreground">
                        {row.label}
                      </td>
                      {row.values.map((value) => (
                        <td key={value} className="py-2.5 text-foreground">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="recommendation" className="space-y-6">
            <h3 className="text-center text-sm font-bold tracking-wide text-foreground uppercase">
              Find your size
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="height-cm" className="text-xs text-muted-foreground">
                  Height
                </label>
                <div className="relative">
                  <Input
                    id="height-cm"
                    type="number"
                    inputMode="numeric"
                    value={height}
                    onChange={(event) => {
                      setHeight(event.target.value);
                      setRecommendedSize(null);
                    }}
                    className="rounded-lg pr-12"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg"
                  >
                    cm
                  </Badge>
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="weight-kg" className="text-xs text-muted-foreground">
                  Weight
                </label>
                <div className="relative">
                  <Input
                    id="weight-kg"
                    type="number"
                    inputMode="numeric"
                    value={weight}
                    onChange={(event) => {
                      setWeight(event.target.value);
                      setRecommendedSize(null);
                    }}
                    className="rounded-lg pr-12"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg"
                  >
                    kg
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-foreground">How do you like it to fit?</p>
              <div className="flex flex-wrap gap-2">
                {fits.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={fit === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFit(option);
                      setRecommendedSize(null);
                    }}
                    className={cn("rounded-full")}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={findSize}
              className="h-12 w-full rounded-lg uppercase tracking-wide"
            >
              Find my size
            </Button>

            {recommendedSize && (
              <p className="text-center text-base font-medium text-foreground">
                Your Recommended Size:{" "}
                <span className="font-bold">{recommendedSize}</span>
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
