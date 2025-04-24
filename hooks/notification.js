import { useState, useEffect } from 'react';
import {  doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/config';
import { useNavigate } from 'react-router-dom';  // Using useNavigate for React Router v6

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // useNavigate hook

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("No user is currently authenticated.");
          setLoading(false);
          return;
        }
  
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const notificationsArray = data.notifications || [];
  
          // Sort by date descending
          const sortedNotifications = notificationsArray.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });
  
          setNotifications(sortedNotifications);
        } else {
          console.warn("User document not found");
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotifications();
  }, []);
  

  // Function to mark notification as read and navigate to the link
  const markNotificationAsRead = async (notificationId, link) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("No user authenticated");
        return;
      }
  
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        const notificationsArray = data.notifications || [];
  
        // Update the specific notification
        const updatedNotifications = notificationsArray.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        );
  
        // Write the updated array back to the document
        await updateDoc(userDocRef, {
          notifications: updatedNotifications,
        });
  
        // Navigate after updating
        navigate(link);
      } else {
        console.warn("User document not found");
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };
  
  return { notifications, loading, error, markNotificationAsRead };
};

export default useNotifications;
