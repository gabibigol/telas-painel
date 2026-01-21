import { useAuth } from "@/_core/hooks/useAuth";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowLeft, LogIn } from "lucide-react";
import { Link } from "wouter";

export default function UploadDemo() {
  const { user, isAuthenticated, loading } = useAuth();

  const handleUploadComplete = (file: { fileName: string; url: string; key: string }) => {
    console.log("Arquivo enviado:", file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Home
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Armazenamento de Arquivos
            </h1>
            <p className="text-muted-foreground">
              Demonstração da funcionalidade de upload de arquivos para o S3.
            </p>
          </div>

          {isAuthenticated ? (
            <div className="flex justify-center">
              <FileUpload 
                onUploadComplete={handleUploadComplete}
                acceptedTypes="image/*"
                maxSizeMB={5}
                folder="product-images"
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg border">
              <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Login Necessário</h2>
              <p className="text-muted-foreground mb-4">
                Você precisa estar logado para fazer upload de arquivos.
              </p>
              <Button asChild>
                <a href={getLoginUrl()}>
                  Fazer Login
                </a>
              </Button>
            </div>
          )}

          <div className="mt-8 p-6 bg-white rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Como funciona</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                <p>O usuário seleciona um arquivo (arrastar e soltar ou clicar).</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                <p>O arquivo é convertido para Base64 e enviado ao servidor via tRPC.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                <p>O servidor faz upload para o S3 usando <code className="bg-gray-100 px-1 rounded">storagePut()</code>.</p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
                <p>A URL pública do arquivo é retornada e pode ser usada na aplicação.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
