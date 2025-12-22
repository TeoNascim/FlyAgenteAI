
export interface FlightSearchQuery {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number; // Bebês menores de 2 anos
}

export interface FlightDeal {
  type: 'cheapest_cash' | 'cheapest_miles' | 'most_expensive';
  airline: string;
  price: string;
  currency: string;
  description: string;
  howToBuy: string;
  link: string;
  isTotalWithTaxes: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResponse {
  deals: FlightDeal[];
  summary: string;
  groundingChunks?: GroundingChunk[];
}
