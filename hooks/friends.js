import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/config";

const useFriends = () => {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
          console.error("User document not found.");
          return;
        }

        const userData = userSnapshot.data();
        setCurrentUserData({ id: user.uid, ...userData });

        const friendsList = userData.friends || [];
        if (friendsList.length === 0) {
          setFriendsData([]);
          setLoading(false);
          return;
        }

        const userIds = friendsList.map((f) => f.userId);
        const usersCollection = collection(db, "users");
        const allFriends = [];

        const chunkSize = 10;
        for (let i = 0; i < userIds.length; i += chunkSize) {
          const chunk = userIds.slice(i, i + chunkSize);
          const q = query(usersCollection, where("__name__", "in", chunk));
          const snapshot = await getDocs(q);

          snapshot.forEach((doc) => {
            const fullFriend = friendsList.find((f) => f.userId === doc.id);
            allFriends.push({
              id: doc.id,
              ...doc.data(),
              dateAdded: fullFriend?.dateAdded || null,
            });
          });
        }

        // Optional: sort by newest added friend
        allFriends.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );

        setFriendsData(allFriends);
        setLoading(false);
      } catch (err) {
        console.error("Error loading user/friends data:", err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return { currentUserData, friendsData, loading };
};

export default useFriends;
