import { User, Image as ImageIcon, Zap, Gift, Settings, HelpCircle, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "Profile", color: "text-primary", path: "/profile" },
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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 max-w-md mx-auto">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground">Menu</h1>
      </header>
      
      <div className="max-w-md mx-auto space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-4 p-4 bg-transparent hover:bg-card/50 rounded-2xl transition-colors text-left"
          >
            <item.icon className={`w-6 h-6 ${item.color}`} />
            <div className="flex-1">
              <div className="text-foreground text-lg">{item.label}</div>
              {item.subtitle && (
                <div className="text-primary text-sm">{item.subtitle}</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-muted-foreground text-xs text-center py-8 mt-12">
        © 2025 Cretera — Designed & Created by Aradhya Garhewal. All rights reserved.
      </footer>
    </div>
  );
};

export default Profile;
