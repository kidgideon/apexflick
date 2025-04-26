import styles from '../../styles/home.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Logo from '../../images/apexflick logo.jpg';
import cardFront from '../../images/apexcard.png';
import cardBack from '../../images/cardsback.png';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {auth, db} from '../../config/config'

const HomePage = () => {
  const [animationType, setAnimationType] = useState('flip'); // Track the current animation type
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track the state of the menu
  const navigate = useNavigate(); // Initialize navigation
   const menuRef = useRef();

  // Automatically switch between flip and bounce animations
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationType((prev) => (prev === 'flip' ? 'bounce' : 'flip')); // Toggle animation type
    }, 12000); // Switch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

useEffect(() => {
  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };
  document.addEventListener('mousedown', handleOutsideClick);
  return () => document.removeEventListener('mousedown', handleOutsideClick);
}, []);

  const handleStartPlaying = () => {
    const user = auth.currentUser; // Check if there's a current user
    if (user) {
      navigate('/gameplay'); // Navigate to gameplay if user is logged in
    } else {
      navigate('/register'); // Navigate to register if no user is logged in
    }
  };

  const tosomewhere = (place) => {
         if (place === "Home") {
          navigate('/')
         } else if (place === "How it works") {
          navigate('/about')
         } else if (place === "contact") {
          navigate('/mailto:apexflick.com@gmail.com')
         } else if (place === "Login") {
          navigate('/login')
         } else if (place === "signup") {
          navigate('/register')
         }
  }

  return (
    <div className={styles.homepage}>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <img src={Logo} alt="logo" />
          <h3>Apex flick</h3>
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
          <Link to={'/'} className={styles.moveEl}>Home</Link>
          <Link to={'/about'} className={styles.moveEl}>how it works</Link>
          <Link to={'/mailto:apexflick.com@gmail.com'} className={styles.moveEl}>contact</Link>
          <Link to={'/login'} className={styles.moveEl}>login/signup</Link>
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
            {['Home', 'How it works', 'contact ', 'Login', 'signup'].map((label, index) => (
              <motion.div
              onClick={() => tosomewhere(label)}
                key={label}
                className={styles.menuItem}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'tween' }}
              >
                {/* Match icons to their order manually */}
                {index === 0 && (
                  // Withdrawal Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                
                )}
                {index === 1 && (
                  // Task Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                
                )}
                {index === 2 && (
                  // Help & Support Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                
                
                )}
                {index === 3 && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  
                        
               
                )}
                {
                  index === 4 && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>     
                  )
                }
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <div className={styles.topArea}>
        <div className={styles.cashSection}>
          <h1>Win N10,000 Daily.</h1>
          <h1>Play. pick. Win.</h1>
          <h1>No Deposits</h1>
          <h4>Nigerians most thrilling card-pick cash game</h4>
          <button onClick={handleStartPlaying}>Start playing Now</button>
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
          <lord-icon
  src="https://cdn.lordicon.com/kdduutaw.json"
  trigger="loop"
  delay={1200}
  stroke="bold"
  colors="primary:#005f4a,secondary:#00321f"
  style={{ width: '120px', height: '120px' }}
/>
            <h3>
              create account
            </h3>
          </div>
          <div>
          <lord-icon
  src="https://cdn.lordicon.com/ncmnezgk.json"
  trigger="loop"
  delay={1200}
  stroke="bold"
  colors="primary:#005f4a,secondary:#00321f"
  style={{ width: '120px', height: '120px' }}
/>
            <h3>
              pick card
            </h3>
          </div>
          <div>
          <lord-icon
  src="https://cdn.lordicon.com/fcyboqbm.json"
  trigger="loop"
  delay={1200}
  colors="primary:#005f4a,secondary:#00321f"
  style={{ width: '120px', height: '120px' }}
/>
            <h3>
              climb chart
            </h3>
          </div>
          <div>
          <lord-icon
  src="https://cdn.lordicon.com/ytklkgsc.json"
  trigger="loop"
  delay={1200}
  colors="primary:#005f4a,secondary:#00321f"
  style={{ width: '120px', height: '120px' }}
/>
            <h3>
              Withdraw earnings
            </h3>
          </div>
        </div>
      </div>

      <div className={styles.aboutUs}>
         <h2>About our game</h2>
         <div>
         <lord-icon
  src="https://cdn.lordicon.com/vttzorhw.json"
  trigger="loop"
  delay={1200}
  colors="primary:#005f4a,secondary:#00321f"
  style={{ width: '120px', height: '120px' }}
/>
 <div className={styles.textDiv}>
 <h3>skill meets luck</h3>
     <p>Apex Flick isn’t pure chance — it’s a battle of quick decision-making and instinct where the fastest, smartest players can dominate.</p>
     </div>
 </div>
   

     <div>
     <lord-icon
  src="https://cdn.lordicon.com/bsdkzyjd.json"
  trigger="loop"
  delay={1200}
  colors="primary:#005f4a,secondary:#00321f"
  style={{ width: '120px', height: '120px' }}
/>

<div className={styles.textDiv}>
<h3>Daily Top Winner</h3>
    <p>
    Every day is a new competition. Players fight for the top spot daily, keeping the community active, competitive, and hungry for that Apex crown.
    </p>
  </div>

    
    </div>

     <div>
     <lord-icon
  src="https://cdn.lordicon.com/rpviwvwn.json"
  trigger="loop"
  delay={1200}
  colors="primary:#005f4a,secondary:#00321f"
  style={{ width: '120px', height: '120px' }}
/>

<div className={styles.textDiv}>
<h3> Community Driven Rewards System</h3>
      <p>Instead of pay-to-win, Apex Flick builds value through player activity and engagement, making every flip part of a growing economy where the top players are truly recognized.
</p>
  </div>
     
     </div>
    </div>
  

      <footer className={styles.footer_styledFooter}>
  <div className={styles.footer_content}>

    <div className={styles.footer_logo}>Apex Flick</div>

    <div className={styles.footer_links}>
      <a href="/about">About</a>
      <a href="/terms and conditions">Terms</a>
      <a href="/privacy policy">Privacy</a>
      <a href="mailto:apexflick.com@gmail.com">Support</a>
    </div>

    <div className={styles.footer_socials}>
      <a href="https://www.facebook.com/profile.php?id=61575510487305" target="_blank" rel="noopener noreferrer">
       facebook
      </a>
      <a href="https://www.instagram.com/apex.flick?igsh=ZzkxMXQzdjg1ZjM4" target="_blank" rel="noopener noreferrer">
      instagram
      </a>
      <a href="https://tiktok.com/@apexflick" target="_blank" rel="noopener noreferrer">
       tiktok
      </a>
      <a href="https://youtube.com/@apexflick?si=4R9STnZSp00eo8DC" target="_blank" rel="noopener noreferrer">
        youtube
      </a>
    </div>

    <div className={styles.footer_copy}>
      © {new Date().getFullYear()} Apex Flick. All rights reserved.
    </div>
  </div>
</footer>

   
   
       
    </div>
  );
};

export default HomePage;