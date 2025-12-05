import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText } = await req.json();
    
    if (!documentText || typeof documentText !== 'string') {
      console.error('Invalid document text provided');
      return new Response(
        JSON.stringify({ error: 'Document text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing document, text length:', documentText.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Du är en expert på geografi och kartor. Din uppgift är att analysera text och extrahera geografiska platser med koordinater.

För varje geografisk plats du hittar i texten ska du:
1. Identifiera platsens namn
2. Kategorisera den (country, city, river, lake, mountain, island, ocean, canal, cape, etc.)
3. Hitta exakta koordinater (latitude och longitude)
4. Sätta en lämplig tolerans (1-5, där 1 är för små platser som städer, 5 för stora områden som länder)

Returnera ENDAST en JSON-array med objekt i detta format:
[
  {
    "id": "unique_id",
    "name": "Platsens namn",
    "category": "country|city|river|lake|mountain|island|ocean|canal|cape",
    "lat": 12.345,
    "lng": -67.890,
    "tolerance": 3
  }
]

Regler:
- Extrahera ALLA geografiska platser som nämns i texten
- Koordinaterna måste vara korrekta
- Om en plats nämns flera gånger, inkludera den bara en gång
- Generera minst 5 frågor om möjligt
- Returnera ENDAST JSON-arrayen, ingen annan text`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analysera denna text och extrahera geografiska platser med koordinater:\n\n${documentText}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'För många förfrågningar. Försök igen om en stund.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Krediter slut. Lägg till mer krediter i ditt konto.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in AI response');
      throw new Error('Inget svar från AI');
    }

    console.log('AI response content:', content);

    // Parse JSON from response, handling potential markdown code blocks
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const questions = JSON.parse(jsonStr);
    
    if (!Array.isArray(questions)) {
      throw new Error('AI returnerade inte en giltig array');
    }

    console.log('Successfully parsed questions:', questions.length);

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-geography function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
