import { ArrowLeft, Bell, Palette, Shield, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: true,
    autoSave: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center"
        >
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
              <Switch
                checked={settings.notifications}
                onCheckedChange={() => handleToggle("notifications")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-foreground">Email Updates</div>
                <div className="text-sm text-muted-foreground">Receive weekly progress emails</div>
              </div>
              <Switch
                checked={settings.emailUpdates}
                onCheckedChange={() => handleToggle("emailUpdates")}
              />
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
              <Switch
                checked={settings.autoSave}
                onCheckedChange={() => handleToggle("autoSave")}
              />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-card border-border p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-foreground">Privacy Settings</div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Coming Soon</span>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card border-red-500/20 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
          </div>
          
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              toast({
                title: "Are you sure?",
                description: "This action cannot be undone.",
                variant: "destructive"
              });
            }}
          >
            Delete Account
          </Button>
          
          <p className="text-xs text-muted-foreground">
            This will permanently delete your account and all your creations.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
