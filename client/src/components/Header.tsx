import { Search, ShoppingCart, MessageSquare, Upload, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-1 cursor-pointer">
              <img 
                src="https://sf16-scmcdn-sg.ibytedtos.com/goofy/tiktok/web/node/_next/static/images/logo-dark-e95da587b61920d5579dc41df376c8dd.svg" 
                alt="TikTok Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold tracking-tight hidden sm:inline-block">Shop</span>
            </div>
          </Link>
        </div>

        {/* Search Bar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex flex-1 max-w-xl items-center relative">
          <Input 
            type="search" 
            placeholder="Search for items" 
            className="w-full rounded-full bg-muted pl-4 pr-12 py-2 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full hover:bg-transparent"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/upload">
            <Button variant="ghost" size="icon" title="Upload de Arquivos">
              <Upload className="h-6 w-6" />
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              2
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <MessageSquare className="h-6 w-6" />
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name || "Usuário"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-md px-6"
              asChild
            >
              <a href={getLoginUrl()}>Log in</a>
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Search Bar - Visible only on mobile */}
      <div className="md:hidden container pb-3">
        <div className="relative">
          <Input 
            type="search" 
            placeholder="Search" 
            className="w-full rounded-full bg-muted pl-10 pr-4 py-2 border-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
