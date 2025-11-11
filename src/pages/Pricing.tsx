import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useBilling } from "@/hooks/useBilling";
import { PlanType, PeriodType } from "@/services/billingService";
const Pricing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"monthly" | "weekly">("monthly");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const {
    isNative,
    purchaseSubscription,
    loading
  } = useBilling();
  const monthlyPlans = [{
    name: "Plus",
    icon: "👤",
    price: "₹299",
    period: "/mo",
    tagline: "The cost of a movie ticket",
    features: ["210 images / month", "7 images / day"],
    savings: "Save up to ₹1,000 / month",
    buttonText: "Ignite Creation",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]",
    isPopular: false
  }, {
    name: "Pro",
    icon: "✏️",
    price: "₹499",
    period: "/mo",
    tagline: "The cost of a OTT subscription",
    features: ["420 images / month", "14 images / day"],
    savings: "Save up to ₹2,500 / month",
    buttonText: "Boost Creation",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-black border-2 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.7)]",
    isPopular: true
  }, {
    name: "Premium",
    icon: "💎",
    price: "₹999",
    period: "/mo",
    tagline: "The cost of one dinner out",
    features: ["1020 images / month", "34 images / day"],
    savings: "Save up to ₹15,000 / month",
    buttonText: "Elevate Creation",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]",
    isPopular: false
  }];
  const weeklyPlans = [{
    name: "Plus",
    icon: "👤",
    price: "₹99",
    period: "/wk",
    tagline: "The cost of a cup of coffee",
    features: ["63 images / week", "9 images / day"],
    savings: "Save up to ₹250 / week",
    buttonText: "Ignite Creation",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]",
    isPopular: false
  }, {
    name: "Pro",
    icon: "✏️",
    price: "₹199",
    period: "/wk",
    tagline: "The cost of a burger",
    features: ["133 images / week", "19 images / day"],
    savings: "Save up to ₹625 / week",
    buttonText: "Boost Creation",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-black border-2 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.7)]",
    isPopular: true
  }, {
    name: "Premium",
    icon: "💎",
    price: "₹399",
    period: "/wk",
    tagline: "The cost of a pizza",
    features: ["329 images / week", "47 images / day"],
    savings: "Save up to ₹3,750 / week",
    buttonText: "Elevate Creation",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]",
    isPopular: false
  }];
  const plans = activeTab === "monthly" ? monthlyPlans : weeklyPlans;
  const allocateCredits = async (planName: string) => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate end date based on period type
      const endDate = new Date();
      if (activeTab === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setDate(endDate.getDate() + 7);
      }

      // Call database function to allocate credits
      await supabase.rpc('allocate_subscription_credits', {
        p_user_id: user.id,
        p_plan_type: planName.toLowerCase(),
        p_period_type: activeTab,
        p_end_date: endDate.toISOString()
      });
    } catch (error) {
      console.error('Error allocating credits:', error);
    }
  };
  const handlePlanSelect = async (planName: string) => {
    setSelectedPlan(planName);
    if (isNative) {
      // Native Android - use Google Play Billing
      const success = await purchaseSubscription(planName.toLowerCase() as PlanType, activeTab as PeriodType, async purchaseToken => {
        // Purchase successful, allocate credits
        await allocateCredits(planName);
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          navigate("/home");
        }, 3000);
      });
    } else {
      // Web flow - allocate credits directly
      await allocateCredits(planName);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        navigate("/home");
      }, 3000);
    }
  };
  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
        <button onClick={() => navigate("/home")} className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </header>
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-light">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Power of Creation
          </span>
        </h1>
        <div className="text-foreground/80 text-sm md:text-base max-w-2xl mx-auto space-y-2">
          <p>
            Unlock high-quality, watermark-free, swift AI creations — at an affordable cost.
            Renewed daily, with no queue, no token, and zero public visibility.
          </p>
          <p className="font-light">Your Imagination. Your Creation.</p>
          <p className="text-xs">CRETERA — Your Private World of Creation.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-card border border-border rounded-full p-1 flex">
          <button onClick={() => setActiveTab("monthly")} className={`flex-1 rounded-full py-3 text-sm font-medium transition-all ${activeTab === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Monthly Plans
          </button>
          <button onClick={() => setActiveTab("weekly")} className={`flex-1 rounded-full py-3 text-sm font-medium transition-all ${activeTab === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Weekly Plans
          </button>
        </div>
      </div>

      {/* Taglines Below Tabs */}
      <div className="max-w-2xl mx-auto text-center space-y-1 mb-8">
        <p className="text-foreground/90 text-sm">Your creative energy renews every day.</p>
        <p className="text-foreground/90 text-sm">Create more. Spend less.</p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan, index) => <div key={index} className={`bg-card border rounded-3xl p-6 flex flex-col relative ${plan.isPopular ? "border-primary shadow-lg shadow-primary/20" : "border-border"}`}>
            {/* Most Popular Badge */}
            {plan.isPopular && <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              </div>}

            {/* Icon & Name */}
            <div className="text-center mb-4">
              
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
            </div>

            {/* Price */}
            <div className="text-center mb-4">
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-4 flex-1">
              {plan.features.map((feature, idx) => <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>)}
            </div>

            {/* Savings */}
            <p className="text-xs text-muted-foreground mb-4">{plan.savings}</p>

            {/* Button */}
            <Button onClick={() => handlePlanSelect(plan.name)} className={`w-full rounded-full py-6 ${plan.buttonClass}`} disabled={loading}>
              {loading ? "Processing..." : plan.buttonText}
            </Button>
          </div>)}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              You have unlocked the Power of Creation. ⚡
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base space-y-2">
              <p className="text-lg font-semibold text-foreground">
                {selectedPlan === "Plus" && "Creation Ignited"}
                {selectedPlan === "Pro" && "Creation Boosted"}
                {selectedPlan === "Premium" && "Creation Elevated"}
              </p>
              <Button onClick={() => {
              setShowConfirmation(false);
              navigate("/home");
            }} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 mt-4">
                Enjoy Seamless Creation
              </Button>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

    </div>;
};
export default Pricing;