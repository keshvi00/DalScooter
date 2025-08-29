
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FEEDBACK_TEXT_API_URL } from '../../api/config';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const SentimentChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await axios.get(`${FEEDBACK_TEXT_API_URL}/get-feedback-text`);
        const allFeedback = res.data;

        const summary = {
          positive: 0,
          neutral: 0,
          negative: 0,
        };

        allFeedback.forEach(item => {
          const sentiment = item.sentiment?.toLowerCase();
          if (summary[sentiment] !== undefined) {
            summary[sentiment]++;
          }
        });

        const chartData = Object.keys(summary).map(key => ({
          name: key,
          count: summary[key],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching sentiment summary:", error);
      }
    };

    fetchSentiment();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg border border-gray-700">
          <p className="font-medium capitalize">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ name, percent, value }) => {
    if (percent > 0.05) { 
      return `${(percent * 100).toFixed(0)}%`;
    }
    return '';
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-t-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Sentiment Analysis</h2>
            <p className="text-indigo-100 opacity-90">Customer Feedback Overview</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100">
        <div className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                dataKey="count"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                paddingAngle={2}
                label={renderCustomLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-4">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-center">
                <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-2 hover:bg-gray-100 transition-colors duration-200">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {entry.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-white rounded-full px-2 py-1 font-semibold">
                    {entry.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-50 rounded-b-2xl px-6 py-4 border-t border-gray-100">
          <div className="text-center">
            <span className="text-sm text-gray-600">Total Feedback: </span>
            <span className="font-bold text-gray-800">
              {data.reduce((sum, item) => sum + item.count, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentChart;