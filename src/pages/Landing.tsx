import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubtext(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col items-center justify-center p-4 relative">
      {/* Main Content */}
      <div className="text-center space-y-6 flex-1 flex flex-col justify-center">
        {/* CRETERA with neon blue glow */}
        <h1 
          className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] to-[hsl(217_91%_60%)] bg-clip-text text-transparent tracking-wide"
          style={{
            filter: "drop-shadow(0 0 40px hsl(200_100%_70% / 0.6)) drop-shadow(0 0 80px hsl(217_91%_60% / 0.4))"
          }}
        >
          CRETERA
        </h1>

        {/* The Era of Creation - fades in 0.5s later */}
        <p 
          className={`text-2xl md:text-3xl text-foreground/90 font-light transition-opacity duration-700 ${
            showSubtext ? "opacity-100" : "opacity-0"
          }`}
        >
          The Era of Creation.
        </p>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate("/auth")}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-12 py-6 rounded-full mt-12"
        >
          Start Creation
        </Button>
      </div>

    </div>
  );
};

export default Landing;
