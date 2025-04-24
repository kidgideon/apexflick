import styles from "../../styles/winners.module.css";
import { useNavigate } from "react-router-dom";
import useWinners  from "../../hooks/winners"; // adjust path if needed
import { format } from "date-fns";

const Winners = () => {
  const navigate = useNavigate();
  const Backwards = () => navigate(-1);

  const {
    winners,
    loading,
    selectedDate,
    goToPreviousDay,
    goToNextDay,
  } = useWinners();

  return (
    <div className={styles.winnersInterface}>
      <div className={styles.navBar}>
        <div className={styles.back}>
          <svg onClick={Backwards} xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
        <div className={styles.mid}><h3>Winners</h3></div>
        <div className={styles.end}></div>
      </div>

      <div className={styles.winners}>
        <div className={styles.dateNavigation}>
          {/* Previous Day */}
          <svg onClick={goToPreviousDay} xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>

          {/* Current Selected Date */}
          <h3>{format(selectedDate, 'PPP')}</h3>

          {/* Next Day */}
          <svg onClick={goToNextDay} xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>

        <div className={styles.winnerRolls}>
          {loading ? (
            <p>Loading winners...</p>
          ) : winners.length === 0 ? (
            <p>No winners for this date.</p>
          ) : (
            winners.map((winner, index) => (
              <div key={index} className={styles.winner}>
                <img src={winner.picture} alt={winner.username} />
                <h4>{winner.username}</h4>
                <h4> WON <span>₦</span>{Number(winner.reward).toLocaleString()}</h4>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Winners;
