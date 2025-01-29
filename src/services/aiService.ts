import { GoogleGenerativeAI } from '@google/generative-ai';
import { StockData } from '../types';

const GEMINI_API_KEY = 'AIzaSyDdHnwj68MNPkr2ptqCD6qkE0hxQkEeAAg'; // Add your Gemini API key here
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function prepareStockDataForAnalysis(data: StockData[]) {
  const latestPrice = data[data.length - 1].close;
  const startPrice = data[0].close;
  const priceChange = ((latestPrice - startPrice) / startPrice) * 100;
  
  // Calculate moving averages
  const ma20 = calculateMA(data, 20);
  const ma50 = calculateMA(data, 50);
  
  // Calculate volume analysis
  const averageVolume = data.reduce((sum, day) => sum + day.volume, 0) / data.length;
  const recentVolumeAvg = data.slice(-5).reduce((sum, day) => sum + day.volume, 0) / 5;
  const volumeChange = ((recentVolumeAvg - averageVolume) / averageVolume) * 100;
  
  // Calculate price momentum
  const momentum = calculateMomentum(data);
  
  // Calculate volatility
  const volatility = calculateVolatility(data);

  // Identify support and resistance levels
  const { support, resistance } = findSupportResistance(data);

  return {
    priceChange: priceChange.toFixed(2),
    averageVolume: averageVolume.toFixed(0),
    recentVolumeChange: volumeChange.toFixed(2),
    volatility: volatility.toFixed(2),
    momentum: momentum.toFixed(2),
    ma20: ma20.toFixed(2),
    ma50: ma50.toFixed(2),
    support: support.toFixed(2),
    resistance: resistance.toFixed(2),
    daysAnalyzed: data.length,
    currentPrice: latestPrice.toFixed(2)
  };
}

function calculateMA(data: StockData[], period: number) {
  if (data.length < period) return 0;
  const prices = data.slice(-period).map(d => d.close);
  return prices.reduce((sum, price) => sum + price, 0) / period;
}

function calculateMomentum(data: StockData[]) {
  const periods = [1, 5, 10, 20];
  return periods.reduce((sum, period) => {
    if (data.length < period) return sum;
    const currentPrice = data[data.length - 1].close;
    const pastPrice = data[data.length - 1 - period].close;
    return sum + ((currentPrice - pastPrice) / pastPrice) * 100;
  }, 0) / periods.length;
}

function calculateVolatility(data: StockData[]) {
  const returns = data.slice(1).map((day, i) => 
    (day.close - data[i].close) / data[i].close
  );
  const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const squaredDiffs = returns.map(ret => Math.pow(ret - meanReturn, 2));
  return Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / returns.length) * 100;
}

function findSupportResistance(data: StockData[]) {
  const prices = data.map(d => d.close);
  const sorted = [...prices].sort((a, b) => a - b);
  const support = sorted[Math.floor(sorted.length * 0.2)];
  const resistance = sorted[Math.floor(sorted.length * 0.8)];
  return { support, resistance };
}

export async function analyzeStockData(stockName: string, data: StockData[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const metrics = prepareStockDataForAnalysis(data);
  
  const prompt = `Analyze this detailed stock market data for ${stockName}:
    - Price change: ${metrics.priceChange}%
    - Current price: ${metrics.currentPrice}
    - 20-day MA: ${metrics.ma20}
    - 50-day MA: ${metrics.ma50}
    - Support level: ${metrics.support}
    - Resistance level: ${metrics.resistance}
    - Average daily volume: ${metrics.averageVolume}
    - Recent volume change: ${metrics.recentVolumeChange}%
    - Price momentum: ${metrics.momentum}%
    - Volatility: ${metrics.volatility}%
    - Days analyzed: ${metrics.daysAnalyzed}

    Please provide a comprehensive analysis including:
    1. A detailed summary of the stock's performance and current market position
    2. Technical analysis patterns identified (moving averages, support/resistance, volume patterns)
    3. Key market signals and indicators
    4. Risk assessment
    5. Short-term and long-term trading recommendations
    6. A confidence score (0-100) based on the strength of the patterns and signals

    Format the response as JSON with these keys: 
    - summary (detailed market analysis)
    - technicalPatterns (array of identified patterns)
    - marketSignals (array of key signals)
    - riskAssessment (string)
    - shortTermOutlook (string)
    - longTermOutlook (string)
    - recommendation (detailed trading strategy)
    - confidence (number)`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysisText = response.text().replace(/^```[ \t]*json[ \t]*\n?/i, '').replace(/\n?```$/, '');
    console.log("analysisText",analysisText)
    return JSON.parse(analysisText);
  } catch (error) {
    console.error('Error analyzing stock data:', error);
    throw error;
  }
}

// export { analyzeStockData }