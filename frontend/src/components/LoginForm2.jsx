import { useState, useEffect } from "react";
import axios from "axios";
import { LOGIN_API_URL } from "../api/config";
import { FaKey } from "react-icons/fa";

function LoginFormStep2({ nextStep, username }) {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(
          `${LOGIN_API_URL}/security-question?username=${username}`
        );
        setQuestion(res.data.question);
      } catch (err) {
        alert("Failed to load security question");
      }
    };
    fetchQuestion();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${LOGIN_API_URL}/verify-security-question`, {
        username,
        question,
        answer,
      });
      nextStep();
    } catch (err) {
      alert("Incorrect security answer");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-transition">
      {question && (
        <p className="mb-2 text-sm font-medium text-gray-700">
          Security Question: {question}
        </p>
      )}
      <div className="signup-field">
        <FaKey className="signup-icon" />
        <input
          className="signup-input"
          placeholder="Answer to your security question"
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="signup-button">
        Next
      </button>
    </form>
  );
}

export default LoginFormStep2;
