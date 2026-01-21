import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  MapPin, 
  CreditCard, 
  Shield,
  Truck,
  Edit2,
  Check
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

// Mock cart data
const CART_ITEMS = [
  {
    id: 1,
    name: "Fone de Ouvido Bluetooth Premium com Cancelamento de Ruído",
    variant: "Preto",
    price: 149.90,
    quantity: 1,
    image: "/images/product_headphones.jpg",
    seller: "TechStore Official"
  }
];

const SHIPPING_OPTIONS = [
  { id: "standard", name: "Frete Padrão", price: 0, days: "5-8 dias úteis" },
  { id: "express", name: "Frete Expresso", price: 19.90, days: "2-3 dias úteis" },
];

const PAYMENT_METHODS = [
  { id: "credit", name: "Cartão de Crédito", icon: "💳", description: "Visa, Mastercard, Elo" },
  { id: "pix", name: "PIX", icon: "⚡", description: "Aprovação instantânea" },
  { id: "boleto", name: "Boleto Bancário", icon: "📄", description: "Vencimento em 3 dias" },
];

export default function Checkout() {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);

  // Address state
  const [address, setAddress] = useState({
    name: user?.name || "João Silva",
    street: "Rua das Flores, 123",
    complement: "Apto 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    phone: "(11) 99999-9999"
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Calculate totals
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === selectedShipping)?.price || 0;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Faça login para continuar");
      return;
    }

    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Pedido realizado com sucesso! 🎉");
    setIsProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold mb-2">Login Necessário</h1>
          <p className="text-muted-foreground mb-6">
            Para finalizar sua compra, você precisa estar logado.
          </p>
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <a href={getLoginUrl()}>Fazer Login</a>
          </Button>
          <Link href="/">
            <Button variant="ghost" className="w-full mt-2">
              Voltar para a Loja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container flex h-14 items-center gap-4">
          <Link href="/product/1">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Checkout</h1>
        </div>
      </header>

      <main className="container py-6 pb-32 md:pb-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Endereço de Entrega</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  {isEditingAddress ? "Salvar" : "Editar"}
                </Button>
              </div>

              {isEditingAddress ? (
                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        value={address.name}
                        onChange={(e) => setAddress({...address, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input 
                      id="zipCode" 
                      value={address.zipCode}
                      onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="street">Endereço</Label>
                    <Input 
                      id="street" 
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input 
                        id="complement" 
                        value={address.complement}
                        onChange={(e) => setAddress({...address, complement: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input 
                        id="neighborhood" 
                        value={address.neighborhood}
                        onChange={(e) => setAddress({...address, neighborhood: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input 
                        id="city" 
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input 
                        id="state" 
                        value={address.state}
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{address.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {address.street}, {address.complement}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.neighborhood} - {address.city}/{address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {address.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {address.phone}
                  </p>
                </div>
              )}
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Método de Envio</h2>
              </div>

              <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedShipping === option.id 
                          ? "border-primary bg-primary/5" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-muted-foreground">{option.days}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${option.price === 0 ? "text-green-600" : ""}`}>
                        {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2).replace(".", ",")}`}
                      </span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Forma de Pagamento</h2>
              </div>

              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedPayment === method.id 
                          ? "border-primary bg-primary/5" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                      {selectedPayment === method.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              </RadioGroup>

              {/* Credit Card Form */}
              {selectedPayment === "credit" && (
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Validade</Label>
                      <Input id="expiry" placeholder="MM/AA" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input id="cardName" placeholder="Como está no cartão" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h2 className="font-semibold mb-4">Resumo do Pedido</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {CART_ITEMS.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.variant}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">Qtd: {item.quantity}</span>
                        <span className="font-semibold text-primary">
                          R$ {item.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className={shippingCost === 0 ? "text-green-600" : ""}>
                    {shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button 
                className="w-full mt-6 h-12 text-base bg-primary hover:bg-primary/90"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processando...
                  </>
                ) : (
                  "Finalizar Pedido"
                )}
              </Button>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Compra 100% Segura</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-primary">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <Button 
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? "Processando..." : "Finalizar Pedido"}
        </Button>
      </div>
    </div>
  );
}
