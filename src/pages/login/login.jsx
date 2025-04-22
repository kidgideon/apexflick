import { useState } from 'react';
import styles from  '../../../styles/register.module.css';
import { Link } from 'react-router-dom';
import Logo from '../../../images/apexflick logo.jpg';
import googleicon from '../../../images/google icon.png';
import useLogin from '../../../hooks/login';
import { motion } from 'framer-motion';
import mrApex from '../../../images/mrapex.png'

 const Login = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const [isLoading, setIsLoading] = useState(false); // Loading state
      const {loginUser, googleLogin, modal, closeModal} = useLogin();

       // Handle the registration submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        try {
            console.log('Attempting to register user');
            await loginUser(email, password);
            console.log('login successful');
        } catch (error) {
            console.error('Error during Login:', error);  // Log error
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

  return(
    <div className={styles.overlay}>
        <div className={styles.glassPrism}>
        <div className={styles.logoArea}>
                <img src={Logo} alt="Logo" />
                <h3>Welcome back signin</h3>
            </div>

            <div className={styles.formArea}  onSubmit={handleSubmit}>
                <form className={styles.loginForm} >

                    {/* Email Field */}
                    <div className={styles.inputContainer}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 
                                4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 
                                0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        <input className={styles.inputField} onChange={(e) => setEmail(e.target.value)}  value={email} type="email" placeholder="Email" />
                    </div>

                    {/* Password Field */}
                    <div className={styles.passwordContainer}>
                        <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 
                                1 0-.639C3.423 7.51 7.36 4.5 
                                12 4.5c4.638 0 8.573 3.007 
                                9.963 7.178.07.207.07.431 0 
                                .639C20.577 16.49 16.64 19.5 12 
                                19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        <input
                            className={styles.inputField}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}
                        />

                        {showPassword ? (
                            <svg onClick={() => setShowPassword(false)} className={styles.rightIcon}
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 
                                    12C3.226 16.338 7.244 19.5 12 19.5c.993 
                                    0 1.953-.138 2.863-.395M6.228 
                                    6.228A10.451 10.451 0 0 1 12 4.5c4.756 
                                    0 8.773 3.162 10.065 7.498a10.522 
                                    10.522 0 0 1-4.293 5.774M6.228 
                                    6.228 3 3m3.228 3.228 3.65 
                                    3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 
                                    0a3 3 0 1 0-4.243-4.243m4.242 
                                    4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg onClick={() => setShowPassword(true)} className={styles.rightIcon}
                                xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 
                                    1 0-.639C3.423 7.51 7.36 4.5 
                                    12 4.5c4.638 0 8.573 3.007 
                                    9.963 7.178.07.207.07.431 0 
                                    .639C20.577 16.49 16.64 19.5 12 
                                    19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )}
                    </div>
     <p className={styles.superP}>
     <Link className={styles.linkText} to={'/forget-password'}>Forgot password?</Link>
     </p>
                    <button type="submit" disabled={isLoading}>Sign in</button>
                </form>

                <div className={styles.continuePrompt}>  <hr /> <p>Continue with</p> <hr /></div>

                <div className={styles.continueArea}>
                    <div onClick={googleLogin}  className={styles.googleContinue}>
                        <img src={googleicon} alt="Google icon" />
                        <p>Google</p>
                    </div>
                </div>
                 
                <div>
                    <p>Don't have an account? <Link className={styles.linkText} to={'/register'}>signup</Link></p>
                </div>
            </div>
        </div>
              {/* Modal with Framer Motion animation */}
              {modal.visible && (
                    <motion.div 
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}  // Start invisible
                        animate={{ opacity: 1 }}  // Fade in
                        exit={{ opacity: 0 }}    // Fade out on exit
                        transition={{ duration: 0.3 }}  // Animation duration
                    >
                        <motion.div 
                            className={styles.modal}
                            initial={{ scale: 0.8 }}  // Start scaled down
                            animate={{ scale: 1 }}    // Scale up
                            exit={{ scale: 1.0 }}     // Scale down on exit
                            transition={{ duration: 0.3 }}  // Animation duration
                        >
                             <div className={styles.mrapexdiv}>
                                <img src={mrApex} alt="" />
                             </div>
                            <p>{modal.message}</p>
                            <button onClick={closeModal}>OK</button>
                        </motion.div>
                    </motion.div>
                )}
    </div>
  )
 }

 export default Login;