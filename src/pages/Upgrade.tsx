import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-2xl text-center">
        {/* Text Content */}
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl text-foreground font-light">
            You've hit your<br />creative limit.
          </h2>
          <p className="text-2xl md:text-3xl text-foreground/80">
            Upgrade to create<br />without limits.
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate("/pricing")}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-12 py-6 rounded-full"
        >
          Unlock Power Of Creation
        </Button>
      </div>

      {/* Footer */}
      <footer className="text-muted-foreground text-xs text-center py-4">
        © 2025 Cretera — Designed & Created by Aradhya Garhewal. All rights reserved.
      </footer>
    </div>
  );
};

export default Upgrade;
