import styles from '../../styles/info.module.css';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <motion.div className={styles.pageContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>User Privacy Rights</h1>
      <p>
        Your privacy is important to us. This document outlines how Apex Flick handles your data, what rights you have, and how we maintain compliance with global and local data laws (e.g., NDPR).
      </p>

      <h2>What We Collect</h2>
      <p>
        - Your email, username, device info, game activity, and interactions within the app.  
        - Your IP address, geolocation (approximate), and session data for fraud prevention and analytics.
      </p>

      <h2>How We Use Your Data</h2>
      <p>
        Data is used to personalize the game, track progress, detect fraud, and improve service quality. We do not sell your data. Ever.
      </p>

      <h2>Third Parties</h2>
      <p>
        We use Firebase and Adsense, which may collect anonymized data according to their own privacy terms. You can view their privacy policies independently.
      </p>

      <h2>Your Rights</h2>
      <p>
        - You may request your data at any time.  
        - You may request account deletion.  
        - You may withdraw consent for data collection (which may result in restricted access).
      </p>

      <h2>Security Measures</h2>
      <p>
        We use encryption, tokenized authentication, and secure data practices to ensure your information is protected at all times.
      </p>

     
        <div>
          <h2>Privacy Clause </h2>
          <p>
            Apex Flick reiterates that no personal data shall be shared with third parties for marketing purposes. All user data remains confidential unless required by law or upon the user’s explicit request.
          </p>
          <p>
            Data retention policies are reviewed regularly to ensure unnecessary information is purged, and active information is maintained under secure conditions only.
          </p>
        </div>
   
    </motion.div>
  );
};

export default PrivacyPolicy;
