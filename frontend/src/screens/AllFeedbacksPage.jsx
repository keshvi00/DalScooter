import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FEEDBACK_TEXT_API_URL } from '../api/config';

export default function AllFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${FEEDBACK_TEXT_API_URL}/get-feedback-text`);
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 text-center">All Customer Feedback</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b">Booking Reference</th>
                <th className="py-2 px-4 border-b">Feedback Text</th>
                <th className="py-2 px-4 border-b">Sentiment</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.booking_reference}</td>
                  <td className="py-2 px-4 border-b">{item.feedback_text}</td>
                  <td className="py-2 px-4 border-b capitalize">{item.sentiment}</td>
                  <td className="py-2 px-4 border-b">{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
