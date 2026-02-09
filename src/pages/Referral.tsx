import { Button } from "@/components/ui/button";
import { Gift, ArrowLeft, Share2, Users, Trophy, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const Referral = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({ total: 0, credits: 0 });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        fetchReferralCode(data.user.id);
        fetchReferralStats(data.user.id);
      }
    });
  }, []);

  const fetchReferralCode = async (uid: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", uid)
      .maybeSingle();
    if (error) {
      console.error("Failed to fetch referral code:", error);
      toast({ title: "Error", description: "Could not load your referral code.", variant: "destructive" });
      return;
    }
    if (data?.referral_code) {
      setReferralCode(data.referral_code);
    }
  };

  const fetchReferralStats = async (uid: string) => {
    const { data } = await supabase.from("referrals").select("*").eq("referrer_id", uid);
    if (data) {
      setReferralStats({
        total: data.length,
        credits: data.filter(r => r.credits_awarded).length * 2
      });
    }
  };

  const handleShare = async () => {
    const shareText = `Join Cretera and create amazing AI images! 🎨✨ Use my referral code: ${referralCode}`;
    try {
      if (navigator.share) {
        const shareData = { title: 'Join Cretera', text: shareText };
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast({ title: "Shared!", description: "Earn 2 credits when your friend signs up!" });
          return;
        }
      }
      await navigator.clipboard.writeText(referralCode);
      toast({ title: "Code Copied!", description: "Share your code to earn 2 credits when friends sign up!" });
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(referralCode);
        toast({ title: "Code Copied!", description: "Share your referral code with friends!" });
      } catch {
        toast({ title: "Error", description: "Could not copy code.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] p-4">
      <header className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
        <button onClick={() => navigate("/home")} className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl text-foreground">Cretera Connect</h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{referralStats.total}</div>
            <div className="text-sm text-muted-foreground">Friends Invited</div>
          </Card>
          <Card className="bg-card border-border p-6 text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{referralStats.credits}</div>
            <div className="text-sm text-muted-foreground">Credits Earned</div>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-8 text-center space-y-4">
          <Gift className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-2xl font-semibold text-foreground">Spread Power Of Creation</h2>
          <p className="text-foreground/80">Invite your friends to Cretera and earn rewards.</p>
        </Card>

        <Card className="bg-card border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Your Referral Code</h3>
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-muted/30 rounded-lg px-6 py-4 text-center">
              <span className="text-2xl font-bold tracking-widest text-foreground">{referralCode}</span>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(referralCode);
                toast({ title: "Copied!", description: "Referral code copied to clipboard" });
              }}
              variant="outline"
              className="h-14 px-4 rounded-lg"
            >
              <Copy className="w-5 h-5" />
            </Button>
          </div>
          <Button
            onClick={handleShare}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Code
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Friends enter this code when signing up to earn you credits!
          </p>
        </Card>

        <Card className="bg-card border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">How It Works</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold flex-shrink-0">1</div>
              <div>
                <div className="font-medium text-foreground">Share Your Code</div>
                <div className="text-sm text-muted-foreground">Copy and send your unique referral code</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold flex-shrink-0">2</div>
              <div>
                <div className="font-medium text-foreground">Friend Signs Up</div>
                <div className="text-sm text-muted-foreground">They enter your code during sign up</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold flex-shrink-0">3</div>
              <div>
                <div className="font-medium text-foreground">You Get Credits!</div>
                <div className="text-sm text-muted-foreground">You receive 2 free image credits when they sign up</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Referral;
