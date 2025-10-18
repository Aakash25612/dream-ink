import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Plus",
      icon: "👤",
      price: "₹299",
      period: "/mo",
      subtitle: "The cost of one movie ticket",
      features: ["200 images / month", "70 images / day"],
      savings: "Save up to ₹1,000 / month",
      buttonText: "Start Creating",
      buttonClass: "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
    },
    {
      name: "Pro",
      icon: "✏️",
      price: "₹499",
      period: "/mo",
      subtitle: "The cost of one OTT subscription",
      features: ["400 images / month", "14 images / day"],
      savings: "Save up to ₹2,500 / month",
      buttonText: "Go Pro ⚡",
      buttonClass: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
    },
    {
      name: "Premium",
      icon: "💎",
      price: "₹999",
      period: "/mo",
      subtitle: "Unlock infinite creativity",
      features: ["1000 images / month", "34 images / day"],
      savings: "Save up to ₹15,000 / month",
      buttonText: "Unlock Creativity ✨",
      buttonClass: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-foreground"
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </header>
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-4xl font-light">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Power of Creation
          </span>
        </h1>
        <div className="text-foreground/80 text-sm md:text-base max-w-2xl mx-auto space-y-2">
          <p>
            Unlock high-quality, watermark-free AI creations at an affordable cost —
            renewed daily, with no queue, no tokin, and zero public visibility.
          </p>
          <p className="font-light">Your Imagination. Your Creation.</p>
          <p className="text-xs">Cretera — Your Private World of Creation.</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-3xl p-6 flex flex-col"
          >
            {/* Icon & Name */}
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{plan.icon}</div>
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
            </div>

            {/* Price */}
            <div className="text-center mb-4">
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{plan.subtitle}</p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-4 flex-1">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Savings */}
            <p className="text-xs text-muted-foreground mb-4">{plan.savings}</p>

            {/* Button */}
            <Button
              onClick={() => navigate("/home")}
              className={`w-full rounded-full py-6 ${plan.buttonClass}`}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-muted-foreground text-xs text-center py-4">
        © 2025 Cretera — Designed & Created by Aradhya Garhewal. All rights reserved.
      </footer>
    </div>
  );
};

export default Pricing;
