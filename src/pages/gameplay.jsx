import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/config';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import useGameplay from '../../hooks/gameplay';
import styles from '../../styles/gameplay.module.css';
import cardBack from '../../images/cardsback.png';
import apexCardImg from '../../images/apexcard.png';
import notapex from '../../images/notapex.png';
import failSound from '../../sounds/fail.mp3';
import successSound from '../../sounds/win.mp3';
import flipSound from '../../sounds/flip.mp3';

const GamePlay = () => {
  const failSoundEffect = useRef(null);
  const successSoundEffect = useRef(null);
  const flipSoundEffect = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    failSoundEffect.current = new Howl({ src: [failSound], volume: 5});
    successSoundEffect.current = new Howl({ src: [successSound], volume: 5});
    flipSoundEffect.current = new Howl({ src: [flipSound], volume: 5});
  
    return () => {
      // Optional: Unload sounds when component unmounts
      failSoundEffect.current?.unload();
      successSoundEffect.current?.unload();
      flipSoundEffect.current?.unload();
    };
  }, []);


  const {
    cards,
    roundsPlayed,
    apexCard,
    phase,
    isNotification,
    selectedCardId,
    comboCount,
    startGame,
    selectCard,
    resetGame,
    saveGameplaySession,
    userInfo,
    comboAnimation,
  } = useGameplay();

  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [shakeCardId, setShakeCardId] = useState(null); // Track the card to shake
  const [glowCardId, setGlowCardId] = useState(null); // Track the card to glow
  const [showCombo, setShowCombo] = useState(false); // Track combo text visibility
  const [glow, setGlow] = useState(false); // Track if the Apex card count should glow
  const apexCardRef = useRef(null); // Reference to the Apex card count
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        resetGame();
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
    flipSoundEffect.current?.play(); // Play flip sound when the game starts
    setShakeCardId(null); // Reset shake state
    setGlowCardId(null); // Reset glow state
    setShowCombo(false); // Reset combo text
    startGame()
  };

  const handleSelectCard = (cardId) => {
    const selectedCard = cards.find((card) => card.id === cardId);
    if (selectedCard?.isApex) {
      // Trigger the glow effect
      setGlow(true);
      setTimeout(() => setGlow(false), 1000); // Remove glow after 1 second

      successSoundEffect.current?.play(); // Play success sound for correct card
      setGlowCardId(cardId); // Glow the correct card

      // Show combo text if comboCount reaches 2
      if (comboCount + 1 === 2) {
        setShowCombo(true); // Show combo animation
        setTimeout(() => setShowCombo(false), 2000); // Hide combo text after 2 seconds
      }
    } else {
      failSoundEffect.current?.play(); // Play fail sound for wrong card
      setShakeCardId(cardId); // Shake the wrong card
      navigator.vibrate?.(500); // Vibrate the device for 200ms
      const apexCard = cards.find((card) => card.isApex);
      setGlowCardId(apexCard.id); // Glow the Apex card
    }
    selectCard(cardId);
  };

  const getCardImage = (card) => {
    if (phase === 'play' || phase === 'idle') return cardBack;
    return card.isApex ? apexCardImg : notapex;
  };

  const gothere = async (place) => {
    await saveGameplaySession();
  
    if (place === 'leaderboard') {
      navigate('/leaderboard');
    } else if (place === 'Balance') {
      navigate('/withdraw');
    } else if (place === 'Tasks') {
      navigate('/task');
    } else if (place === 'invite') {
      navigate('/friends');
    } else if (place === 'Help & Support') {
      window.location.href = 'mailto:apexflick.com@gmail.com';
    } else if (place === 'notification') {
      navigate('/notifications');
    } else if (place === 'Logout') {
      try {
        resetGame();            // 1. Reset game
        localStorage.clear();   // 2. Clear local storage
        await signOut(auth);    // 3. Firebase sign-out
        navigate('/');          // 4. Redirect to homepage
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }  else if (place === 'winners') {
      navigate('/winners')
    }
  };

 
useEffect(() => {
  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };
  document.addEventListener('mousedown', handleOutsideClick);
  return () => document.removeEventListener('mousedown', handleOutsideClick);
}, []);


 // Open Modal and update user info
 const openModal = () => {
  setIsModalOpen(true);
};

// Close the modal
const closeModal = () => {
  setIsModalOpen(false);
};

  return (
    
    <div className={styles.gameplayArea}>
       
      {/* === NAVIGATION BAR === */}
      <div className={styles.navBar}>
        <div onClick={openModal} className={styles.profilePic}>
          {profilePicUrl && <img src={profilePicUrl} alt="profile" />}
        </div>

        <div className={styles.leaderBoard}>
          
          <svg onClick={() => gothere("leaderboard")} xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
          </svg>
        </div>

        <div className={styles.notification}>
          <svg onClick={() => gothere("notification")} xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
           <div  className={`${styles.dot} ${isNotification ? styles.activeDot : ''}`}></div>
        </div>

        <div className={styles.menuBar} onClick={() => setIsMenuOpen(!isMenuOpen)}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
  </svg>
</div>

      </div>

      {isMenuOpen && (
  <div className={styles.menuModalOverlay}>
    <motion.div
      className={styles.menuModal}
      ref={menuRef}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      {['Balance', 'Tasks','winners', 'invite', 'Help & Support', 'Logout'].map((label, index) => (
        <motion.div
          onClick={() => gothere(`${label}`)}
          key={label}
          className={styles.menuItem}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1, type: 'tween' }}
        >
          {/* Match icons to their order manually */}
          {index === 0 && (
            // Withdrawal Icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          )}
          {index === 1 && (
            // Task Icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
          </svg>
          
          )}
          {index === 2 && (
            // Help & Support Icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
          </svg>
          
          )}
          {index === 3 && (
            // Logout Icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
         
          )}
          {
            index === 4 && (
              //invite route
            
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
            )
          }{
            index === 5 && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            )
          }
          <span>{label}</span>
        </motion.div>
      ))}
    </motion.div>
  </div>
)}

