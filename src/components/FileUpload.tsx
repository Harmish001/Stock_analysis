import React from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { StockData } from '../types';

interface Props {
  onDataLoaded: (data: StockData[]) => void;
}

export default function FileUpload({ onDataLoaded }: Props) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const stockData: StockData[] = jsonData.map((row: any) => ({
          date: row.Date,
          open: parseFloat(row.Open),
          high: parseFloat(row.High),
          low: parseFloat(row.Low),
          close: parseFloat(row.Close),
          volume: parseFloat(row.Volume)
        }));

        onDataLoaded(stockData);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please ensure it has the correct format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-full p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-700">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">Excel file with stock data</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
}