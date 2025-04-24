import { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/config';
import { onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid'; // For generating unique notification ID

const useGameplay = () => {
  const localState = JSON.parse(localStorage.getItem('gameState') || '{}');

  const [cards, setCards] = useState([]);
  const [roundsPlayed, setRoundsPlayed] = useState(localState.roundsPlayed || 0);
  const [apexCard, setApexCard] = useState(localState.apexCard || 0);
  const [lastPlayed, setLastPlayed] = useState(localState.lastPlayed || 0);
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
  
        const firestoreGameplay = userSnap.data()?.gameplay || {};
        const localState = JSON.parse(localStorage.getItem('gameState') || '{}');
  
        console.log(localState)
        // Compare and choose the highest values
        const roundsPlayed = Math.max(firestoreGameplay.roundsPlayed || 0, localState.roundsPlayed || 0);
        console.log(roundsPlayed)
        const apexCard = Math.max(firestoreGameplay.apexCard || 0, localState.apexCard || 0);
        console.log(apexCard)
        const lastPlayed = Math.max(firestoreGameplay.lastPlayed || 0, localState.lastPlayed || 0);
        console.log(lastPlayed)
        const phase = localState.phase || 'idle';
        const selectedCardId = localState.selectedCardId || null;
        const comboCount = localState.comboCount || 0;
  
        const mergedState = {
          roundsPlayed,
          apexCard,
          lastPlayed,
          phase,
          selectedCardId,
          comboCount,
          cards: localState.cards || [], // optional, default empty
        };
  
        // Store the merged state
        localStorage.setItem('gameState', JSON.stringify(mergedState));
  
        // Hydrate React state
        setRoundsPlayed(roundsPlayed);
        setApexCard(apexCard);
        setLastPlayed(lastPlayed);
        setPhase(phase);
        setSelectedCardId(selectedCardId);
        comboCountRef.current = comboCount;
         // Call handleInviteBonus if conditions are met
         if (apexCard == 200) {
          await handleInviteBonus(user.uid, apexCard);
        }
      } catch (err) {
        console.error('Failed to compare and load gameplay state:', err);
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

  const handleInviteBonus = async (userId, apexCardValue) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const userData = userSnap.data();

      if (userData.payback === false) {
        // Fetch the inviter's userId
        const inviterId = userData.invitedMe;

        if (!inviterId) return;

        const inviterRef = doc(db, 'users', inviterId);
        const inviterSnap = await getDoc(inviterRef);

        if (!inviterSnap.exists()) return;

        const inviterData = inviterSnap.data();

        // Update the inviter's apexCard
        const gameplayRef = inviterRef.collection('gameplay');
        const gameplaySnapshot = await gameplayRef.get();

        let updated = false;

        gameplaySnapshot.forEach(doc => {
          if (doc.data().apexCard !== undefined) {
            // Increment the apexCard by 10
            doc.ref.update({
              apexCard: db.FieldValue.increment(10),
            });
            updated = true;
          }
        });

        if (updated) {
          // Create and send a notification
          const notification = {
            read: false,
            text: 'Congratulations, you just won 15 apex flick for your invite',
            link: '/gameplay',
            date: new Date().toISOString(),
            id: uuidv4(), // Generate unique ID for the notification
          };

          const notificationsRef = inviterRef.collection('notifications');
          await notificationsRef.add(notification);
          console.log('Inviter updated and notification sent');
        }
      }
    } catch (err) {
      console.error('Error handling invite bonus:', err);
    }
  };


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
