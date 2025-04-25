import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../config/config';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [completedTask, setCompletedTask] = useState(0);
  const [userId, setUserId] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);

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

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;

      try {
        const [companySnap, userSnap] = await Promise.all([
          getDoc(doc(db, 'company', 'DTRPC8h4HayP2lg5HWRv')),
          getDoc(doc(db, 'users', userId)),
        ]);

        if (companySnap.exists() && userSnap.exists()) {
          const companyData = companySnap.data();
          const userData = userSnap.data();

          const userCompletedTasks = userData.completedTasks || [];

          // Tag each task with a `done` property
          const enrichedTasks = (companyData.task || [])
            .sort((a, b) => b.id - a.id)
            .map(task => ({
              ...task,
              done: userCompletedTasks.includes(task.id)
            }));

          setCompletedTaskIds(userCompletedTasks);
          setTasks(enrichedTasks);
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleTaskClick = async (task) => {
    if (completedTaskIds.includes(task.id)) return;
  
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
  
      const currentApexCard = userData?.gameplay?.apexCard || 0;
      const reward = task.reward;
  
      await updateDoc(userRef, {
        completedTasks: arrayUnion(task.id),
        'gameplay.apexCard': currentApexCard + reward
      });
  
      setCompletedTaskIds(prev => [...prev, task.id]);
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id ? { ...t, done: true } : t
        )
      );
      setCompletedTask(reward);
      setShowModal(true);
  
      if (task.link) {
        window.open(task.link, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };
  

  return { tasks, showModal, completedTask, setShowModal, handleTaskClick, completedTaskIds };
};

export default useTasks;
