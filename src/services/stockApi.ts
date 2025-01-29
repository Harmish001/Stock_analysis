import { StockData } from '../types';

const ALPHA_VANTAGE_API_KEY = '0T9XCCV15YQZ0U70'; // Replace with your API key

export async function fetchStockData(symbol: string): Promise<StockData[]> {
  try {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('Alpha Vantage API key is not configured');
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      throw new Error('API call frequency exceeded. Please try again later.');
    }

    const timeSeries = data['Time Series (Daily)'];
    
    if (!timeSeries) {
      throw new Error('No data available for this stock symbol');
    }

    return Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseFloat(values['5. volume'])
      }))
      .reverse();
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch stock data');
  }
}