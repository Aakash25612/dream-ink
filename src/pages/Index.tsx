import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import creteraIcon from "@/assets/cretera-icon.png";

const Index = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, show splash then go to home
        setShowText(true);
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 2500);
      } else {
        // User is not logged in, go directly to landing (no splash)
        navigate("/landing", { replace: true });
      }
    };

    checkAuthAndNavigate();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="text-center space-y-8">
        {/* Cretera Icon */}
        <div className="relative w-32 h-32 mx-auto animate-fade-in">
          <img 
            src={creteraIcon}
            alt="Cretera Icon"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>

        {/* CRETERA text - Enhanced with better glow */}
        <h1 
          className={`text-6xl md:text-7xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] via-[hsl(217_91%_60%)] to-[hsl(200_100%_70%)] bg-clip-text text-transparent tracking-wider transition-all duration-700 ${
            showText ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{
            filter: showText 
              ? "drop-shadow(0 0 30px hsl(200_100%_70% / 0.6)) drop-shadow(0 0 60px hsl(217_91%_60% / 0.4))" 
              : "none"
          }}
        >
          CRETERA
        </h1>

        {/* Loading indicator */}
        <div 
          className={`flex justify-center gap-2 transition-opacity duration-500 ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          <div 
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
