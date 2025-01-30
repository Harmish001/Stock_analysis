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
  technicalPatterns: Array<{name:string, signal:string, analysis:string, type:string, description:string,details:string}>;
  marketSignals: Array<{name:string, pattern:string, description:string, type:string,details:string}>;
  riskAssessment: string;
  shortTermOutlook: string;
  longTermOutlook: string;
  recommendation: string;
  confidence: number;
  tradeStrategy: string
}