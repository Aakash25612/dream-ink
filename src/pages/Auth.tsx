import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail, Lock, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

// Test credentials for Play Store review
const TEST_EMAIL = "a12345@gmail.com";
const TEST_PASSWORD = "a12345";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showTestLogin, setShowTestLogin] = useState(false);
  const [showReferralStep, setShowReferralStep] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === 'SIGNED_IN') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_first_time')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_first_time) {
          // New user - show referral code step before proceeding
          setNewUserId(session.user.id);
          setShowReferralStep(true);
          toast.success("Account created! Welcome to Cretera.");
        } else {
          toast.success("Signed in successfully!");
          navigate("/splash", { replace: true });
        }
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_first_time')
          .eq('id', session.user.id)
          .single();
        if (profile?.is_first_time) {
          setNewUserId(session.user.id);
          setShowReferralStep(true);
        } else {
          navigate("/splash", { replace: true });
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

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
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

  const handleTestLogin = async () => {
    if (email.trim().toLowerCase() !== TEST_EMAIL || password !== TEST_PASSWORD) {
      toast.error("Invalid test credentials");
      return;
    }

    setIsLoading(true);
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            options: {
              emailRedirectTo: `${window.location.origin}/auth`,
            },
          });
          if (signUpError) throw signUpError;

          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
          });
          if (retryError) throw retryError;
        } else {
          throw signInError;
        }
      }

      toast.success("Test login successful!");
    } catch (error: any) {
      toast.error(error.message || "Test login failed");
      console.error("Test login error:", error);
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
      // Navigation handled by onAuthStateChange
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
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
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

  const handleReferralSubmit = async () => {
    if (!referralCode.trim() || !newUserId) {
      handleSkipReferral();
      return;
    }

    setIsLoading(true);
    try {
      // Look up the referrer by their referral code
      const { data: referrer, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode.trim().toUpperCase())
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (!referrer) {
        toast.error("Invalid referral code. Please check and try again.");
        setIsLoading(false);
        return;
      }

      if (referrer.id === newUserId) {
        toast.error("You can't use your own referral code!");
        setIsLoading(false);
        return;
      }

      // Process the referral
      const { error: referralError } = await supabase.rpc('complete_referral', {
        p_referrer_id: referrer.id,
        p_referred_user_id: newUserId,
      });

      if (referralError) {
        console.error("Referral error:", referralError);
        toast.error("Could not apply referral code, but your account is ready!");
      } else {
        toast.success("Referral code applied! Bonus credits awarded.");
      }

      // Mark as no longer first time and navigate
      await supabase.from('profiles').update({ is_first_time: false }).eq('id', newUserId);
      navigate("/intro", { replace: true });
    } catch (error) {
      console.error("Referral submit error:", error);
      toast.error("Something went wrong. Skipping referral.");
      await supabase.from('profiles').update({ is_first_time: false }).eq('id', newUserId!);
      navigate("/intro", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipReferral = async () => {
    if (newUserId) {
      await supabase.from('profiles').update({ is_first_time: false }).eq('id', newUserId);
    }
    navigate("/intro", { replace: true });
  };

  // Referral code step for new users
  if (showReferralStep) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col p-4">
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-xl mx-auto w-full px-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome to Cretera!</h1>
            <p className="text-muted-foreground text-lg">
              Got a referral code from a friend? Enter it below to get bonus credits.
            </p>
          </div>

          <div className="w-full max-w-md space-y-6">
            <div className="relative">
              <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter referral code (e.g. CRT-XXXXXX)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="pl-12 h-14 text-lg bg-card border-2 border-primary/30 rounded-full"
                disabled={isLoading}
                maxLength={10}
                autoFocus
              />
            </div>

            <Button
              onClick={handleReferralSubmit}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-full"
              disabled={isLoading || !referralCode.trim()}
            >
              {isLoading ? "Applying..." : "Apply Referral Code"}
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkipReferral}
              className="w-full text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(220_60%_15%),hsl(220_40%_5%))] flex flex-col p-4">
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

            {/* Test Login Section for Play Store Review */}
            <div className="pt-4 border-t border-border/30">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full text-muted-foreground border-border/50 rounded-full"
                onClick={() => setShowTestLogin(!showTestLogin)}
              >
                Test Login
              </Button>

              {showTestLogin && (
                <div className="mt-4 space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter test password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 text-lg bg-card border-2 border-border/30 rounded-full"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    className="w-full bg-muted hover:bg-muted/80 text-foreground text-lg py-6 rounded-full"
                    disabled={isLoading || !email || !password}
                    onClick={handleTestLogin}
                  >
                    {isLoading ? "Logging in..." : "Login with Test Credentials"}
                  </Button>
                </div>
              )}
            </div>
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
    </div>
  );
};

export default Auth;
