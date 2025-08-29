import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FEEDBACK_TEXT_API_URL } from '../api/config';

const COLORS = {
  positive: '#00C49F',
  neutral: '#FFBB28',
  negative: '#FF4F4F'
};

const SentimentChart = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${FEEDBACK_TEXT_API_URL}/get-feedback-text`);
        setFeedbacks(res.data);
      } catch (error) {
        console.error("Error fetching sentiment summary: ", error);
      }
    };
    fetchData();
  }, []);

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesFilter = filter === 'all' || fb.sentiment === filter;
    const matchesSearch =
      fb.feedback_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.booking_reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const chartData = ['positive', 'neutral', 'negative'].map(sentiment => ({
    name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    count: feedbacks.filter(f => f.sentiment === sentiment).length,
    fill: COLORS[sentiment]
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h4 className="text-3xl font-bold text-gray-800">Customer Sentiment Insights</h4>
        <p className="text-gray-500 text-sm mt-1">Real-time feedback sentiment analysis</p>
      </div>

      {/* Pie Chart Card */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
    
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="count"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6">
      <h4> Feedbacks :</h4>
        <div className="flex space-x-2">
          {['all', 'positive', 'neutral', 'negative'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-black text-sm font-medium transition ${
                filter === type
                  ? 'bg-blue-600 shadow'
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by keyword or booking..."
          className="mt-2 sm:mt-0 px-4 py-2 border rounded w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm border border-gray-300 border-collapse">
          <thead className="bg-gray-100 text-left text-black-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-3">Booking Ref</th>
              <th className="px-5 py-3">Feedback</th>
              <th className="px-5 py-3">Sentiment</th>
              <th className="px-5 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((fb, idx) => (
                <tr key={idx} className="border-t hover:bg-black-50">
                  <td className="px-5 py-3 font-medium">{fb.booking_reference}</td>
                  <td className="px-5 py-3">{fb.feedback_text}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-black text-xs font-semibold ${
                        fb.sentiment === 'positive'
                          ? 'bg-green-500'
                          : fb.sentiment === 'neutral'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {fb.sentiment}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {new Date(fb.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-5 py-6 text-center text-gray-500">
                  No matching feedbacks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SentimentChart;
