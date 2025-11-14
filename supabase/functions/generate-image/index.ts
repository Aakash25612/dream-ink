import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const stabilityApiKey = Deno.env.get('STABILITY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    console.log('Generating image with Stability AI, prompt:', prompt);

    if (!stabilityApiKey) {
      throw new Error('STABILITY_API_KEY not configured');
    }

    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-diffusion-xl-lightning',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stabilityApiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'image/png',
        },
        body: JSON.stringify({
          model: 'stable-diffusion-xl-lightning',
          prompt: prompt,
          output_format: 'png'
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Stability AI error:', response.status, error);
      throw new Error(`Stability AI error: ${error}`);
    }

    // Convert binary PNG response to base64
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = btoa(
      String.fromCharCode(...new Uint8Array(imageBuffer))
    );
    
    console.log('Successfully generated image, base64 length:', imageBase64.length);

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${imageBase64}` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
