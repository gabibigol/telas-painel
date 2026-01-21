import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import Home from "./pages/Home";
import UploadDemo from "./pages/UploadDemo";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Analise from "./pages/admin/Analise";
import Vendas from "./pages/admin/Vendas";
import CarrinhosAbandonados from "./pages/admin/CarrinhosAbandonados";
import Cartoes from "./pages/admin/Cartoes";
import Produtos from "./pages/admin/Produtos";
import Categorias from "./pages/admin/Categorias";
import OrderBumps from "./pages/admin/OrderBumps";
import Brinde from "./pages/admin/Brinde";
import Frete from "./pages/admin/Frete";
import Taxas from "./pages/admin/Taxas";
import EdicoesMassa from "./pages/admin/EdicoesMassa";
import PixelsScripts from "./pages/admin/PixelsScripts";
import BancoDados from "./pages/admin/BancoDados";
import Configuracoes from "./pages/admin/Configuracoes";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/upload"} component={UploadDemo} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/checkout"} component={Checkout} />
      
      {/* Admin Routes */}
      <Route path={"/admin"} component={AdminLogin} />
      <Route path={"/admin/dashboard"} component={Dashboard} />
      <Route path={"/admin/analise"} component={Analise} />
      <Route path={"/admin/vendas"} component={Vendas} />
      <Route path={"/admin/carrinhos-abandonados"} component={CarrinhosAbandonados} />
      <Route path={"/admin/cartoes"} component={Cartoes} />
      <Route path={"/admin/produtos"} component={Produtos} />
      <Route path={"/admin/categorias"} component={Categorias} />
      <Route path={"/admin/order-bumps"} component={OrderBumps} />
      <Route path={"/admin/brinde"} component={Brinde} />
      <Route path={"/admin/frete"} component={Frete} />
      <Route path={"/admin/taxas"} component={Taxas} />
      <Route path={"/admin/edicoes-massa"} component={EdicoesMassa} />
      <Route path={"/admin/pixels-scripts"} component={PixelsScripts} />
      <Route path={"/admin/banco-dados"} component={BancoDados} />
      <Route path={"/admin/configuracoes"} component={Configuracoes} />
      
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AdminAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
