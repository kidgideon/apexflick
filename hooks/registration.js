import { useState } from 'react';
import { auth, db } from '../config/config'; // adjust if your config path differs
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDocs, query, where, setDoc } from 'firebase/firestore';

const useRegister = () => {
  const [modal, setModal] = useState({ visible: false, message: '' });

  const showModal = (message) => setModal({ visible: true, message });
  const closeModal = () => setModal({ visible: false, message: '' });

  const isUsernameValid = (username) => /^[a-zA-Z0-9_]+$/.test(username);

  // Function to check if the username already exists
  const isUsernameTaken = async (username) => {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const existingUsers = await getDocs(q);
    return !existingUsers.empty;
  };

  const registerUser = async (username, email, password) => {
    try {
      if (!isUsernameValid(username)) {
        showModal('Username must not contain spaces or special characters.');
        return;
      }

      if (await isUsernameTaken(username)) {
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

      // Use RoboHash for avatar
      const avatarUrl = `https://robohash.org/${username}?set=set2&size=200x200`;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        username,
        email,
        profilePicture: avatarUrl,
        wins: [],
        gameplay: {
          roundsPlayed: 0,
          apexCard: 0,
          lastPlayed: null
        },
        friends: [],
        invitedMe: null,
        payback: { status: 'pending', datePaid: null },
        tasks: [],
        notifications: [],
        withdrawal: {
          accountBalance: 0,
          pendingAmount: 0,
          history: [],
          accountNumber: '',
          bank: ''
        }
      });

      showModal('Registration successful!');
    } catch (err) {
      console.error(err);
      showModal('An error occurred. Please try again.');
    }
  };

  // Google Authentication Method
  const googleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if the user already exists in Firestore
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const existingUsers = await getDocs(q);

      if (!existingUsers.empty) {
        showModal('This email is already associated with an account.');
        return;
      }

      if (await isUsernameTaken(user.displayName)) {
        showModal('Username is already taken. Please choose another one.');
        return;
      }


      // Create a profile document if new user
      const avatarUrl = `https://robohash.org/${user.displayName}?set=set2&size=200x200`;

      await setDoc(doc(db, 'users', user.uid), {
        username: user.displayName,
        email: user.email,
        profilePicture: avatarUrl,
        wins: [],
        gameplay: {
          roundsPlayed: 0,
          apexCard: 0,
          lastPlayed: null
        },
        friends: [],
        invitedMe: null,
        payback: { status: 'pending', datePaid: null },
        tasks: [],
        notifications: [],
        withdrawal: {
          accountBalance: 0,
          pendingAmount: 0,
          history: [],
          accountNumber: '',
          bank: ''
        }
      });

      showModal('Registration successful!');
    } catch (err) {
      console.error(err);
      showModal('Google authentication failed. Please try again.');
    }
  };

  return { registerUser, googleSignUp, modal, closeModal };
};

export default useRegister;
