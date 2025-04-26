import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/withdrawal.module.css';
import useWithdrawal from '../../hooks/withdrawal';
import { motion } from 'framer-motion';


const Withdrawal = () => {
    const navigate = useNavigate();
    const { userData, wallet } = useWithdrawal();
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef();

    const Backwards = () => navigate(-1);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.Withdrawal}>
            {/* Navbar */}
            <div className={styles.navbar}>
                <div className={styles.back}>
                    <svg onClick={Backwards} xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </div>
                <div className={styles.title}><h3>Balance</h3></div>
                <div className={styles.end}></div>
            </div>

            {/* Balance Display */}
            <div className={styles.balanceArea}>
                <div className={styles.balancePoint}>
                    <span>₦</span>{Number(wallet?.accountBalance ?? 0).toLocaleString()}
                </div>
            </div>

            {/* Bank Options */}
            <div className={styles.bankOptions}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    <button className={styles.btn}  onClick={handleOpenModal}>Withdraw</button>
                </div>

                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    <button className={styles.btn}  onClick={handleOpenModal}>Update</button>
                </div>

                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <button className={styles.btn} onClick={handleOpenModal}>Save Funds</button>
                </div>
            </div>

            {/* Transaction History */}
            <div className={styles.transactionHistory}>
                <div><hr /></div>
                <div className={styles.transactionRecordTitle}>
                    <h3>Transactions</h3>
                    <h3>₦{wallet?.history?.reduce((sum, h) => sum + (h.amount || 0), 0) ?? 0}</h3>
                </div>

                <div className={styles.transactionRecord}>
                    {wallet?.history && wallet.history.length > 0 ? (
                        wallet.history.map((tx, index) => (
                            <div className={styles.record} key={index}>
                                <div className={styles.purpose}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                    <h3>{tx.status === 'pending' ? 'Pending Withdrawal' : 'Withdrawal'}</h3>
                                </div>
                                <div className={styles.amount}>
                                    <span>₦</span>{tx.amount}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.record}>
                            <p>No transactions yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Glass Notice */}
            {showModal && (
    <motion.div
        className={styles.modalBackdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowModal(false)}
    >
        <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
</svg>

          <h3>Withdrawals Begin Wednesday, July 31st, 2025</h3>
<p>Our withdrawal system officially launches on <strong>Wednesday, July 31st, 2025</strong>. Until then, keep playing daily and grow your wallet. The more you earn now, the bigger your payout when it goes live!</p>

            <button onClick={() => setShowModal(false)}>OK</button>
        </motion.div>
    </motion.div>
)}

        </div>
    );
};

export default Withdrawal;
