import styles from '../../styles/info.module.css';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <motion.div className={styles.pageContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>About Apex Flick</h1>
      <p>
        Apex Flick is more than a game — it’s a revolution in fun, financial empowerment, and digital interaction tailored for the modern Nigerian player.
      </p>

      <p>
        Founded on the principles of simplicity, fairness, and opportunity, Apex Flick seeks to create a level playing field for players who crave entertainment and cash rewards without the risk of financial investment.
      </p>

      <p>
        Our team is made up of tech enthusiasts, game designers, and community-first developers who believe in the long-term impact of rewarding digital interaction. We don’t just make games. We craft rewarding experiences.
      </p>

      <h2>Our Vision</h2>
      <p>
        To build a gamified digital economy powered by community-driven engagement, transparency, and trust.
      </p>

      <h2>Our Mission</h2>
      <p>
        To offer players a chance to win real rewards while enjoying simple, low-barrier gameplay without intrusive monetization or exploitative practices.
      </p>

      <h2>Built For You</h2>
      <p>
        Apex Flick is 100% built for Nigerians. We understand the market, the hustle, and the hunger for new ways to earn. That’s why we’re betting on you.
      </p>

      {/* Add bulk filler to make it very long */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <h2>Our Commitment #{i + 1}</h2>
          <p>
            We remain steadfastly committed to delivering a platform that prioritizes user satisfaction, platform stability, transparency in reward allocation, continuous optimization of gameplay mechanics, and round-the-clock integrity monitoring for fairness enforcement. This commitment is foundational to our operation.
          </p>
          <p>
            Our ongoing updates and iterations shall continue to reflect our devotion to providing a premium user experience, meaningful gameplay loops, and persistent value to our player base across diverse devices and internet environments.
          </p>
        </div>
      ))}
    </motion.div>
  );
};

export default AboutPage;
