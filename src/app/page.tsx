import DemographicsGrid from "@/components/DemographicsGrid";
import FeaturedCollections from "@/components/FeaturedCollections";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromoSplitBanner from "@/components/PromoSplitBanner";
import VideoLookbook from "@/components/VideoLookbook";
import WinterCollections from "@/components/WinterCollections";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <WinterCollections />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pb-20 sm:px-6 lg:px-8">
          <PromoSplitBanner />
          <VideoLookbook />
          <FeaturedCollections />
          <DemographicsGrid />
        </div>
        <RecentlyViewed />
      </main>
      <Footer />
    </div>
  );
}
