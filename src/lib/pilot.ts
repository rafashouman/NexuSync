export const PILOT_MODALITIES = [
  "agricola",
  "executivo",
  "comercial",
  "helicoptero",
  "instrucao",
] as const;

export interface PilotLeadData {
  name: string;
  whatsapp: string;
  modality: (typeof PILOT_MODALITIES)[number];
  capitalInsured: number;
  consent: true;
}

export interface TarotLeadData {
  name: string;
  whatsapp: string;
  chosenDeck: string;
  question: string;
  drawnCards: string[];
  consent: true;
}
