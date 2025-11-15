import { ArrowLeft, Bell, Palette, Shield, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
const Settings = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: true,
    autoSave: true
  });
  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved."
    });
  };
  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground">Settings</h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Notifications */}
        <Card className="bg-card border-border p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-foreground">Push Notifications</div>
                <div className="text-sm text-muted-foreground">Get notified about your creations</div>
              </div>
              <Switch checked={settings.notifications} onCheckedChange={() => handleToggle("notifications")} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-foreground">Email Updates</div>
                <div className="text-sm text-muted-foreground">Receive weekly progress emails</div>
              </div>
              <Switch checked={settings.emailUpdates} onCheckedChange={() => handleToggle("emailUpdates")} />
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="bg-card border-border p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-foreground">Auto-Save Creations</div>
                <div className="text-sm text-muted-foreground">Automatically save generated images</div>
              </div>
              <Switch checked={settings.autoSave} onCheckedChange={() => handleToggle("autoSave")} />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        

        {/* Danger Zone */}
        
      </div>
    </div>;
};
export default Settings;