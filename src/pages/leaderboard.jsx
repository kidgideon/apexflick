import styles from '../../styles/leaderboard.module.css';
import { useEffect, useState } from 'react';
import React from 'react';
import gameCard from '../../images/apexcard.png';
import { differenceInSeconds, endOfToday } from 'date-fns';
import useLeaderboard from '../../hooks/leaderboard';
import { useNavigate } from 'react-router-dom'
import crown from '../../images/crown.png'
const Leaderboard = () => {
  const { qualifiedUsers, currentUserData, currentUserRank } = useLeaderboard();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = endOfToday(); // 12:00:00 AM
      const diffInSeconds = differenceInSeconds(midnight, now);
      setTimeLeft(diffInSeconds > 0 ? diffInSeconds : 0);
    };

    updateTimer(); // call once immediately

    const interval = setInterval(updateTimer, 1000); // update every second

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours}h ${minutes}m ${secs}s`;
  };


  const leadUser = qualifiedUsers[0];
  const secondUser = qualifiedUsers[1];
  const thirdUser = qualifiedUsers[2];
 
  const goBack = () => {
     navigate(-1);
  }

  return (
    <div className={styles.leaderboard}>
      {/* Top Nav */}
      <div className={styles.navBar}>
        <div className={styles.svgArea}>
          <svg onClick={goBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
        <div className={styles.leaderboardTitle}>LeaderBoard</div>
        <div className={styles.compArea}> </div>
      </div>

      {/* Top 3 Winners Section */}
      <div className={styles.statsArea}>
        {secondUser && (
          <div className={styles.nextUser}>
            <div className={styles.dpN}>
              <img src={secondUser.profilePicture} alt="dp" />
            </div>
            <p>{secondUser.username}</p>
            <div className={styles.cardCount}>
              <img className={styles.card} src={gameCard} alt="card" />
              {secondUser.apexCard}

            </div>
          </div>
        )}

        {leadUser && (
          <div className={styles.leadUser}>
             <img className={styles.crownPic} src={crown} alt="" />
            <div className={styles.dp}>
              <img src={leadUser.profilePicture} alt="dp" />
            </div>
            <p>{leadUser.username}</p>
            <div className={styles.cardCount}>
              <img className={styles.card} src={gameCard} alt="card" />
              {leadUser.apexCard}
            </div>
          </div>
        )}

        {thirdUser && (
          <div className={styles.nextUser}>
            <div className={styles.dpN}>
              <img src={thirdUser.profilePicture} alt="dp" />
            </div>
            <p>{thirdUser.username}</p>
            <div className={styles.cardCount}>
              <img className={styles.card} src={gameCard} alt="card" />
              {thirdUser.apexCard}
             
            </div>
          </div>
        )}
      </div>

      <div className={styles.timer}>
      <p>Today's competition ends in:</p>
      <h2>{formatTime(timeLeft)}</h2>
    </div>


      <div className={styles.descBlock}>
        <img src={`${currentUserData?.profilePicture}`} alt="" />
       <p> you are currently at rank {currentUserRank}</p>
       <p>
       Only the top player with more than 100 Apex Flick cards will win the ₦30,000 prize in today’s competition.
       </p>
      
      </div>

      {/* Main Leaderboard List */}
      <div className={styles.chartArea}>
        <div className={styles.competitionPoint}>
          <h1>₦30,000</h1>

          <div className={styles.competitors}>
            {qualifiedUsers.map((user, index) => (
              <div className={styles.competitor} key={user.id}>
                <h2>{user.rank}</h2>
                <div className={styles.userDp}>
                  <img src={user.profilePicture} alt="dp" />
                </div>
                <h3>{user.username}</h3>
                <img className={styles.card} src={gameCard} alt="card" />
                <p>{user.apexCard}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
