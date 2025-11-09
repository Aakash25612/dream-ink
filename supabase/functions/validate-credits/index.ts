import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !credits) {
      console.error('Error fetching credits:', creditsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch credits' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if subscription has expired
    if (credits.subscription_end_date && new Date(credits.subscription_end_date) <= new Date()) {
      await supabase.rpc('expire_subscription_credits');
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Subscription expired',
          code: 'SUBSCRIPTION_EXPIRED'
        }), 
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate total available credits
    const totalCredits = 
      credits.free_signup_credits + 
      credits.daily_free_credits + 
      credits.referral_credits + 
      (credits.subscription_end_date && new Date(credits.subscription_end_date) > new Date() 
        ? credits.subscription_credits 
        : 0);

    // Check if user has any credits
    if (totalCredits <= 0) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'No credits available',
          code: 'NO_CREDITS'
        }), 
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check daily limit for subscription users
    if (credits.subscription_credits > 0 && credits.subscription_end_date && new Date(credits.subscription_end_date) > new Date()) {
      const today = new Date().toISOString().split('T')[0];
      const lastUsage = credits.last_usage_date;

      // Check if daily limit reached
      if (lastUsage === today && credits.used_credits_today >= credits.daily_limit) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'Daily limit reached',
            code: 'DAILY_LIMIT_REACHED',
            resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
          }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Credits are valid
    return new Response(
      JSON.stringify({ 
        valid: true, 
        totalCredits,
        dailyLimit: credits.daily_limit,
        usedToday: credits.used_credits_today || 0
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-credits:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
