import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground">Settings</h1>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-muted-foreground text-lg">Settings page coming soon.</p>
      </div>

      {/* Footer */}
      <footer className="text-muted-foreground text-xs text-center py-8 mt-12">
        © 2025 Cretera — Designed & Created by Aradhya Garhewal. All rights reserved.
      </footer>
    </div>
  );
};

export default Settings;
