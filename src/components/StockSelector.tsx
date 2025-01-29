import React from 'react';
import { Search } from 'lucide-react';
import { Stock } from '../types';

const popularStocks: Stock[] = [
  { symbol: 'RELIANCE.BSE', name: 'Reliance Industries', sector: 'Conglomerate' },
  { symbol: 'TCS.BSE', name: 'Tata Consultancy Services', sector: 'Technology' },
  { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'INFY.BSE', name: 'Infosys', sector: 'Technology' },
  { symbol: 'BHARTIARTL.BSE', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'ITC.BSE', name: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'HINDUNILVR.BSE', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'SBIN.BSE', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'KOTAKBANK.BSE', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'LT.BSE', name: 'Larsen & Toubro', sector: 'Engineering' },
  { symbol: 'MARUTI.BSE', name: 'Maruti Suzuki', sector: 'Automotive' },
  { symbol: 'ASIANPAINT.BSE', name: 'Asian Paints', sector: 'Consumer Goods' },
  { symbol: 'WIPRO.BSE', name: 'Wipro', sector: 'Technology' },
  { symbol: 'HCLTECH.BSE', name: 'HCL Technologies', sector: 'Technology' }
];

interface Props {
  onSelectStock: (stock: Stock) => void;
}

export default function StockSelector({ onSelectStock }: Props) {
  const [search, setSearch] = React.useState('');
  const [selectedSector, setSelectedSector] = React.useState<string | null>(null);
  
  const sectors = Array.from(new Set(popularStocks.map(stock => stock.sector))).sort();
  
  const filteredStocks = popularStocks.filter(stock => 
    (selectedSector ? stock.sector === selectedSector : true) &&
    (search ? 
      stock.name.toLowerCase().includes(search.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(search.toLowerCase())
      : true
    )
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSector(null)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedSector === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedSector === sector
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>
      
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredStocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => onSelectStock(stock)}
            className="w-full p-4 text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white">{stock.name}</h3>
                <p className="text-sm text-gray-400">{stock.symbol}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                {stock.sector}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}