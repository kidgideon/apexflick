import styles from '../../styles/friends.module.css';
import useFriends from '../../hooks/friends';
import { useNavigate } from 'react-router-dom';

const Friends = () => {
    const { currentUserData, friendsData, loading } = useFriends();
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const handleInvite = async () => {
        if (!currentUserData?.id) return;

        const shareLink = `https://www.apexflick.com/signup/onme/${currentUserData.id}`;
        const shareData = {
            title: 'Join Me on Apex Flick!',
            text: 'Get 15 Apex cards when you join and play! 💸🔥',
            url: shareLink,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support navigator.share
                await navigator.clipboard.writeText(shareLink);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <div className={styles.friendsInterface}>
            <div className={styles.navBar}>
                <div className={styles.back}>
                    <svg onClick={goBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </div>
                <div className={styles.mid}><h3>Invite</h3></div>
                <div className={styles.front}></div>
            </div>

            {loading ? (
                <p className={styles.loadingText}>Loading...</p>
            ) : (
                <>
                    {currentUserData && (
                        <div className={styles.userCard}>
                            <div className={styles.card}>
                                <div className={styles.userImg}>
                                    <img src={currentUserData.profilePicture || "/default-avatar.png"} alt="Your Avatar" />
                                </div>
                                <h4>{currentUserData.username}</h4>
                                <button onClick={handleInvite}>Invite Friends</button>
                                <p>Note: For every invite, you get 15 Apex cards once the user gets up to 200 Apex cards.</p>
                            </div>
                        </div>
                    )}

                    <h1>Invites</h1>
                    <div className={styles.friendsInvited}>
                        {friendsData.length === 0 ? (
                            <p className={styles.emptyState}>You haven’t invited any friends yet.</p>
                        ) : (
                            friendsData.map((friend) => (
                                <div className={styles.friend} key={friend.id}>
                                    <div className={styles.friendDp}>
                                        <img src={friend.profilePicture || "/default-avatar.png"} alt={friend.username} />
                                    </div>
                                    <p>{friend.username}</p>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Friends;
