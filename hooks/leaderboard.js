import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/config";

const useLeaderboard = () => {
  const [qualifiedUsers, setQualifiedUsers] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const user = auth.currentUser;

        // 1. Fetch top 100 users ordered by Apex Cards
        const leaderboardQuery = query(
          collection(db, "users"),
          orderBy("gameplay.apexCard", "desc"),
          limit(100)
        );
        const snapshot = await getDocs(leaderboardQuery);

        const qualified = [];
        let rank = 0;
        let userIsInTop = false;

        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const apexCard = data.gameplay?.apexCard || 0;
          rank++;

          if (apexCard > -1) {
            const userData = {
              id: docSnap.id,
              username: data.username,
              profilePicture: data.profilePicture,
              apexCard,
              rank,
            };

            qualified.push(userData);
          }

          if (user && docSnap.id === user.uid) {
            setCurrentUserRank(rank);
            setCurrentUserData({
              id: docSnap.id,
              username: data.username,
              profilePicture: data.profilePicture,
              apexCard,
              rank,
            });
            userIsInTop = true;
          }
        });

        // 2. If current user not in top 100, fetch their data separately
        if (!userIsInTop && user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          if (userData) {
            const userApex = userData.gameplay?.apexCard || 0;
            const allUsersQuery = query(
              collection(db, "users"),
              orderBy("gameplay.apexCard", "desc")
            );
            const allUsersSnapshot = await getDocs(allUsersQuery);

            let userGlobalRank = 0;
            allUsersSnapshot.forEach((docSnap) => {
              const data = docSnap.data();
              const apexCard = data.gameplay?.apexCard || 0;

              userGlobalRank++;
              if (docSnap.id === user.uid) {
                setCurrentUserRank(userGlobalRank);
              }
            });

            setCurrentUserData({
              id: user.uid,
              username: userData.username,
              profilePicture: userData.profilePicture,
              apexCard: userApex,
              rank: userGlobalRank,
            });
          }
        }

        setQualifiedUsers(qualified);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return { qualifiedUsers, currentUserRank, currentUserData };
};

export default useLeaderboard;
