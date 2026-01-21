import { useAuth } from "@/_core/hooks/useAuth";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";

const PRODUCTS = [
  {
    id: 1,
    image: "/images/product_headphones.jpg",
    title: "Fone de Ouvido Bluetooth Cancelamento de Ruído Premium",
    price: 149.90,
    originalPrice: 299.90,
    soldCount: 12500,
    rating: 4.8,
    discount: "-50%"
  },
  {
    id: 2,
    image: "/images/product_skincare.jpg",
    title: "Sérum Facial Hidratante Ácido Hialurônico - Aura Botanics",
    price: 89.90,
    originalPrice: 120.00,
    soldCount: 5400,
    rating: 4.9,
    discount: "-25%"
  },
  {
    id: 3,
    image: "/images/product_sneakers.jpg",
    title: "Tênis Chunky Streetwear Confortável Unissex",
    price: 259.90,
    originalPrice: 350.00,
    soldCount: 3200,
    rating: 4.7,
    discount: "-26%"
  },
  {
    id: 4,
    image: "/images/product_smartwatch.jpg",
    title: "Smartwatch Fitness Tracker Monitor Cardíaco Pro",
    price: 199.90,
    originalPrice: 399.90,
    soldCount: 8900,
    rating: 4.6,
    discount: "-50%"
  },
  {
    id: 5,
    image: "/images/product_bag.jpg",
    title: "Bolsa Tote Couro Sintético Elegante Trabalho",
    price: 129.90,
    originalPrice: 189.90,
    soldCount: 1500,
    rating: 4.5,
    discount: "-32%"
  },
  {
    id: 6,
    image: "/images/product_headphones.jpg",
    title: "Fone de Ouvido Bluetooth Cancelamento de Ruído Premium",
    price: 149.90,
    originalPrice: 299.90,
    soldCount: 12500,
    rating: 4.8,
    discount: "-50%"
  },
  {
    id: 7,
    image: "/images/product_skincare.jpg",
    title: "Sérum Facial Hidratante Ácido Hialurônico - Aura Botanics",
    price: 89.90,
    originalPrice: 120.00,
    soldCount: 5400,
    rating: 4.9,
    discount: "-25%"
  },
  {
    id: 8,
    image: "/images/product_sneakers.jpg",
    title: "Tênis Chunky Streetwear Confortável Unissex",
    price: 259.90,
    originalPrice: 350.00,
    soldCount: 3200,
    rating: 4.7,
    discount: "-26%"
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6">
        {/* Categories / Filters Placeholder */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {["Para Você", "Beleza", "Eletrônicos", "Moda", "Casa", "Acessórios"].map((cat, i) => (
            <button 
              key={cat}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0 
                  ? "bg-black text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        {/* Loading State */}
        <div className="py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    </div>
  );
}
