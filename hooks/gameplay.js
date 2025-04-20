import { useState, useEffect } from 'react';

const getSavedGameState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('gameState'));
    return saved || {};
  } catch (err) {
    console.warn('Invalid game state in localStorage:', err);
    return {};
  }
};

const useGameplay = () => {
  const saved = getSavedGameState();

  const [cards, setCards] = useState(saved.cards || []);
  const [roundsPlayed, setRoundsPlayed] = useState(saved.roundsPlayed || 0);
  const [apexCard, setApexCard] = useState(saved.apexCard || 0);
  const [lastPlayed, setLastPlayed] = useState(saved.lastPlayed || null);
  const [phase, setPhase] = useState(saved.phase || 'idle');
  const [selectedCardId, setSelectedCardId] = useState(saved.selectedCardId || null);

  let comboCount = 0; // Use a `let` variable for combo count

  // Save game state to localStorage on any change
  useEffect(() => {
    const gameState = {
      cards,
      roundsPlayed,
      apexCard,
      lastPlayed,
      phase,
      selectedCardId,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [cards, roundsPlayed, apexCard, lastPlayed, phase, selectedCardId]);

  // Generate new cards with 1 Apex
  const generateCards = () => {
    const apexIndex = Math.floor(Math.random() * 5); // Randomly select the Apex card index
    console.log(`Apex card is at position: ${apexIndex}`); // Log the position of the Apex card
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      isApex: i === apexIndex,
    }));
  };

  // Start or continue game
  const startGame = () => {
    setCards(generateCards());
    setPhase('play'); // Transition to 'play' phase
    setSelectedCardId(null);
    setLastPlayed(Date.now());
    setRoundsPlayed((prev) => prev + 1);
    comboCount = 0; // Reset combo count on new game
  };

  // Handle selection
  const selectCard = (cardId) => {
    if (phase !== 'play') return;

    setSelectedCardId(cardId);
    const picked = cards.find((c) => c.id === cardId);

    if (picked?.isApex) {
      setApexCard((prev) => prev + 1); // Increment Apex card count

      // Increment combo count manually
      comboCount += 1;
      console.log(`Combo Count: ${comboCount}`); // Debugging combo count

      if (comboCount === 2) {
        console.log('Combo triggered! Adding an extra Apex card.');
        setApexCard((prev) => prev + 1); // Add an extra Apex card
        comboCount = 0; // Reset combo count after triggering
      }
    } else {
      console.log('Incorrect card selected. Resetting combo count.');
      comboCount = 0; // Reset combo count on incorrect guess
    }

    setPhase('result'); // Transition to 'result' phase
  };

  const resetGame = () => {
    setCards([]);
    setRoundsPlayed(0);
    setApexCard(0);
    setLastPlayed(null);
    setPhase('idle'); // Transition to 'idle' phase
    setSelectedCardId(null);
    comboCount = 0; // Reset combo count
    localStorage.removeItem('gameState');
  };

  return {
    cards,
    roundsPlayed,
    apexCard,
    lastPlayed,
    phase,
    selectedCardId,
    startGame,
    selectCard,
    resetGame,
  };
};

export default useGameplay;
