import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Check
} from "lucide-react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

// Mock product data
const PRODUCT = {
  id: 1,
  name: "Fone de Ouvido Bluetooth Premium com Cancelamento de Ruído Ativo",
  price: 149.90,
  originalPrice: 299.90,
  discount: 50,
  rating: 4.8,
  reviews: 1250,
  soldCount: 12500,
  images: [
    "/images/product_headphones.jpg",
    "/images/product_headphones.jpg",
    "/images/product_headphones.jpg",
  ],
  colors: [
    { id: 1, name: "Preto", value: "#000000", available: true },
    { id: 2, name: "Branco", value: "#FFFFFF", available: true },
    { id: 3, name: "Azul", value: "#1E90FF", available: true },
    { id: 4, name: "Rosa", value: "#FE2C55", available: false },
  ],
  description: "Experimente o som de alta qualidade com nosso fone de ouvido Bluetooth premium. Com cancelamento de ruído ativo, bateria de longa duração e design confortável para uso prolongado.",
  features: [
    "Cancelamento de ruído ativo",
    "Bateria de 30 horas",
    "Bluetooth 5.0",
    "Microfone integrado",
    "Dobrável e portátil"
  ],
  seller: {
    name: "TechStore Official",
    rating: 4.9,
    followers: "50.2K"
  }
};

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    toast.success("Produto adicionado ao carrinho!");
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Faça login para continuar");
      return;
    }
    window.location.href = "/checkout";
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % PRODUCT.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + PRODUCT.images.length) % PRODUCT.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/" className="hover:text-primary">Eletrônicos</Link>
            <span>/</span>
            <span className="text-foreground">Fones de Ouvido</span>
          </div>
        </div>

        <div className="container pb-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Gallery */}
              <div className="relative bg-gray-100">
                {/* Main Image */}
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={PRODUCT.images[selectedImage]} 
                    alt={PRODUCT.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-white text-sm px-3 py-1">
                      -{PRODUCT.discount}%
                    </Badge>
                  </div>

                  {/* Hot Deal Badge */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
                      🔥 Hot Deal
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 p-4 justify-center">
                  {PRODUCT.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 md:p-8 flex flex-col">
                {/* Seller Info */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">TS</span>
                  </div>
                  <span className="text-sm font-medium">{PRODUCT.seller.name}</span>
                  <Badge variant="outline" className="text-xs">
                    ⭐ {PRODUCT.seller.rating}
                  </Badge>
                </div>

                {/* Product Name */}
                <h1 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                  {PRODUCT.name}
                </h1>

                {/* Rating & Sales */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{PRODUCT.rating}</span>
                    <span className="text-muted-foreground text-sm">({PRODUCT.reviews} avaliações)</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {PRODUCT.soldCount.toLocaleString()} vendidos
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    R$ {PRODUCT.price.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    R$ {PRODUCT.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">
                    Cor: <span className="text-muted-foreground">{selectedColor.name}</span>
                  </p>
                  <div className="flex gap-3">
                    {PRODUCT.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => color.available && setSelectedColor(color)}
                        disabled={!color.available}
                        className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                          selectedColor.id === color.id 
                            ? "border-primary ring-2 ring-primary/30" 
                            : "border-gray-200 hover:border-gray-300"
                        } ${!color.available ? "opacity-40 cursor-not-allowed" : ""}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {selectedColor.id === color.id && (
                          <Check className={`h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                            color.value === "#FFFFFF" ? "text-black" : "text-white"
                          }`} />
                        )}
                        {!color.available && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-gray-400 rotate-45" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Quantidade</p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 text-base border-primary text-primary hover:bg-primary/5"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  <Button 
                    className="flex-1 h-12 text-base bg-primary hover:bg-primary/90"
                    onClick={handleBuyNow}
                  >
                    Comprar Agora
                  </Button>
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                    Favoritar
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Share2 className="h-5 w-5" />
                    Compartilhar
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="border-t pt-6 mt-auto">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center">
                      <Shield className="h-6 w-6 text-green-600 mb-1" />
                      <span className="text-xs text-muted-foreground">Compra Protegida</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Truck className="h-6 w-6 text-blue-600 mb-1" />
                      <span className="text-xs text-muted-foreground">Frete Grátis</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <RotateCcw className="h-6 w-6 text-orange-600 mb-1" />
                      <span className="text-xs text-muted-foreground">Devolução Fácil</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t p-6 md:p-8">
              <h2 className="text-lg font-bold mb-4">Descrição do Produto</h2>
              <p className="text-muted-foreground mb-4">{PRODUCT.description}</p>
              
              <h3 className="font-semibold mb-2">Características:</h3>
              <ul className="space-y-2">
                {PRODUCT.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3 z-50">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsFavorite(!isFavorite)}
          className="h-12 w-12"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-12 border-primary text-primary"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Carrinho
        </Button>
        <Button 
          className="flex-1 h-12 bg-primary hover:bg-primary/90"
          onClick={handleBuyNow}
        >
          Comprar
        </Button>
      </div>
    </div>
  );
}
