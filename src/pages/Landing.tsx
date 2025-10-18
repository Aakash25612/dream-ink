import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col items-center justify-center p-4 relative">
      {/* Main Content */}
      <div className="max-w-3xl text-center space-y-12 flex-1 flex flex-col justify-center">
        {/* CRETERA Branding */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] to-[hsl(217_91%_60%)] bg-clip-text text-transparent tracking-wide">
            CRETERA
          </h1>
          <p className="text-3xl md:text-4xl text-foreground font-light">
            The Era of Creation.
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-foreground/90 font-light">
          Your Imagination. Your Creation.
        </p>

        {/* Additional Content */}
        <div className="space-y-8 mt-16">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl text-foreground font-light">
              CRETERA —
            </h2>
            <p className="text-xl md:text-2xl text-foreground/90">
              Your Private World of Creation.
            </p>
          </div>

          <p className="text-xl md:text-2xl text-foreground/80">
            Created for Creators.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={() => navigate("/home")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-12 py-6 rounded-full mt-8"
          >
            Start Creation
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Landing;
