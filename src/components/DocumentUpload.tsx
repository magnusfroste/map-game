import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { GeographyQuestion } from '@/data/geographyQuestions';

interface DocumentUploadProps {
  onQuestionsGenerated: (questions: GeographyQuestion[]) => void;
}

const DocumentUpload = ({ onQuestionsGenerated }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Kunde inte läsa filen'));
      reader.readAsText(file);
    });
  };

  const processFile = async (file: File) => {
    const validTypes = ['text/plain', 'application/pdf', 'text/markdown'];
    const validExtensions = ['.txt', '.md', '.pdf'];
    
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    const isValidType = validTypes.includes(file.type) || validExtensions.includes(extension);
    
    if (!isValidType) {
      toast({
        title: 'Ogiltigt filformat',
        description: 'Ladda upp en .txt, .md eller .pdf-fil',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Filen är för stor',
        description: 'Max filstorlek är 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    try {
      let content: string;
      
      if (file.type === 'application/pdf') {
        toast({
          title: 'PDF-stöd begränsat',
          description: 'Använd gärna .txt eller .md för bästa resultat',
        });
        content = await readFileContent(file);
      } else {
        content = await readFileContent(file);
      }

      if (content.length < 50) {
        throw new Error('Filen innehåller för lite text');
      }

      const { data, error } = await supabase.functions.invoke('analyze-geography', {
        body: { documentText: content.slice(0, 50000) },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Kunde inte analysera dokumentet');
      }

      if (!data?.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Inga geografiska platser hittades i dokumentet');
      }

      toast({
        title: 'Analys klar!',
        description: `${data.questions.length} geografiska frågor genererades`,
      });

      onQuestionsGenerated(data.questions);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Fel vid analys',
        description: error instanceof Error ? error.message : 'Ett oväntat fel uppstod',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearFile = () => {
    setFileName(null);
  };

  return (
    <Card className="w-full max-w-xl mx-auto border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur">
      <CardContent className="p-8">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-4 p-8 rounded-xl
            transition-all duration-300 cursor-pointer
            ${isDragging 
              ? 'bg-primary/10 border-primary scale-[1.02]' 
              : 'hover:bg-muted/50'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="relative">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <Sparkles className="h-5 w-5 text-accent absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">AI analyserar dokumentet...</p>
                <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
              </div>
            </>
          ) : fileName ? (
            <>
              <FileText className="h-12 w-12 text-success" />
              <div className="text-center">
                <p className="font-semibold text-foreground">Uppladdad fil</p>
                <p className="text-sm text-muted-foreground">{fileName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4 mr-2" />
                Rensa
              </Button>
            </>
          ) : (
            <>
              <div className="relative">
                <Upload className="h-12 w-12 text-primary" />
                <Sparkles className="h-5 w-5 text-accent absolute -top-1 -right-1" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  Dra och släpp ditt dokument här
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  eller klicka för att välja fil
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Stödjer .txt, .md (max 5MB)
                </p>
              </div>
            </>
          )}
          
          <input
            type="file"
            accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
