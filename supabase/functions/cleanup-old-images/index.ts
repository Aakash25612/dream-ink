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

    console.log('Starting cleanup of old images...');

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.toISOString();

    console.log(`Deleting images created before: ${cutoffDate}`);

    // Delete creations older than 7 days
    const { data: deletedImages, error, count } = await supabase
      .from('creations')
      .delete()
      .lt('created_at', cutoffDate)
      .select('id');

    if (error) {
      console.error('Error deleting old images:', error);
      throw error;
    }

    const deletedCount = deletedImages?.length || 0;
    console.log(`Successfully deleted ${deletedCount} images older than 7 days`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Deleted ${deletedCount} images older than 7 days`,
        deletedCount,
        cutoffDate
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cleanup function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
