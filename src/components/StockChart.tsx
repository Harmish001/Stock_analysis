import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Area, ComposedChart, Bar
} from 'recharts';
import { StockData } from '../types';

interface Props {
  data: StockData[];
}

export default function StockChart({ data }: Props) {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1M');
  
  const timeframes = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    'ALL': data.length
  };

  const displayData = data.slice(-timeframes[timeframe]);

  // Calculate moving averages
  const withMA = displayData.map((item, index) => {
    const ma20 = index >= 19 ? 
      data.slice(index - 19, index + 1).reduce((sum, d) => sum + d.close, 0) / 20 : 
      null;
    const ma50 = index >= 49 ? 
      data.slice(index - 49, index + 1).reduce((sum, d) => sum + d.close, 0) / 50 : 
      null;
    return {
      ...item,
      ma20,
      ma50,
      volumeMA: index >= 9 ?
        data.slice(index - 9, index + 1).reduce((sum, d) => sum + d.volume, 0) / 10 :
        null
    };
  });

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Price & Volume Analysis</h3>
        <div className="flex gap-2">
          {Object.keys(timeframes).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as keyof typeof timeframes)}
              className={`px-3 py-1 rounded ${
                timeframe === tf 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="70%">
          <ComposedChart data={withMA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              stroke="#9CA3AF"
              domain={['auto', 'auto']}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
              name="Price"
            />
            <Line 
              type="monotone" 
              dataKey="ma20" 
              stroke="#10B981" 
              strokeWidth={1.5}
              dot={false}
              name="MA20"
            />
            <Line 
              type="monotone" 
              dataKey="ma50" 
              stroke="#F59E0B" 
              strokeWidth={1.5}
              dot={false}
              name="MA50"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="25%">
          <ComposedChart data={withMA} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              stroke="#9CA3AF"
              domain={['auto', 'auto']}
              tickFormatter={(value) => (value / 1000000).toFixed(1) + 'M'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff'
              }}
            />
            <Bar 
              dataKey="volume" 
              fill="#3B82F6" 
              opacity={0.3}
              name="Volume"
            />
            <Line
              type="monotone"
              dataKey="volumeMA"
              stroke="#EC4899"
              strokeWidth={1.5}
              dot={false}
              name="Volume MA10"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}