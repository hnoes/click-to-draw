import React, { useState, useEffect } from 'react';
import './DeckOfCards.css';

function DeckOfCards() {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  

  
    useEffect(() => {
    fetchDeckId();
  }, []);

  //fetch a new deck of cards from the API
  const fetchDeckId = async () => {
    setIsLoading(true);
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
    const data = await response.json();
    setDeckId(data.deck_id);
    setRemaining(data.remaining);
    setCards([]);
    setIsLoading(false); 
  };

  //function to shuffle the existing deck
  const shuffleDeck = async () => {
    if (!deckId) return; // check if deckId is available

    setIsLoading(true);
    await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    setCards([]);
    setRemaining(52); //reset the remaining cards count
    setIsLoading(false);
  };

  const getRandomPosition = () => {
    const x = Math.random() * 80; // Random x position
    const y = Math.random() * 80; // Random y position
    return { x, y };
  };

  async function drawCard() { 
    if (isLoading) {
      // Alert or handle the loading state
      console.log('Shuffling in progress, please wait...');
      return;
    }
  
    if (remaining === 0) { // Check if there are no cards remaining
      alert('Error: no cards remaining!');
      return;
    }
  
    setIsLoading(true);  // start loading
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
        const cardData = await response.json();

        console.log(cardData); // Add this line for debugging

        setIsLoading(false); // end loading 

  
    if (cardData.remaining === 0) {
      alert('No more cards remaining!');
    }
  
    const newPosition = getRandomPosition();
    const newCard = {
      image: cardData.cards[0].image,
      id: cardData.cards[0].code, // Unique identifier
      position: newPosition
    };
  
    setCards(cards => [...cards, newCard]);
    setRemaining(cardData.remaining);
  }
  

  return (
    <div className="deck-container">
      {cards.map(card => (
        <img key={card.id} src={card.image} alt="Card" 
             className="card" 
             style={{ left: `${card.position.x}%`, top: `${card.position.y}%` }} />
      ))}
      <div className="button-container">
        <button onClick={drawCard} disabled={isLoading} className="button">Draw a card</button>
        <button onClick={shuffleDeck} disabled={isLoading} className="button">Shuffle Deck</button>
      </div>
    </div>
  );
  
}

export default DeckOfCards;
