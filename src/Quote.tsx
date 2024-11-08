import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Quote() {
  const [quote, setQuote] = useState('Loading quote...');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/quote')
      .then((response) => {
        const data = response.data[0];
        setQuote(data.q); // Quote text
        setAuthor(data.a); // Author
      })
      .catch((error) => {
        console.error('Error fetching quote:', error);
        setQuote('Failed to load quote.');
      });
  }, []);
  

  return (
    <div className="quote-container">
      <p className="quote-text">"{quote}"</p>
      <p className="quote-author">- {author}</p>
    </div>
  );
}

export default Quote;
