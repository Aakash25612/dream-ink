import { User, Image as ImageIcon, Zap, Gift, Settings, HelpCircle, LogOut, ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/useCredits";

const Profile = () => {
  const navigate = useNavigate();
  const { credits, totalCredits } = useCredits();
  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [totalCreations, setTotalCreations] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setDisplayName(profile.display_name || "User");
        }

        // Fetch total creations
        const { count } = await supabase
          .from("creations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        setTotalCreations(count || 0);
      }
    };

    fetchUserData();
  }, []);

  const menuItems = [
    { icon: ImageIcon, label: "My Creations", color: "text-cyan-500", path: "/creations" },
    { 
      icon: Zap, 
      label: "Subscription", 
      subtitle: "Power of Creation",
      color: "text-purple-500", 
      path: "/pricing" 
    },
    { icon: Gift, label: "Referrals", color: "text-accent", path: "/referral" },
    { icon: Settings, label: "Settings", color: "text-primary", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", color: "text-primary", path: "/help" },
    { icon: LogOut, label: "Logout", color: "text-red-500", path: "/" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground">Profile</h1>
      </header>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* User Info Card */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-primary"
                  onClick={() => {
                    // TODO: Add edit profile functionality
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border p-6 text-center">
            <ImageIcon className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{totalCreations}</div>
            <div className="text-sm text-muted-foreground">Total Creations</div>
          </Card>
          <Card className="bg-card border-border p-6 text-center">
            <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{totalCredits}</div>
            <div className="text-sm text-muted-foreground">Available Credits</div>
          </Card>
        </div>

        {/* Credit Breakdown */}
        {credits && (
          <Card className="bg-card border-border p-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-4">Credit Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Signup Credits</span>
                <span className="text-foreground font-medium">{credits.free_signup_credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Credits</span>
                <span className="text-foreground font-medium">{credits.daily_free_credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Referral Credits</span>
                <span className="text-foreground font-medium">{credits.referral_credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subscription Credits</span>
                <span className="text-foreground font-medium">{credits.subscription_credits}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Menu Items */}
        <Card className="bg-card border-border p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => item.label === "Logout" ? handleLogout() : navigate(item.path)}
                className="w-full flex items-center gap-4 p-3 hover:bg-muted/50 rounded-xl transition-colors text-left"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <div className="flex-1">
                  <div className="text-foreground">{item.label}</div>
                  {item.subtitle && (
                    <div className="text-primary text-xs">{item.subtitle}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
