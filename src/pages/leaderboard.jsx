import styles from '../../styles/leaderboard.module.css';
import React from 'react';
import gameCard from '../../images/apexcard.png';
import useLeaderboard from '../../hooks/leaderboard';
import { useNavigate } from 'react-router-dom'
import crown from '../../images/crown.png'
const Leaderboard = () => {
  const { qualifiedUsers, currentUserData, currentUserRank } = useLeaderboard();
  const navigate = useNavigate();

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

      <div className={styles.descBlock}>
        <img src={`${currentUserData?.profilePicture}`} alt="" />
       <p> you are currently at rank {currentUserRank}</p>
         <p>Note: Only users with more than 100 Apex Flick cards are eligible for the cash reward.
         </p>
      </div>

      {/* Main Leaderboard List */}
      <div className={styles.chartArea}>
        <div className={styles.competitionPoint}>
          <h1>₦10,000</h1>

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
