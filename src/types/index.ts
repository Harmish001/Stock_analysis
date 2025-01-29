export interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AIAnalysis {
  summary: string;
  technicalPatterns: string[];
  marketSignals: string[];
  riskAssessment: string;
  shortTermOutlook: string;
  longTermOutlook: string;
  recommendation: string;
  confidence: number;
}