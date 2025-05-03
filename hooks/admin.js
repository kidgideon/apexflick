import { useState } from 'react';
import { db } from '../config/config'; // your firebase config
import { doc, getDocs, writeBatch, arrayUnion, increment, Timestamp, collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // For generating unique notification ID

const useAdminGameReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const dailyReward = 30000;  // Reward amount for the winner

  const endGameplayForToday = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Step 1: Fetch all users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (users.length === 0) {
        throw new Error('No users found');
      }

      // Step 2: Find the top scorer (only consider those with apexCard > 100)
      let topUser = null;
      let topScore = 0;  // Start with 0 to ensure the score is greater than 100

      users.forEach(user => {
        const { gameplay } = user;
        if (gameplay?.apexCard > 100 && gameplay?.apexCard > topScore) {
          topScore = gameplay?.apexCard || 0;
          topUser = user;
        }
      });

      if (!topUser) {
        throw new Error('No winner found with sufficient apexCard score');
      }

      // Step 3: Update all users' gameplay to 0
      const batch = writeBatch(db);
      users.forEach(user => {
        const userRef = doc(db, "users", user.id);
        batch.update(userRef, {
          "gameplay.apexCard": 0,
          "gameplay.roundsPlayed": 0,
          "gameplay.lastPlayed": null,  // Optional: Reset last played timestamp
        });
      });

      // Step 4: Update company `winners` array and `lastGameReset` timestamp
      const companyRef = doc(db, "company", "hRXmonvi8q1ts5h6OqSs");
      batch.update(companyRef, {
        winners: arrayUnion({
          userId: topUser.id,
          date: Date.now(),
          amount: topScore,
          reward: dailyReward,
        }),
        lastGameReset: Date.now(),
      });

      // Step 5: Send notification to all users
      const notification = {
        text: `${topUser.username} won today's Apex Flick! 🏆`,
        date: Date.now(),
        link: "/winners",
        read: false,
        id: uuidv4(), 
      };

       // Step 5: Send notification to all users
       const notificationTwo = {
        text: `${topUser.username} won todays 30,000 naira! 🏆`,
        date: Date.now(),
        link: "/winners",
        read: false,
        id: uuidv4(), 
      };

      users.forEach(user => {
        const userRef = doc(db, "users", user.id);
        batch.update(userRef, {
          notifications: arrayUnion(notification, notificationTwo),
        });
      });

      // Step 6: Send special notification to winner
      const winnerNotification = {
        text: "You won today's Apex Flick! 🏆",
        date: Date.now(),
        link: "/winners",
        read: false,
        id: uuidv4(), 
      };

       // Step 6: Send special notification to winner
       const winnerNotificationTwo = {
        text: "congratulations you won 30,000 Naira 🏆",
        date: Date.now(),
        link: "/withdraw",
        read: false,
        id: uuidv4(), 
      };

      const winnerRef = doc(db, "users", topUser.id);
      batch.update(winnerRef, {
        notifications: arrayUnion(winnerNotification, winnerNotificationTwo),
        "withdrawal.accountBalance": increment(dailyReward),
      });

      // Step 7: Commit batch update
      await batch.commit();

      // Step 8: Success Message
      setSuccessMessage('Gameplay has been reset, and the winner has been updated.');

    } catch (err) {
      console.error("Error ending gameplay:", err);
      setError(err.message || 'An error occurred during gameplay reset.');
    } finally {
      setLoading(false);
    }
  };

  return { endGameplayForToday, loading, error, successMessage };
};

export default useAdminGameReset;
