import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Correct hook
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/config";

const useWithdrawal = () => {
    const [userData, setUserData] = useState(null);
    const [wallet, setWallet] = useState(null);
    const navigate = useNavigate(); // ✅ Correct hook

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate("/");
                return;
            }

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDocRef);

                if (userSnapshot.exists()) {
                    const data = userSnapshot.data();
                    setUserData(data);

                    const withdrawal = data.withdrawal || {};
                    const walletData = {
                        accountBalance: withdrawal.accountBalance || 0,
                        accountNumber: withdrawal.accountNumber || "",
                        bank: withdrawal.bank || "",
                        history: withdrawal.history || [],
                        pendingAmount: withdrawal.pendingAmount || 0,
                    };

                    setWallet(walletData);
                } else {
                    console.error("User document does not exist.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        });

        return () => unsubscribe();
    }, [navigate]); // ✅ no undefined values

    return { userData, wallet };
};

export default useWithdrawal;