{comboAnimation && comboAnimation >= 2 && (
  <div className={styles.comboPopup}>
   <p className={styles.comboText}> Combo x{comboAnimation}! 🔥</p>
  </div>
)}

      {/* === SCORE AREA === */}
      <div className={styles.gameCount}>
        <div
          className={styles.apexCount} // Add glow class dynamically
          ref={apexCardRef} // Reference to the Apex card count
        > 
          <div className={`${styles.card} ${glow ? styles.glow : ''}`} >
            <img src={apexCardImg} alt="Apex card" />
          </div>
          <span className={styles.count}>{apexCard}</span>
        </div>

        <div className={styles.apexRounds}>
          <div className={styles.roundsCount}>
            <p>{roundsPlayed}</p>
            <hr />
            <p>1000</p>
          </div>
          <div className={styles.cardsBar}>
            <progress className={styles.progressBar} value={roundsPlayed} max={1000}></progress>
          </div>
        </div>
      </div>

     

      {/* === CARD DISPLAY === */}
 {/* === CARD DISPLAY === */}
 <div className={styles.cardsPlayArea}>
  <div className={styles.cardsPlacement}>
    {cards.map((card, index) => (
      <motion.div
        id={`card-${card.id}`} // Add an ID to track the card
        className={`${styles.theCard} ${glowCardId === card.id ? styles.light : ''} ${shakeCardId === card.id ? styles.shake : ''}`}
        key={card.id}
        initial={{ scale: 0, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 400, // Faster animation speed
          damping: 15, // More snappy behavior
          delay: index * 0.1,
        }}
        onClick={() => {
          if (phase === 'play') {
            handleSelectCard(card.id);
          }
        }}
      >
        {/* Card element with front and back */}
        <motion.div
          className={styles.theCard}
          style={{ width: '100%', height: '100%' }}
          animate={{ rotateY: (phase === 'result' || selectedCardId === card.id) ? 180 : 0 }}
          transition={{
            type: 'spring',
            stiffness: 100, // Faster flip
            damping: 10, // Snappy flip
            duration: 0.2, // Control speed of the flip animation
          }}
        >
          <div className={styles.cardBack}>
            <img src={cardBack} alt="Card Back" />
          </div>
          <div className={styles.cardFront}>
            <img src={getCardImage(card)} alt="Card Front" />
          </div>
        </motion.div>
      </motion.div>
    ))}
  </div>

  {/* === Buttons Section === */}
  <div className={styles.buttons}>
    {/* Play Button (Visible when phase is 'idle') */}
    {phase === 'idle' && (
      <motion.button
        initial={{ scale: 0, opacity: 0 }} // Start small and invisible
        animate={{ scale: 1, opacity: 1 }} // Grow to full size and become visible
        transition={{
          type: 'spring', // Use spring animation for bounce effect
          stiffness: 400, // Faster bounce intensity
          damping: 15, // Smooth bounce
          duration: 0.3, // Faster animation duration
        }}
        whileTap={{ scale: 0.95 }} // Slightly shrink on tap
        onClick={handleStartGame} // Play sound and start game
        className={styles.playBtn}
      >
        Play
      </motion.button>
    )}

    {/* Next Button (Visible when phase is 'result') */}
    {phase === 'result' && (
      <motion.button
        initial={{ scale: 0, opacity: 0 }} // Start small and invisible
        animate={{ scale: 1, opacity: 1 }} // Grow to full size and become visible
        transition={{
          type: 'spring', // Use spring animation for bounce effect
          stiffness: 400, // Faster bounce intensity
          damping: 15, // Smooth bounce
          duration: 0.3, // Faster animation duration
        }}
        whileTap={{ scale: 0.95 }} // Slightly shrink on tap
        onClick={handleStartGame} // Start the next round
        className={styles.playBtn}
      >
        Next
      </motion.button>
    )}
  </div>
</div>




      

{isModalOpen && (
  <motion.div
    className={styles.modalOver}
    initial={{ opacity: 0 }}         // Initial opacity (invisible)
    animate={{ opacity: 1 }}         // Animate to visible
    exit={{ opacity: 0 }}            // Exit animation (fade out)
    transition={{ duration: 0.5 }}  // Duration of the animation
    onClick={closeModal}
  >
    <motion.div
      className={styles.modalContent}
      initial={{ scale: 0.9 }}        // Initial scale (slightly smaller)
      animate={{ scale: 1 }}          // Animate to normal size
      exit={{ scale: 0.9 }}           // Exit scale (slightly smaller)
      transition={{ duration: 0.5 }}  // Duration of the scale animation
    >
      <div  onClick={closeModal} className={styles.xBtn}>
        x
      </div>
      <div className={styles.imgDiv}>
        <img 
          src={userInfo.picture === "no image" ? "https://via.placeholder.com/150" : userInfo.picture} 
          alt={userInfo.name} 
        />
        <p>{userInfo.name}</p>
      </div>
    </motion.div>
  </motion.div>
)}

    </div>
  );
};

export default GamePlay;
