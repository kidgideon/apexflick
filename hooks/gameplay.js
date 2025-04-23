import { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/config';
import { onAuthStateChanged } from 'firebase/auth';

const useGameplay = () => {
  const [cards, setCards] = useState([]);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [apexCard, setApexCard] = useState(0);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [selectedCardId, setSelectedCardId] = useState(null);

  const comboCountRef = useRef(0);

  // 👇 Async hydration after auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn('User signed out, clearing game state.');
        localStorage.removeItem('gameState');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const gamePlay = userSnap.data()?.gameplay;

        if (!gamePlay) return;

        const existingState = JSON.parse(localStorage.getItem('gameState') || '{}');
        const updatedState = {
          ...existingState,
          roundsPlayed: gamePlay.roundsPlayed,
          apexCard: gamePlay.apexCard,
          lastPlayed: gamePlay.lastPlayed,
        };

        localStorage.setItem('gameState', JSON.stringify(updatedState));

        // 🧠 Hydrate states
        setRoundsPlayed(updatedState.roundsPlayed || 0);
        setApexCard(updatedState.apexCard || 0);
        setLastPlayed(updatedState.lastPlayed || null);
        setPhase(updatedState.phase || 'idle');
        setSelectedCardId(updatedState.selectedCardId || null);
        comboCountRef.current = updatedState.comboCount || 0;
      } catch (err) {
        console.error('Failed to load gameplay state:', err);
      }
    });

    return () => unsubscribe();
  }, []);

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
    saveGameplaySession,
  };
};

export default useGameplay;
