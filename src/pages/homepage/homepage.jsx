import styles from './../../../styles/home.module.css';
import { Link } from 'react-router-dom';
import Logo from '../../../images/apexflick logo.jpg';
import cardFront from '../../../images/apexcard.png';
import cardBack from '../../../images/cardsback.png';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [animationType, setAnimationType] = useState('flip'); // Track the current animation type
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track the state of the menu

  // Automatically switch between flip and bounce animations
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationType((prev) => (prev === 'flip' ? 'bounce' : 'flip')); // Toggle animation type
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Close the menu when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains(styles.menuOverlay)) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className={styles.homepage}>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <img src={Logo} alt="logo" />
          <h2>Apex flick</h2>
        </div>

        {/* Hamburger Icon */}
        <div className={styles.hamburger} onClick={() => setIsMenuOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Links for larger screens */}
        <div className={styles.links}>
          <Link className={styles.moveEl}>Home</Link>
          <Link className={styles.moveEl}>how it works</Link>
          <Link className={styles.moveEl}>contact</Link>
          <Link className={styles.moveEl}>login/signup</Link>
        </div>
      </div>

      {/* Sliding Menu Panel */}
      {isMenuOpen && (
        <div
          className={styles.menuOverlay}
          onClick={handleOutsideClick} // Close menu on outside click
        >
          <motion.div
            className={styles.menuPanel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <Link className={styles.moveEl} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link className={styles.moveEl} onClick={() => setIsMenuOpen(false)}>
              how it works
            </Link>
            <Link className={styles.moveEl} onClick={() => setIsMenuOpen(false)}>
              contact
            </Link>
            <Link className={styles.moveEl} onClick={() => setIsMenuOpen(false)}>
              login/signup
            </Link>
          </motion.div>
        </div>
      )}

      <div className={styles.topArea}>
        <div className={styles.cashSection}>
          <h1>Win N10,000 Daily.</h1>
          <h1>Play. pick. Win.</h1>
          <h1>No Deposits</h1>
          <h4>Nigerians most thrilling card-pick cash game</h4>
          <button>Start playing Now</button>
        </div>
        <div className={styles.cardArea}>
          <motion.div
            className={styles.card}
            animate={
              animationType === 'flip'
                ? { rotateX: [0, 180, 0] } // Flip animation
                : { y: [0, -20, 0] } // Bounce animation
            }
            transition={{
              duration: 2, // Duration for each animation cycle
              repeat: Infinity, // Repeat indefinitely
              ease: 'easeInOut', // Smooth easing
            }}
          >
            <div className={styles.cardFront}>
              <img src={cardFront} alt="Card Front" />
            </div>
            <div className={styles.cardBack}>
              <img src={cardBack} alt="Card Back" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className={styles.howItworks}>
        <h1>How it works</h1>

        <div className={styles.detailExplanation}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>

            <h3>
              create account
            </h3>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
            </svg>

            <h3>
              pick card
            </h3>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
            </svg>

            <h3>
              climb chart
            </h3>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
              <path
                fillRule="evenodd"
                d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                clipRule="evenodd"
              />
            </svg>

            <h3>
              Withdraw earnings
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;