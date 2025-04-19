import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../config/config';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import useGameplay from '../../../hooks/gameplay';
import styles from '../../../styles/gameplay.module.css';
import cardBack from '../../../images/cardsback.png';
import apexCardImg from '../../../images/apexcard.png';
import notapex from '../../../images/notapex.png';
import failSound from '../../../sounds/fail.mp3';
import successSound from '../../../sounds/win.mp3';
import flipSound from '../../../sounds/flip.mp3';

// Initialize sound effects
const failSoundEffect = new Howl({
  src: [failSound],
  volume: 0.5,
});

const successSoundEffect = new Howl({
  src: [successSound],
  volume: 0.5,
});

const flipSoundEffect = new Howl({
  src: [flipSound],
  volume: 0.5,
});

const GamePlay = () => {
  const {
    cards,
    roundsPlayed,
    apexCard,
    phase,
    selectedCardId,
    startGame,
    selectCard,
  } = useGameplay();

  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [shakeCardId, setShakeCardId] = useState(null); // Track the card to shake
  const [glowCardId, setGlowCardId] = useState(null); // Track the card to glow

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
      } else {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfilePicUrl(data.profilePicture);
          } else {
            console.warn('No user document found');
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleStartGame = () => {
    flipSoundEffect.play(); // Play flip sound when the game starts
    setShakeCardId(null); // Reset shake state
    setGlowCardId(null); // Reset glow state
    startGame();
  };

  const handleSelectCard = (cardId) => {
    const selectedCard = cards.find((card) => card.id === cardId);
    if (selectedCard?.isApex) {
      successSoundEffect.play(); // Play success sound for correct card
      setGlowCardId(cardId); // Glow the correct card
    } else {
      failSoundEffect.play(); // Play fail sound for wrong card
      setShakeCardId(cardId); // Shake the wrong card
      navigator.vibrate?.(200); // Vibrate the device for 200ms
      const apexCard = cards.find((card) => card.isApex);
      setGlowCardId(apexCard.id); // Glow the Apex card
    }
    selectCard(cardId);
  };

  const getCardImage = (card) => {
    if (phase === 'play' || phase === 'idle') return cardBack;
    return card.isApex ? apexCardImg : notapex;
  };

  return (
    <div className={styles.gameplayArea}>
      {/* === NAVIGATION BAR === */}
      <div className={styles.navBar}>
        <div className={styles.profilePic}>
          {profilePicUrl && <img src={profilePicUrl} alt="profile" />}
        </div>

        <div className={styles.leaderBoard}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
          </svg>
        </div>

        <div className={styles.notification}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </div>

        <div className={styles.menuBar}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>
      </div>

      {/* === SCORE AREA === */}
      <div className={styles.gameCount}>
        <div className={styles.apexCount}>
          <div className={styles.card}>
            <img src={apexCardImg} alt="Apex card" />
          </div>
          <span className={styles.count}>{apexCard}</span>
        </div>

        <div className={styles.apexRounds}>
          <div className={styles.roundsCount}>
            <span>{roundsPlayed}</span>
            <hr />
            <span>1000</span>
          </div>
          <div className={styles.cardsBar}>
            <progress value={roundsPlayed} max={1000}></progress>
          </div>
        </div>
      </div>

      {/* === CARD DISPLAY === */}
      <div className={styles.cardsPlayArea}>
        {cards.map((card, index) => (
          <div
            className={`${styles.theCard} ${
              glowCardId === card.id ? styles.glow : ''
            } ${shakeCardId === card.id ? styles.shake : ''}`} // Add shake class dynamically
            key={card.id}
            onClick={() => {
              if (phase === 'play') {
                handleSelectCard(card.id); // Handle card selection with sound
              }
            }}
          >
            <img
              src={getCardImage(card)}
              alt="card"
            />
          </div>
        ))}
      </div>

      {/* === PLAY & NEXT BUTTON === */}
      {phase === 'idle' && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleStartGame} // Play sound and start game
          className={styles.playBtn}
        >
          Play
        </motion.button>
      )}

      {phase === 'result' && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleStartGame} // Play sound and start next round
          className={styles.playBtn}
        >
          Next
        </motion.button>
      )}
    </div>
  );
};

export default GamePlay;
