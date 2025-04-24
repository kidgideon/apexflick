import { useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/notification";
import styles from "../../styles/notification.module.css";

const Notification = () => {
  const navigate = useNavigate();
  const { notifications, loading, error, markNotificationAsRead } = useNotifications();

  const Backwards = () => navigate(-1);

  const handleNotificationClick = (notificationId, link) => {
    if (!link) {
      console.warn("No link provided for notification:", notificationId);
      return;
    }
    markNotificationAsRead(notificationId, link);
  };


  return (
    <div className={styles.notificationsInterface}>
      <div className={styles.navBar}>
        <div className={styles.back}>
          <svg
            onClick={Backwards}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </div>
        <div className={styles.mid}>
          <h3>Notifications</h3>
        </div>
        <div className={styles.end}></div>
      </div>

      <div className={styles.notifications}>
        {notifications.length === 0 ? (
          <p>No notifications available</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={styles.notification}
              onClick={() => handleNotificationClick(notification.id, notification.link)}
            >
                 <div className={styles.firstPath}>
                 <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <h4>{notification.text || "No message"}</h4>
                 </div>

              <p className={styles.date}>
                {notification.date
                  ? new Date(notification.date).toLocaleString()
                  : "Unknown date"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
