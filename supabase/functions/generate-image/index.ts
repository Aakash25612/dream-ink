import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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
    const { prompt, referenceImage } = await req.json();

    console.log('Generating image with Stability AI, prompt:', prompt, 'hasReference:', !!referenceImage);

    if (!stabilityApiKey) {
      throw new Error('STABILITY_API_KEY not configured');
    }

    // Create form data
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'png');

    // If reference image provided, use image-to-image endpoint
    let apiUrl = 'https://api.stability.ai/v2beta/stable-image/generate/core';
    
    if (referenceImage) {
      // Convert base64 to blob for image-to-image
      const base64Data = referenceImage.split(',')[1];
      const decodedBytes = base64Decode(base64Data);
      const blob = new Blob([new Uint8Array(decodedBytes)], { type: 'image/png' });
      
      formData.append('image', blob, 'reference.png');
      formData.append('strength', '0.7'); // Control how much the output differs from input
      formData.append('mode', 'image-to-image'); // Explicitly set mode for image-to-image
      apiUrl = 'https://api.stability.ai/v2beta/stable-image/generate/sd3';
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stabilityApiKey}`,
        'Accept': 'image/*',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Stability AI error:', response.status, error);
      throw new Error(`Stability AI error: ${error}`);
    }

    // Convert binary PNG response to base64 (handle large images)
    const imageBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(imageBuffer);
    
    // Use chunks to avoid call stack size exceeded
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunks
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode(...chunk);
    }
    const imageBase64 = btoa(binary);
    
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
