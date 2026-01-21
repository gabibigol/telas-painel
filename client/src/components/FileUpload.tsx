import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, CheckCircle, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  fileName: string;
  url: string;
  key: string;
}

interface FileUploadProps {
  onUploadComplete?: (file: UploadedFile) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  folder?: string;
}

export function FileUpload({ 
  onUploadComplete, 
  acceptedTypes = "image/*", 
  maxSizeMB = 5,
  folder = "uploads"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.storage.upload.useMutation({
    onSuccess: (data) => {
      const file: UploadedFile = {
        fileName: data.fileName,
        url: data.url,
        key: data.key,
      };
      setUploadedFile(file);
      toast.success("Arquivo enviado com sucesso!");
      onUploadComplete?.(file);
    },
    onError: (error) => {
      toast.error(`Erro ao enviar arquivo: ${error.message}`);
      setPreview(null);
    },
  });

  const handleFileSelect = async (file: File) => {
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    // Convert to base64 and upload
    const base64 = await fileToBase64(file);
    uploadMutation.mutate({
      fileName: file.name,
      fileData: base64,
      contentType: file.type,
      folder,
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:*/*;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearUpload = () => {
    setPreview(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          Upload de Arquivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging 
                ? "border-primary bg-primary/5" 
                : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleInputChange}
              className="hidden"
            />
            
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Enviando...</p>
              </div>
            ) : preview ? (
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-32 rounded-lg object-contain"
                />
                <p className="text-sm text-muted-foreground">Processando...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-gray-100">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Arraste e solte ou clique para selecionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo {maxSizeMB}MB
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800 truncate">
                  {uploadedFile.fileName}
                </p>
                <p className="text-xs text-green-600">Upload concluído!</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearUpload}
                className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {preview && (
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={uploadedFile.url} 
                  alt="Uploaded" 
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">URL do arquivo:</p>
              <p className="text-xs font-mono text-foreground break-all">
                {uploadedFile.url}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={clearUpload}
              className="w-full"
            >
              Enviar outro arquivo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
