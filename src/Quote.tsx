import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Quote() {
  const [quote, setQuote] = useState('Loading quote...');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    // Fetch a random quote from the ZenQuotes API
    axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'))
    .then((response) => {
      const data = JSON.parse(response.data.contents)[0];
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
