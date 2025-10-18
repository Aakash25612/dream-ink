import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/referral")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-xl">
        {/* Success Icon */}
        <div className="w-32 h-32 rounded-full border-4 border-foreground flex items-center justify-center">
          <CheckCircle className="w-20 h-20 text-foreground" strokeWidth={1.5} />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl text-foreground font-light">
            Shared<br />Successfully.
          </h2>
          <p className="text-2xl text-foreground/90 flex items-center justify-center gap-2">
            Rewards Await. <Sparkles className="w-6 h-6 text-yellow-400" />
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate("/referral")}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-16 py-6 rounded-full"
        >
          Invite Again
        </Button>
      </div>

      {/* Footer */}
      <footer className="text-muted-foreground text-xs text-center py-4">
        © 2025 Cretera — Designed & Created by Aradhya Garhewal. All rights reserved.
      </footer>
    </div>
  );
};

export default Success;
