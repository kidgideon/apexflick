import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/config';

const useGameplay = () => {
  const [cards, setCards] = useState([]);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [apexCard, setApexCard] = useState(0);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const comboCountRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Load from Firestore on initial mount
  useEffect(() => {
    const fetchGameState = async () => {
      const user = auth.currentUser;
      if (!user) return;

      let localData = null;
      let firestoreData = null;

      // 1️⃣ Try get localStorage
      const local = localStorage.getItem('gameState');
      if (local) {
        try {
          localData = JSON.parse(local);
        } catch (err) {
          console.warn('Invalid localStorage data, ignoring.');
        }
      }

      // 2️⃣ Get Firestore gameplay
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          firestoreData = userDoc.data().gameplay || null;
        }
      } catch (err) {
        console.error('Failed to fetch from Firestore:', err);
      }

      // 3️⃣ Compare based on roundsPlayed (simpler than timestamp comparison)
      const localRounds = localData?.roundsPlayed || 0;
      const firestoreRounds = firestoreData?.roundsPlayed || 0;

      // Choose the game state with the highest roundsPlayed
      const useLocal = localRounds >= firestoreRounds;

      const finalData = useLocal ? localData : {
        cards: [],
        roundsPlayed: firestoreRounds,
        apexCard: firestoreData?.apexCard || 0,
        lastPlayed: firestoreData?.lastPlayed || null,
        phase: 'idle',
        selectedCardId: null,
        comboCount: 0,
      };

      // 4️⃣ Set state from chosen data
      setRoundsPlayed(finalData.roundsPlayed || 0);
      setApexCard(finalData.apexCard || 0);
      setLastPlayed(finalData.lastPlayed || null);
      setPhase(finalData.phase || 'idle');
      setSelectedCardId(finalData.selectedCardId || null);
      comboCountRef.current = finalData.comboCount || 0;
      setCards(finalData.cards || []);

      // 5️⃣ Save that back to localStorage (clean + synced)
      localStorage.setItem('gameState', JSON.stringify(finalData));

      setIsLoading(false);
    };

    fetchGameState();
  }, []);

  // 🔃 Persist to localStorage on state changes (after Firestore fetch)
  useEffect(() => {
    if (isLoading) return;

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
  }, [cards, roundsPlayed, apexCard, lastPlayed, phase, selectedCardId, isLoading]);

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
      console.log('Gameplay saved to Firestore');
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
        console.log('Combo triggered! +1 Apex card bonus');
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
    isLoading, // in case you want to show spinner while loading from Firestore
  };
};

export default useGameplay;
