import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FEEDBACK_TEXT_API_URL } from '../../api/config';

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${FEEDBACK_TEXT_API_URL}/get-feedback-text`);
        setFeedbacks(res.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Customer Feedbacks</h2>
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-gray-600">No feedbacks found.</p>
        ) : (
          feedbacks.map((item, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
              <p className="text-gray-800 mb-1">
                <span className="font-semibold">Sentiment:</span>{' '}
                <span className={`font-medium capitalize ${
                  item.sentiment?.toLowerCase() === 'positive'
                    ? 'text-green-600'
                    : item.sentiment?.toLowerCase() === 'negative'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {item.sentiment}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Feedback:</span> {item.feedback_text || 'No comment provided'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllFeedbacks;
