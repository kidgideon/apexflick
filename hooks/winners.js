import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/config';
import { format, subDays, addDays, isAfter } from 'date-fns';

const COMPANY_DOC_ID = 'hRXmonvi8q1ts5h6OqSs';

const useWinners = () => {
  const [userId, setUserId] = useState(null);  // Might be useful later
  const [winners, setWinners] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Handle auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch winners for the current selected date
  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      try {
        const companyRef = doc(db, 'company', COMPANY_DOC_ID);
        const companySnap = await getDoc(companyRef);
        const companyData = companySnap.data();
        const allWinners = companyData?.winners || [];

        // Filter by selected date
        const formattedTargetDate = format(selectedDate, 'yyyy-MM-dd');
        const filtered = allWinners.filter(w =>
          format(new Date(w.date), 'yyyy-MM-dd') === formattedTargetDate
        );

        const detailedWinners = await Promise.all(filtered.map(async (winner) => {
          const userRef = doc(db, 'users', winner.userId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          return {
            ...winner,
            username: userData?.username || 'Unknown',
            picture: userData?.profilePicture || null,
          };
        }));

        setWinners(detailedWinners);
      } catch (err) {
        console.error("Failed to fetch winners:", err);
        setWinners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [selectedDate]);

  // Navigation
  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    const nextDate = addDays(selectedDate, 1);
    if (!isAfter(nextDate, new Date())) {
      setSelectedDate(nextDate);
    }
  };

  const pickDate = (date) => {
    setSelectedDate(new Date(date));
  };

  return {
    winners,
    loading,
    selectedDate,
    pickDate,
    goToPreviousDay,
    goToNextDay,
  };
};

export default useWinners;
