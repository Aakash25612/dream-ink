import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Image as ImageIcon, Loader2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Generate = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Image Generated",
        description: "Your AI image is ready!",
      });
      // In a real app, this would be the actual generated image URL
      setGeneratedImage("https://images.unsplash.com/photo-1547954575-855750c57bd3?w=800&h=800&fit=crop");
    }, 3000);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="hover:bg-secondary/80"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Prompt Input Section */}
          <Card className="p-6 shadow-[var(--shadow-card)] border-border/50">
            <div className="space-y-4">
              <div>
                <label htmlFor="prompt" className="text-sm font-medium text-foreground mb-2 block">
                  Enter your prompt
                </label>
                <Textarea
                  id="prompt"
                  placeholder="A serene landscape with mountains at sunset, digital art..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none bg-background/50 border-input focus:border-primary transition-colors"
                />
              </div>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Generated Image Section */}
          <Card className="p-6 shadow-[var(--shadow-card)] border-border/50">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Generated Image</h2>
              <div className="aspect-square rounded-xl bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                {generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center space-y-3">
                    <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">
                      Your generated image will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Generate;
