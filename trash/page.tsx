// import type { Metadata } from "next";
//
// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import ProductGallery from "@/components/ProductGallery";
// import ProductInfo from "@/components/ProductInfo";
// import ProductTabs from "@/components/ProductTabs";
// import YouMayAlsoLike from "@/components/YouMayAlsoLike";
//
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }): Promise<Metadata> {
//   const { id } = await params;
//
//   return {
//     title: `Essential Oversized Hoodie | AVEN`,
//     description: `Shop the Essential Oversized Hoodie (product ${id}) at AVEN.`,
//   };
// }
//
// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   await params;
//
//   return (
//     <div className="flex min-h-full flex-col bg-background text-foreground">
//       <Header />
//       <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-4 py-8 sm:px-6 lg:px-8">
//         <section className="grid gap-10 lg:grid-cols-2 lg:gap-12">
//           <ProductGallery />
//           <ProductInfo />
//         </section>
//         <ProductTabs />
//         <YouMayAlsoLike />
//       </main>
//       <Footer />
//     </div>
//   );
// }
