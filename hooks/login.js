import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

const useLogin = () => {
  const [modal, setModal] = useState({ visible: false, message: '' });
  const navigate = useNavigate();

  const showModal = (message) => setModal({ visible: true, message });
  const closeModal = () => setModal({ visible: false, message: '' });

  const findUserByEmail = async (email) => {
    const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
    const result = await getDocs(q);
    return !result.empty;
  };

  const loginUser = async (email, password) => {
    try {
      const userExists = await findUserByEmail(email);
      if (!userExists) {
        showModal('Incorrect credentials. Please try again.');
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      showModal('Login successful!');
      setTimeout(() => navigate('/gameplay'), 1500);
    } catch (err) {
      console.error(err);
      showModal('Incorrect credentials. Please try again.');
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const email = user.email;
      const userExists = await findUserByEmail(email);
      if (!userExists) {
        showModal('No user with this email. Please signup first.');
        return;
      }

      showModal('Login successful!');
      setTimeout(() => navigate('/gameplay'), 1500);
    } catch (err) {
      console.error(err);
      showModal('Google login failed. Please try again.');
    }
  };

  return { loginUser, googleLogin, modal, closeModal };
};

export default useLogin;
