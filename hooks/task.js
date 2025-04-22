import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/config';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [completedTask, setCompletedTask] = useState(0);
  const [userId, setUserId] = useState(null);  // State to hold the current user's ID

  // Fetch the current user ID from Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);  // Set user ID if the user is logged in
      } else {
        setUserId(null);  // Clear user ID if user is logged out
      }
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Fetch tasks for the logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("Fetched tasks:", userData.tasks);  // Add log here for debugging
          setTasks(userData.tasks || []);  // Load tasks
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, [userId]);  // Run this effect whenever userId changes

  // Mark a task as done and update the user's apexCard
  const handleTaskClick = async (task) => {
    if (task.done) return; // Do nothing if already done
  
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      const userData = docSnap.data();
  
      const updatedTasks = (userData.tasks || []).map((t) => {
        if (task.id === t.id && !t.done) {
          return { ...t, done: true }; // Mark task as done
        }
        return t;
      });
  
      const completedTask = updatedTasks.find(t => t.id === task.id);
      if (completedTask) {
        const currentApexCard = userData?.gameplay?.apexCard || 0;
        const reward = completedTask.reward;
  
        await updateDoc(userRef, {
          tasks: updatedTasks,
          'gameplay.apexCard': currentApexCard + reward,
        });
  
        // Update local tasks state
        setTasks(updatedTasks);
        setCompletedTask(reward);
        setShowModal(true);
  
        // ✅ Open the task link in a new tab after updating Firestore
        if (task.link) {
          window.open(task.link, "_blank", "noopener,noreferrer");
        }
      }
    } catch (err) {
      console.error("Failed to mark task as done:", err);
    }
  };
  
  return { tasks, showModal, completedTask, setShowModal, handleTaskClick };
};

export default useTasks;
