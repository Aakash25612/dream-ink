import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Zap, Gift, Image as ImageIcon, User, Camera, Upload, MoreVertical, Settings, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useCredits } from "@/hooks/useCredits";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { totalCredits, useCredit, loading: creditsLoading } = useCredits();
  
  // Only check referral rewards once on mount, with debounce
  useEffect(() => {
    let isMounted = true;
    const checkReferralReward = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      // Only fetch if user might have pending rewards - use limit 1 for efficiency
      const { data: recentReferrals } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', user.id)
        .eq('credits_awarded', true)
        .gte('completed_at', new Date(Date.now() - 5000).toISOString())
        .limit(1);

      if (isMounted && recentReferrals && recentReferrals.length > 0) {
        toast({
          title: "Cretera Connect Reward Unlocked",
          description: "You've earned 2 credits from a referral!",
        });
      }
    };

    checkReferralReward();
    return () => { isMounted = false; };
  }, [toast]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        toast({
          title: "Image uploaded",
          description: "Reference image added to your prompt",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter what you want to create",
        variant: "destructive"
      });
      return;
    }

    // Check and use credits
    const hasCredits = await useCredit();
    if (!hasCredits) {
      // Show upgrade button
      toast({
        title: "You've hit your creative limit.",
        description: "Upgrade to create without limits.",
        variant: "destructive",
        action: (
          <Button 
            onClick={() => navigate("/pricing")} 
            variant="outline" 
            size="sm"
            className="bg-primary text-primary-foreground"
          >
            Unlock Power Of Creation
          </Button>
        ),
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch(`https://wahdjskwegycbrxiyjjg.supabase.co/functions/v1/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          referenceImage: uploadedImage
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Save to database (auto-save)
      const { data: savedCreation, error: dbError } = await supabase
        .from('creations')
        .insert({
          prompt: prompt.trim(),
          image_url: data.image,
          user_id: user?.id || null
        })
        .select()
        .single();
      
      if (dbError) {
        console.error('Failed to save to database:', dbError);
      }
      
      toast({
        title: "Image Generated",
        description: "Your creation is ready!"
      });

      // Reset and navigate to created image page
      const creationId = savedCreation?.id;
      setPrompt("");
      setUploadedImage(null);
      navigate("/created-image", { 
        state: { 
          imageUrl: data.image, 
          prompt: prompt.trim(),
          creationId 
        } 
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const features = [{
    icon: Globe,
    title: "Cretera Space",
    description: "Experience Infinite Imagination",
    color: "text-primary",
    onClick: () => navigate("/home")
  }, {
    icon: Zap,
    title: "Power of Creation",
    description: "Unlock Infinite Creativity",
    color: "text-purple-500",
    onClick: () => navigate("/pricing")
  }, {
    icon: Gift,
    title: "Cretera Connect",
    description: "Invite and Earn Rewards",
    color: "text-accent",
    onClick: () => navigate("/referral")
  }, {
    icon: ImageIcon,
    title: "My Creations",
    description: "Access All Your Creations",
    color: "text-cyan-500",
    onClick: () => navigate("/creations")
  }];
  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-card border-border z-50">
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/help")}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/");
              }}
              className="text-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center">
          <User className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Branding */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] to-[hsl(217_91%_60%)] bg-clip-text text-transparent">
            CRETERA
          </h1>
          {!creditsLoading && (
            <p className="text-lg text-foreground/70">
              Credits: {totalCredits}
            </p>
          )}
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl space-y-4 mb-8">
          <div className="relative">
            <Input 
              placeholder="What do you wanna create?" 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              onKeyDown={e => e.key === "Enter" && !isGenerating && handleCreate()} 
              className="bg-card border-2 border-primary/30 text-foreground placeholder:text-muted-foreground rounded-2xl h-14 pl-12 text-base focus:border-primary"
              disabled={isGenerating}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                    <span className="text-sm">+</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => cameraInputRef.current?.click()}>
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {uploadedImage && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-primary">
              <img src={uploadedImage} alt="Reference" className="w-full h-full object-cover" />
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground text-xs"
              >
                ×
              </button>
            </div>
          )}

          <Button 
            onClick={handleCreate} 
            disabled={isGenerating || creditsLoading} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-2xl"
          >
            {isGenerating ? "Creating..." : "Create"}
          </Button>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Loading Animation - shown during generation */}
        {isGenerating && (
          <div className="w-full max-w-2xl mb-8">
            <LoadingAnimation />
          </div>
        )}
      </main>

      {/* Bottom Navigation Footer */}
      <footer className="border-t border-border bg-card/95 backdrop-blur-sm">
        <div className="flex justify-around items-center max-w-4xl mx-auto py-2 px-4">
          {features.map((feature, index) => (
            <button 
              key={index} 
              onClick={feature.onClick} 
              className="flex flex-col items-center justify-center space-y-1 py-2 px-3 hover:bg-muted/50 rounded-lg transition-colors min-w-[70px]"
            >
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
              <span className="text-[10px] text-foreground/90 font-medium text-center leading-tight">
                {feature.title}
              </span>
            </button>
          ))}
        </div>
      </footer>
    </div>;
};
export default Home;