import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
        {/* Cretera Icon - Enhanced 8-point glowing blue star with rotation */}
        <div className="relative w-40 h-40 mx-auto animate-fade-in">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full animate-spin-slow"
            style={{
              filter: "drop-shadow(0 0 30px hsl(200_100%_70% / 0.8)) drop-shadow(0 0 60px hsl(217_91%_60% / 0.6))"
            }}
          >
            {/* Enhanced 8-point star shape */}
            <path
              d="M50 5 L57 38 L80 20 L68 50 L95 50 L68 50 L80 80 L57 62 L50 95 L43 62 L20 80 L32 50 L5 50 L32 50 L20 20 L43 38 Z"
              fill="url(#blueGradient)"
              stroke="url(#blueGradient)"
              strokeWidth="1"
              className="opacity-90"
            />
            {/* Inner glow circle */}
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="url(#centerGlow)"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(200_100%_70%)" />
                <stop offset="50%" stopColor="hsl(217_91%_60%)" />
                <stop offset="100%" stopColor="hsl(200_100%_70%)" />
              </linearGradient>
              <radialGradient id="centerGlow">
                <stop offset="0%" stopColor="hsl(200_100%_80%)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(217_91%_60%)" stopOpacity="0.3" />
              </radialGradient>
            </defs>
          </svg>
          
          {/* Outer glow ring */}
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "radial-gradient(circle, hsl(217_91%_60% / 0.3) 0%, transparent 70%)",
              animationDuration: "2s"
            }}
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
