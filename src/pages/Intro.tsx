import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    // Fade in subtext after 0.5 seconds
    const subtextTimer = setTimeout(() => {
      setShowSubtext(true);
    }, 500);

    // Navigate to home after total duration
    const navigationTimer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 3500);

    return () => {
      clearTimeout(subtextTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        {/* CRETERA with soft neon blue glow */}
        <h1 
          className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] to-[hsl(217_91%_60%)] bg-clip-text text-transparent tracking-wide animate-fade-in"
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
      </div>
    </div>
  );
};

export default Intro;
