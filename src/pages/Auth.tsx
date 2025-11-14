import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
const emailSchema = z.string().email("Please enter a valid email address");

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  useEffect(() => {
    // Listen for auth changes first
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === 'SIGNED_IN') {
        // Check if this is a first-time user
        const {
          data: profile
        } = await supabase.from('profiles').select('is_first_time').eq('id', session.user.id).single();
        toast.success("Signed in successfully!");

        // Navigate to intro screen for first-time users, splash for returning users
        if (profile?.is_first_time) {
          // Update is_first_time to false
          await supabase.from('profiles').update({
            is_first_time: false
          }).eq('id', session.user.id);
          navigate("/intro", {
            replace: true
          });
        } else {
          navigate("/splash", {
            replace: true
          });
        }
      }
    });

    // Then check if user is already logged in
    supabase.auth.getSession().then(async ({
      data: {
        session
      }
    }) => {
      if (session) {
        // For already logged in users, show splash screen
        const {
          data: profile
        } = await supabase.from('profiles').select('is_first_time').eq('id', session.user.id).single();
        if (profile?.is_first_time) {
          navigate("/intro", {
            replace: true
          });
        } else {
          navigate("/splash", {
            replace: true
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      emailSchema.parse(email);

      const urlParams = new URLSearchParams(window.location.search);
      const referrerId = urlParams.get('ref');
      const redirectTo = `${window.location.origin}/auth${referrerId ? `?ref=${referrerId}` : ''}`;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo,
          data: referrerId ? { referrer_id: referrerId } : undefined
        },
      });

      if (error) throw error;

      setEmailSent(true);
      setResendCooldown(60);
      toast.success("Check your email for the 6-digit code!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to send login code. Please try again.");
        console.error("Error sending login code:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      toast.success("Successfully signed in!");
    } catch (error: any) {
      toast.error(error.message || "Invalid code. Please try again.");
      console.error("Error verifying OTP:", error);
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const referrerId = urlParams.get('ref');
      const redirectTo = `${window.location.origin}/auth${referrerId ? `?ref=${referrerId}` : ''}`;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo,
          data: referrerId ? { referrer_id: referrerId } : undefined
        },
      });

      if (error) throw error;

      setResendCooldown(60);
      toast.success("New code sent to your email!");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
      console.error("Error resending code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDifferentEmail = () => {
    setEmailSent(false);
    setOtp("");
    setEmail("");
  };
  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/")} className="w-10 h-10 rounded-full bg-card hover:bg-card/80 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-xl mx-auto w-full px-4">
        {/* Branding */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[hsl(200_100%_70%)] to-[hsl(217_91%_60%)] bg-clip-text text-transparent">
            CRETERA
          </h1>
          <p className="text-2xl text-foreground/90">Sign in to start creation.</p>
        </div>

        {/* Email Sign In Form */}
        {!emailSent ? (
          <form onSubmit={handleEmailSignIn} className="w-full max-w-md space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 text-lg bg-card border-2 border-primary/30 rounded-full"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Code"}
            </Button>
          </form>
        ) : (
          <div className="w-full max-w-md space-y-6">
            <div className="bg-card/50 border-2 border-primary/30 rounded-2xl p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-foreground">Enter verification code</h2>
                <p className="text-muted-foreground">
                  We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  onComplete={handleVerifyOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  onClick={handleVerifyOtp}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-full"
                  disabled={isVerifying || otp.length !== 6}
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="flex flex-col items-center space-y-3 w-full">
                  <Button
                    variant="ghost"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {resendCooldown > 0 
                      ? `Resend code in ${resendCooldown}s` 
                      : "Resend code"}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={handleUseDifferentEmail}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Use a different email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>;
};
export default Auth;