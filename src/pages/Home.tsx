import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Zap, Gift, Image as ImageIcon, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleCreate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter what you want to create",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch(`https://wahdjskwegycbrxiyjjg.supabase.co/functions/v1/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim()
        })
      });
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Save to database
      const {
        error: dbError
      } = await supabase.from('creations').insert({
        prompt: prompt.trim(),
        image_url: data.image,
        user_id: null // Will be set when auth is implemented
      });
      if (dbError) {
        console.error('Failed to save to database:', dbError);
        // Still show success even if DB save fails
      }
      toast({
        title: "Image Generated",
        description: "Your creation is ready!"
      });

      // Navigate to creations page
      navigate("/creations");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const features = [{
    icon: Globe,
    title: "Cretera Space",
    description: "Explore your creative world",
    color: "text-primary",
    onClick: () => navigate("/space")
  }, {
    icon: Zap,
    title: "Power of Creation",
    description: "Unlock limitless creativity",
    color: "text-purple-500",
    onClick: () => navigate("/pricing")
  }, {
    icon: Gift,
    title: "Referal",
    description: "Invite & earn rewards",
    color: "text-accent",
    onClick: () => navigate("/referral")
  }, {
    icon: ImageIcon,
    title: "My Creations",
    description: "View all your creations",
    color: "text-cyan-500",
    onClick: () => navigate("/creations")
  }];
  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center">
          <User className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Branding */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] to-[hsl(217_91%_60%)] bg-clip-text text-transparent">
            CRETERA
          </h1>
          <p className="text-2xl md:text-3xl text-foreground">
            The Era of Creation.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl space-y-4 mb-8">
          <div className="relative">
            <Input placeholder="What do you wanna create?" value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} className="bg-card border-2 border-primary/30 text-foreground placeholder:text-muted-foreground rounded-2xl h-14 pl-12 text-base focus:border-primary" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
              <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                <span className="text-sm">+</span>
              </div>
            </div>
          </div>

          <Button onClick={handleCreate} disabled={isGenerating} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-2xl">
            {isGenerating ? "Creating..." : "Create"}
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-8">
          {features.map((feature, index) => <button key={index} onClick={feature.onClick} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center space-y-3 hover:bg-card/80 transition-colors">
              <feature.icon className={`w-12 h-12 ${feature.color}`} />
              <div>
                <h3 className="text-foreground font-medium">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{feature.description}</p>
              </div>
            </button>)}
        </div>
      </main>

    </div>;
};
export default Home;