import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './bot.css';
import send1 from '../images/send1.png'

const Bot = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(''); 
  const genAI = new GoogleGenerativeAI("AIzaSyA39LrrBJ49c4AAB2ZOCSZNGE9BfiD4Cp0");

  useEffect(() => {
    setMessages([{ text: "Hey, could you tell me your name?", type: 'bot' }]); 
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return; 
    setMessages([...messages, { text: inputValue, type: 'user' }]);
    setInputValue('');

    if (!userName) { 
      setUserName(inputValue);
      setMessages([...messages, { text: `Nice to meet you, ${inputValue}!`, type: 'bot' }]);
      questions.forEach((question, index) => {
        setMessages([...messages, { text: `${index + 1}. ${question}`, type: 'bot', isQuestion: true, questionIndex: index }]);
      });
    } else {
      try {
        setLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(inputValue);
        const response = await result.response.text(); 
        setMessages([...messages, { text: inputValue, type: 'user' }, { text: response, type: 'bot' }]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages([...messages, { text: inputValue, type: 'user' }, { text: "Something went wrong. Please try again.", type: 'bot' }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuestionClick = async (questionIndex) => {
    const question = questions[questionIndex];
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(question);
      const response = await result.response.text(); 
      setMessages([...messages, { text: question, type: 'user' }, { text: response, type: 'bot' }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...messages, { text: question, type: 'user' }, { text: "Something went wrong. Please try again.", type: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-chat-interface">
      <div className="container">
        <h1>CG Bot</h1>
        {loading ? (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading....</span>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <>
              {message.isQuestion ? (
                <div key={index} className={`message ${message.type}`} onClick={() => handleQuestionClick(message.questionIndex)}>
                  {message.text}
                </div>
              ) : (
                <div key={index} className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}
            </>
          ))
        )}
      </div>
      <div className="in-cont">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ask me something..."
        />
        <button onClick={handleSend} disabled={loading}  className='button-5'>Send</button>
      </div>
    </div>
  );
};

export default Bot;