
import { GoogleGenAI, Type } from "@google/genai";
import { FlightSearchQuery, SearchResponse } from "./types";

export const searchFlightsWithAI = async (query: FlightSearchQuery): Promise<SearchResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Você é o FlyAgente, o assistente de IA definitivo para encontrar passagens aéreas.
    SUA PRIORIDADE MÁXIMA É ENCONTRAR O MENOR PREÇO EM DINHEIRO (CASH) DISPONÍVEL NO PLANETA.

    DADOS DA SOLICITAÇÃO:
    - Origem: ${query.origin}
    - Destino: ${query.destination}
    - Datas: Ida ${query.departureDate} ${query.returnDate ? `e Volta ${query.returnDate}` : '(Somente Ida)'}
    - Passageiros: ${query.adults} Adultos, ${query.children} Crianças (2-11 anos), ${query.infants} Bebês (menos de 2 anos).

    REGRAS DE BUSCA E CÁLCULO:
    1. **Preço em Dinheiro (Foco Principal)**: Varra Google Flights, Skyscanner, OTAs (Decolar, Kayak, Expedia) e sites de companhias Low-Cost. O primeiro resultado DEVE ser a tarifa mais barata em dinheiro encontrada em toda a web.
    2. **Lógica de Bebês (Infants)**: Para bebês menores de 2 anos (que viajam no colo), considere que em voos nacionais eles pagam apenas taxas. Em internacionais, geralmente 10% da tarifa. Calcule o TOTAL final para o grupo completo.
    3. **Tarifas Award/Milhas**: Procure por emissões com milhas (Smiles, TudoAzul, Latam Pass, TAP Miles&Go) que possam bater o preço em dinheiro.
    4. **Qualidade do Conteúdo**: Gere descrições detalhadas e úteis. Explique por que aquela é a melhor oferta (ex: menor preço histórico, voo direto, etc). Isso é vital para o SEO do site.

    RETORNE EM JSON:
    - 3 ofertas: 1. Menor preço absoluto em dinheiro; 2. Melhor opção em milhas; 3. Melhor custo-benefício em cabine superior (Executiva/Premium).

    {
      "deals": [
        {
          "type": "cheapest_cash" | "cheapest_miles" | "most_expensive",
          "airline": "Nome da Cia",
          "price": "R$ X.XXX,XX",
          "description": "Explicação detalhada sobre a rota, tempo de voo e por que este preço é imbatível. Mencione explicitamente a economia para os ${query.infants} bebês.",
          "howToBuy": "Passo a passo exato para garantir este preço agora.",
          "link": "Link direto para o buscador ou companhia.",
          "isTotalWithTaxes": true
        }
      ],
      "summary": "Resumo estratégico: Vale a pena comprar agora? Existe previsão de queda? Dicas locais para o destino ${query.destination}."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const result = JSON.parse(text) as SearchResponse;
    return {
      ...result,
      groundingChunks: groundingChunks
    };
  } catch (error) {
    console.error("Erro na varredura FlyAgente:", error);
    throw new Error("Não conseguimos realizar a varredura global agora. Por favor, tente novamente em instantes.");
  }
};
