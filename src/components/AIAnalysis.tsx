import React from 'react';
import { Brain, TrendingUp, AlertCircle, BarChart2, Clock, Bot } from 'lucide-react';
import { AIAnalysis } from '../types';

interface Props {
  analysis: AIAnalysis | null;
  isLoading: boolean;
}

export default function AIAnalysisComponent({ analysis, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="animate-pulse w-full bg-gray-800 rounded-lg p-6">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (!analysis) return null;
  console.log("analysis", analysis)

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-start gap-4">
        <Brain className="text-blue-500 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Market Analysis</h3>
          <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <Bot className="text-blue-500 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Trade Strategy</h3>
          <p className="text-gray-300 leading-relaxed">{analysis.tradeStrategy}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4">
          <BarChart2 className="text-green-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Technical Patterns</h3>
            <ul className="space-y-2">
              {analysis.technicalPatterns?.map((pattern, index) => (
                <li key={index} className="text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {pattern.name || pattern.signal || pattern.type} : {pattern.analysis || pattern.signal || pattern.description}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <TrendingUp className="text-yellow-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Market Signals</h3>
            <ul className="space-y-2">
              {analysis.marketSignals?.map((signal, index) => (
                <li key={index} className="text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  {signal.name || signal.pattern || signal.type} : {signal.description || signal.pattern}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
          <p className="text-gray-300">{analysis.riskAssessment}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4">
          <Clock className="text-purple-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Short-term Outlook</h3>
            <p className="text-gray-300">{analysis.shortTermOutlook}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Clock className="text-indigo-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Long-term Outlook</h3>
            <p className="text-gray-300">{analysis.longTermOutlook}</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <TrendingUp className="text-blue-500 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Trading Recommendation</h3>
          <p className="text-gray-300">{analysis.recommendation}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-400">AI Confidence:</span>
            <div className="w-32 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${analysis.confidence}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-400">{analysis.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}