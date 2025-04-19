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
    const apexIndex = Math.floor(Math.random() * 5);
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
  };

  // Handle selection
  const selectCard = (cardId) => {
    if (phase !== 'play') return;

    setSelectedCardId(cardId);
    const picked = cards.find((c) => c.id === cardId);
    if (picked?.isApex) {
      setApexCard((prev) => prev + 1);
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
