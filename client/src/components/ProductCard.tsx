import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface ProductProps {
  id?: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  soldCount: number;
  rating: number;
  discount?: string;
}

export function ProductCard({ id = 1, image, title, price, originalPrice, soldCount, rating, discount }: ProductProps) {
  return (
    <Link href={`/product/${id}`}>
      <Card className="group overflow-hidden border-none shadow-none hover:shadow-md transition-shadow duration-200 cursor-pointer rounded-lg bg-white">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount && (
            <Badge className="absolute top-2 left-2 bg-primary text-white hover:bg-primary border-none rounded-sm px-1.5 py-0.5 text-xs font-bold">
              {discount}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-3 space-y-1">
          <h3 className="text-sm font-medium leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-primary">
              R$ {price.toFixed(2).replace('.', ',')}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
          </div>
          <span>{soldCount > 1000 ? `${(soldCount/1000).toFixed(1)}k` : soldCount} sold</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
