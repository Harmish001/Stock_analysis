import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import StockSelector from './components/StockSelector';
import StockChart from './components/StockChart';
import AIAnalysis from './components/AIAnalysis';
import FileUpload from './components/FileUpload';
import { Stock, StockData, AIAnalysis as AIAnalysisType } from './types';
import { fetchStockData } from './services/stockApi';
import { analyzeStockData } from './services/aiService';

function App() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStockSelect = async (stock: Stock) => {
    setIsLoading(true);
    setError(null);
    setSelectedStock(stock);
    
    try {
      const data = await fetchStockData(stock.symbol);
      setStockData(data);
      const aiAnalysis = await analyzeStockData(stock.name, data);
      setAnalysis(aiAnalysis);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      setStockData([]);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileData = async (data: StockData[]) => {
    setIsLoading(true);
    setError(null);
    setStockData(data);
    
    try {
      const aiAnalysis = await analyzeStockData('Uploaded Stock', data);
      setAnalysis(aiAnalysis);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center gap-4 mb-8">
          <Activity className="text-blue-500" size={32} />
          <h1 className="text-2xl font-bold">AI Stock Analysis</h1>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <StockSelector onSelectStock={handleStockSelect} />
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Or Upload Stock Data</h2>
              <FileUpload onDataLoaded={handleFileData} />
            </div>
          </div>

          {(selectedStock || stockData.length > 0) && (
            <div className="lg:col-span-2 space-y-6">
              {selectedStock && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-2">{selectedStock.name}</h2>
                  <p className="text-gray-400">{selectedStock.symbol}</p>
                </div>
              )}

              <StockChart data={stockData} />
              <AIAnalysis analysis={analysis} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;