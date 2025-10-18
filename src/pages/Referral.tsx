import { Button } from "@/components/ui/button";
import { Gift, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Referral = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInvite = () => {
    // Simulate sharing
    toast({
      title: "Success",
      description: "Referral link copied!",
    });
    navigate("/success");
  };

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
        <h1 className="text-2xl text-foreground">Referral</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-xl">
        {/* Icon */}
        <div className="w-32 h-32 flex items-center justify-center">
          <Gift className="w-24 h-24 text-accent" strokeWidth={1.5} />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl text-foreground font-light">
            Spread the Power<br />of Creation.
          </h2>
          <p className="text-xl text-foreground/80">
            Invite your friends to Cretera<br />and grow your creative circle.
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleInvite}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-16 py-6 rounded-full"
        >
          Invite Friends
        </Button>
      </div>

    </div>
  );
};

export default Referral;
