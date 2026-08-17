import { Button } from "@/components/ui/button";

export default function OtherCategories() {
  return (
    <section className="mt-16 mb-8 border-t border-border pt-12">
      <h2 className="text-xl font-bold mb-6 text-foreground uppercase">Other Fashion Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 */}
        <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-between relative overflow-hidden group border border-border">
          <div className="z-10 max-w-[200px]">
            <h3 className="text-xl font-bold mb-2 text-foreground">Woman Fashion</h3>
            <p className="text-sm text-muted-foreground mb-6">Explore our stylish and trendy woman's fashion.</p>
            <Button variant="outline" className="rounded-full bg-background hover:bg-muted text-xs px-6 shadow-sm">
              EXPLORE PRODUCT <span className="ml-1">↗</span>
            </Button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 md:w-5/12 bg-muted flex items-center justify-center">
            {/* Using a placeholder since image URL is not provided */}
            <span className="text-muted-foreground text-xs font-medium uppercase">Woman Image</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-between relative overflow-hidden group border border-border">
          <div className="z-10 max-w-[200px]">
            <h3 className="text-xl font-bold mb-2 text-foreground">Shoes Fashion</h3>
            <p className="text-sm text-muted-foreground mb-6">Explore our stylish and trendy shoes fashion.</p>
            <Button variant="outline" className="rounded-full bg-background hover:bg-muted text-xs px-6 shadow-sm">
              EXPLORE PRODUCT <span className="ml-1">↗</span>
            </Button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 md:w-5/12 bg-muted flex items-center justify-center">
             {/* Using a placeholder since image URL is not provided */}
            <span className="text-muted-foreground text-xs font-medium uppercase">Shoes Image</span>
          </div>
        </div>

      </div>
    </section>
  );
}
