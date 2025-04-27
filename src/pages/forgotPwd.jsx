import styles from "../../styles/forgot.module.css";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/config";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setShowModal(true);
      setError(""); // clear error
    } catch (err) {
      console.error(err); // log for debugging
      setError("Failed to send reset email. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  const back = () => {
    navigate(-1)
  }

  return (
    <div className={styles.container}>
        <svg  onClick={back} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 back-arrow">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>

      <div className={styles.card}>
      <lord-icon
      src="https://cdn.lordicon.com/jxhgzthg.json"
      trigger="loop"
      delay={1200}
      stroke="bold"
      colors="primary:#005f4a,secondary:#00321f"
      style={{ width: '120px', height: '120px' }}
    />
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={handleResetPassword} className={styles.button}>
          Send Reset Link
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Password reset link sent successfully!</p>
            <button onClick={handleCloseModal} className={styles.button}>
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forgot;
