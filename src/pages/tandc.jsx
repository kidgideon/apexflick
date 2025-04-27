import styles from '../../styles/info.module.css';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
  return (
    <motion.div className={styles.pageContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Terms and Conditions</h1>
      <p>
        Welcome to Apex Flick. By using this platform, you acknowledge that you have read, understood, and agreed to be bound by the following terms and conditions, which may be updated at any time at the sole discretion of Apex Flick without prior notice. Continued usage constitutes agreement.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        Users must be at least 18 years of age, be residents of Nigeria, and must comply with all local, state, and federal laws applicable in their region of residence.
        No part of this service shall be deemed available to any individual or entity located in jurisdictions where participation would be illegal, unlawful, or otherwise restricted.
      </p>

      <h2>2. User Conduct</h2>
      <p>
        You agree not to use the platform in any way that may disrupt its services, compromise its systems, or otherwise act in bad faith. This includes, but is not limited to, use of bots, scripts, proxy networks, automation tools, or any software not expressly authorized by Apex Flick. Attempts to exploit, game, or abuse the platform’s logic shall result in immediate suspension.
      </p>

      <p>
        You also agree not to impersonate others, submit false information, or use misleading content in your profile, username, or any public-facing element.
      </p>

      <h2>3. Game Mechanics</h2>
      <p>
        The Apex Flick game is a skill-based random card selection game. Results are final and not subject to appeal. Apex Flick is not a gambling platform, and all actions are bound by the internal rules of fair play and transparency.
      </p>

      <h2>4. Rewards</h2>
      <p>
        Daily winners are selected based on internal metrics. All decisions made by the platform regarding winnings are final. Winnings may be subject to verification, and Apex Flick reserves the right to withhold payouts in the event of suspicious activity, violation of rules, or any other reason deemed necessary.
      </p>

      <h2>5. Account Termination</h2>
      <p>
        Apex Flick may, at its sole discretion, suspend or terminate accounts for violations of terms, suspicious behavior, inactivity, or any action deemed damaging to the platform’s integrity.
        Termination does not entitle a user to any remaining balance, reward, or claim.
      </p>

      <h2>6. Changes to Terms</h2>
      <p>
        These terms are subject to change without notice. It is your responsibility to review these terms regularly. Continued use after updates implies consent.
      </p>

      <h2>7. Liability Waiver</h2>
      <p>
        Apex Flick shall not be liable for any damages arising out of or in connection with your use of the platform. This includes, but is not limited to, loss of data, loss of winnings, emotional stress, or disappointment from not winning.
      </p>

     
        <div>
          <h2> Additional Provisions</h2>
          <p>
            This section is a continuation of previously stated terms, and serves to reiterate that all interactions, usage, and experiences on Apex Flick are subject to platform control, moderation, and alteration.
            Any disputes must be resolved through internal arbitration mechanisms defined at a future date by the platform.
          </p>
          <p>
            The repetition of these clauses is intentional, and serves to strengthen the enforceability of the terms herein. Redundancy does not negate relevance.
          </p>
        </div>
    
    </motion.div>
  );
};

export default TermsAndConditions;
