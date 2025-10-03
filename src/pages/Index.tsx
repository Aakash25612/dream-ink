import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-glow)] mb-4">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            AI Image Generator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Transform your ideas into stunning visuals with the power of artificial intelligence
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          {[
            { icon: Wand2, text: "Magic Prompts" },
            { icon: Zap, text: "Instant Results" },
            { icon: Sparkles, text: "AI Powered" },
          ].map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
            >
              <feature.icon className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-foreground">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate("/auth")}
          size="lg"
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg text-lg px-8 py-6 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500"
        >
          Get Started
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
