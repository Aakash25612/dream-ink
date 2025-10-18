import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Space = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col items-center justify-between p-4">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-xl">
        {/* Icon */}
        <div className="w-32 h-32 flex items-center justify-center">
          <Globe className="w-24 h-24 text-primary" strokeWidth={1.5} />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl text-foreground font-light">
            Cretera Space
          </h2>
          <p className="text-xl text-foreground/80">
            Explore your creative world.<br />All your creations in one place.
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate("/creations")}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-16 py-6 rounded-full"
        >
          View Creations
        </Button>
      </div>

      {/* Footer */}
      <footer className="text-muted-foreground text-xs text-center py-4">
        © 2025 Cretera — Designed & Created by Aradhya Garhewal. All rights reserved.
      </footer>
    </div>
  );
};

export default Space;
