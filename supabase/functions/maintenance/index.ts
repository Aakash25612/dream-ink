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

    console.log('Starting maintenance tasks...');

    // 1. Reset daily credits counter for all users
    console.log('Resetting daily credits...');
    await supabase.rpc('reset_daily_credits');

    // 2. Expire subscriptions that have ended
    console.log('Expiring subscriptions...');
    await supabase.rpc('expire_subscription_credits');

    // 3. Grant daily credits for users in first 7 days
    console.log('Granting daily credits for new users...');
    const today = new Date().toISOString().split('T')[0];
    
    // Get all profiles created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, signup_date')
      .gte('signup_date', sevenDaysAgo.toISOString());

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else if (recentProfiles) {
      console.log(`Found ${recentProfiles.length} users within first 7 days`);
      
      // Update daily credits for each user
      for (const profile of recentProfiles) {
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            daily_free_credits: 1,
            daily_free_credits_date: today
          })
          .eq('user_id', profile.id)
          .neq('daily_free_credits_date', today); // Only if not already updated today

        if (updateError) {
          console.error(`Error updating credits for user ${profile.id}:`, updateError);
        }
      }
    }

    console.log('Maintenance tasks completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Maintenance completed',
        tasksCompleted: [
          'Daily credits reset',
          'Subscriptions expired',
          'New user credits granted'
        ]
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in maintenance function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
