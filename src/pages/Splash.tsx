import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show text after 1 second
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    // Navigate to home after 2.5 seconds total
    const navigationTimer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 2500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Cretera Icon - 8-point glowing blue design */}
        <div className="relative w-32 h-32 mx-auto">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            style={{
              filter: "drop-shadow(0 0 20px hsl(200_100%_70% / 0.6)) drop-shadow(0 0 40px hsl(217_91%_60% / 0.4))"
            }}
          >
            {/* 8-point star shape */}
            <path
              d="M50 10 L55 40 L75 25 L65 50 L90 50 L65 55 L75 75 L55 65 L50 90 L45 65 L25 75 L35 55 L10 50 L35 45 L25 25 L45 40 Z"
              fill="url(#blueGradient)"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(200_100%_70%)" />
                <stop offset="100%" stopColor="hsl(217_91%_60%)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* CRETERA text - fades in after 1 second */}
        <h1 
          className={`text-6xl md:text-7xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] to-[hsl(217_91%_60%)] bg-clip-text text-transparent tracking-wide transition-opacity duration-700 ${
            showText ? "opacity-100" : "opacity-0"
          }`}
          style={{
            filter: showText ? "drop-shadow(0 0 20px hsl(200_100%_70% / 0.4))" : "none"
          }}
        >
          CRETERA
        </h1>
      </div>
    </div>
  );
};

export default Splash;
