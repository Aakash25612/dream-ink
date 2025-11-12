import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import creteraIcon from "@/assets/cretera-icon.png";

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
      <div className="text-center space-y-6">
        {/* Cretera Icon */}
        <div className="relative w-32 h-32 mx-auto animate-fade-in">
          <img 
            src={creteraIcon}
            alt="Cretera Icon"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>

        {/* CRETERA text - fades in after 1 second */}
        <h1 
          className={`text-5xl md:text-6xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] to-[hsl(217_91%_60%)] bg-clip-text text-transparent tracking-wide transition-opacity duration-700 ${
            showText ? "opacity-100" : "opacity-0"
          }`}
          style={{
            filter: showText ? "drop-shadow(0 0 20px hsl(200_100%_70% / 0.5)) drop-shadow(0 0 40px hsl(217_91%_60% / 0.3))" : "none"
          }}
        >
          CRETERA
        </h1>
      </div>
    </div>
  );
};

export default Splash;
