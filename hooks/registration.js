import { useState } from 'react';
import { auth, db } from '../config/config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDocs, query, where, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For generating unique notification ID

// Utility to normalize and validate usernames
const normalizeUsername = (name) => name.toLowerCase().replace(/[^a-z0-9_]/g, '');
const generateRandomSuffix = () => Math.random().toString(36).substring(2, 6);

// Core hook
const useRegister = () => {
  const [modal, setModal] = useState({ visible: false, message: '' });
  const navigate = useNavigate();

  const showModal = (message) => setModal({ visible: true, message });
  const closeModal = () => setModal({ visible: false, message: '' });

  const isUsernameValid = (username) => /^[a-zA-Z0-9_]+$/.test(username);

  const isUsernameTaken = async (username) => {
    const normalized = username.toLowerCase();
    const q = query(collection(db, 'users'), where('username', '==', normalized));
    const existingUsers = await getDocs(q);
    return !existingUsers.empty;
  };

  const notify = async (userId, sento) => {
    try {
      const sentoRef = doc(db, 'users', sento);
      const sentoSnap = await getDoc(sentoRef);
  
      if (!sentoSnap.exists()) {
        throw new Error('User to notify does not exist');
      }
  
      // Notification object
      const newNotification = {
        id: uuidv4(),
        link: "/friends",
        text: "Congrats! A friend just signed up.",
        date: Date.now(),
        read: false,
      };
  
      // Friend object with timestamp
      const newFriend = {
        userId,
        dateAdded: Date.now(),
      };
  
      await updateDoc(sentoRef, {
        friends: arrayUnion(newFriend),
        notifications: arrayUnion(newNotification),
      });
  
   
    } catch (error) {
      console.error("Error in notify function:", error);
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const normalizedUsername = normalizeUsername(username);

      if (!isUsernameValid(normalizedUsername)) {
        showModal('Username must not contain spaces or special characters.');
        return;
      }

      if (await isUsernameTaken(normalizedUsername)) {
        showModal('Username is already taken. Please choose another one.');
        return;
      }

      if (password.length < 7) {
        showModal('Password must be more than 6 characters.');
        return;
      }

      const q = query(collection(db, 'users'), where('email', '==', email));
      const existingUsers = await getDocs(q);
      if (!existingUsers.empty) {
        showModal('An account with this email already exists.');
        return;
      }

      const avatarUrl = `https://robohash.org/${normalizedUsername}?set=set2&size=200x200`;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        username: normalizedUsername,
        email,
        profilePicture: avatarUrl,
        wins: [],
        gameplay: {
          roundsPlayed: 0,
          apexCard: 0,
          lastPlayed: null,
        },
        friends: [],
        invitedMe: null,
        payback: true,
        tasks: [{id:1, text: "follow us on instagram", link: "", done: false, reward: 15}],
        notifications: [],
        withdrawal: {
          accountBalance: 0,
          pendingAmount: 0,
          history: [],
        },
      });

      showModal('Registration successful!');
      setTimeout(() => {
        navigate('/login')
       }, 3000)
    } catch (err) {
      console.error(err);
      showModal('An error occurred. Please try again.');
    }
  };

  const googleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const email = user.email;
      const displayName = user.displayName || email.split('@')[0];
      let baseUsername = normalizeUsername(displayName);
      let username = `${baseUsername}_${generateRandomSuffix()}`;

      while (await isUsernameTaken(username)) {
        username = `${baseUsername}_${generateRandomSuffix()}`;
      }

      const q = query(collection(db, 'users'), where('email', '==', email));
      const existingUsers = await getDocs(q);

      if (!existingUsers.empty) {
        showModal('This email is already associated with an account.');
        return;
      }

      const avatarUrl = `https://robohash.org/${username}?set=set2&size=200x200`;

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        profilePicture: avatarUrl,
        wins: [],
        gameplay: {
          roundsPlayed: 0,
          apexCard: 0,
          lastPlayed: null,
        },
        friends: [],
        invitedMe: null,
        payback: false,
        tasks: [],
        notifications: [],
        withdrawal: {
          accountBalance: 0,
          pendingAmount: 0,
          history: [],
        },
      });

      showModal('Registration successful!');
      setTimeout(() => {
        navigate('/login')
       }, 3000)
    } catch (err) {
      console.error(err);
      showModal('Google authentication failed. Please try again.');
    }
  };

  const registerUserOnMe = async (username, email, password, userId) => {
    try {
      const normalizedUsername = normalizeUsername(username);

      if (!isUsernameValid(normalizedUsername)) {
        showModal('Username must not contain spaces or special characters.');
        return;
      }

      if (await isUsernameTaken(normalizedUsername)) {
        showModal('Username is already taken. Please choose another one.');
        return;
      }

      if (password.length < 7) {
        showModal('Password must be more than 6 characters.');
        return;
      }

      const q = query(collection(db, 'users'), where('email', '==', email));
      const existingUsers = await getDocs(q);
      if (!existingUsers.empty) {
        showModal('An account with this email already exists.');
        return;
      }

      const avatarUrl = `https://robohash.org/${normalizedUsername}?set=set2&size=200x200`;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        username: normalizedUsername,
        email,
        profilePicture: avatarUrl,
        wins: [],
        gameplay: {
          roundsPlayed: 0,
          apexCard: 0,
          lastPlayed: null,
        },
        friends: [],
        invitedMe: userId,
        payback: false,
        tasks: [{id:1, text: "follow us on instagram", link: "", done: false, reward: 15}],
        notifications: [],
        withdrawal: {
          accountBalance: 0,
          pendingAmount: 0,
          history: [],
          accountNumber: '',
          bank: '',
        },
      });

      await notify(uid, userId); // 

      showModal('Registration successful!');
    
      setTimeout(() => {
       navigate('/login')
      }, 3000)
    } catch (err) {
      console.error(err);
      showModal('An error occurred. Please try again.');
    }
  };

  const googleSignUpOnMe = async (userId) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const email = user.email;
      const displayName = user.displayName || email.split('@')[0];
      let baseUsername = normalizeUsername(displayName);
      let username = `${baseUsername}_${generateRandomSuffix()}`;

      while (await isUsernameTaken(username)) {
        username = `${baseUsername}_${generateRandomSuffix()}`;
      }

      const q = query(collection(db, 'users'), where('email', '==', email));
      const existingUsers = await getDocs(q);

      if (!existingUsers.empty) {
        showModal('This email is already associated with an account.');
        return;
      }

      const avatarUrl = `https://robohash.org/${username}?set=set2&size=200x200`;

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        profilePicture: avatarUrl,
        wins: [],
        gameplay: {
          roundsPlayed: 0,
          apexCard: 0,
          lastPlayed: null,
        },
        friends: [],
        invitedMe: userId,
        payback: false,
        tasks: [],
        notifications: [],
        withdrawal: {
          accountBalance: 0,
          pendingAmount: 0,
          history: [],
          accountNumber: '',
          bank: '',
        },
      });

      await notify(uid, userId); // 

      showModal('Registration successful!');
   setTimeout(() => {
    navigate('/login')
   }, 3000)
    } catch (err) {
      console.error(err);
      showModal('Google authentication failed. Please try again.');
    }
  };

  return { registerUser, googleSignUp, modal, closeModal, registerUserOnMe, googleSignUpOnMe };
};

export default useRegister;
