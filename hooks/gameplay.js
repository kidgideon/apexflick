import { useState, useEffect, useRef } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import {auth , db } from '../config/config'

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

  const comboCountRef = useRef(saved.comboCount || 0); // fix combo logic persistence

  useEffect(() => {
    const gameState = {
      cards,
      roundsPlayed,
      apexCard,
      lastPlayed,
      phase,
      selectedCardId,
      comboCount: comboCountRef.current,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [cards, roundsPlayed, apexCard, lastPlayed, phase, selectedCardId]);

  const saveGameplaySession = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        'gameplay.roundsPlayed': roundsPlayed,
        'gameplay.apexCard': apexCard,
        'gameplay.lastPlayed': Date.now(),
      });
      console.log('Gameplay session saved to Firestore');
    } catch (err) {
      console.error('Error saving gameplay session:', err);
    }
  };

  const generateCards = () => {
    const apexIndex = Math.floor(Math.random() * 5);
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      isApex: i === apexIndex,
    }));
  };

  const startGame = () => {
    setCards(generateCards());
    setPhase('play');
    setSelectedCardId(null);
    setLastPlayed(Date.now());
    setRoundsPlayed((prev) => prev + 1);
    // comboCount is NOT reset here — so streaks carry over rounds
  };

  const selectCard = (cardId) => {
    if (phase !== 'play') return;

    setSelectedCardId(cardId);
    const picked = cards.find((c) => c.id === cardId);

    if (picked?.isApex) {
      setApexCard((prev) => prev + 1);
      comboCountRef.current += 1;

      if (comboCountRef.current === 2) {
        console.log('Combo triggered! Adding extra Apex card.');
        setApexCard((prev) => prev + 1);
        comboCountRef.current = 0;
      }
    } else {
      comboCountRef.current = 0;
    }

    setPhase('result');
  };

  const resetGame = () => {
    setCards([]);
    setRoundsPlayed(0);
    setApexCard(0);
    setLastPlayed(null);
    setPhase('idle');
    setSelectedCardId(null);
    comboCountRef.current = 0;
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
    saveGameplaySession, // <-- CALL THIS before reroutes
  };
};

export default useGameplay;
