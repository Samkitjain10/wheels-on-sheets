export interface LocationSuggestion {
  id: string;
  text: string;
  place_name: string;
  coordinates?: [number, number];
  address?: string;
  source?: 'serpapi';
}
