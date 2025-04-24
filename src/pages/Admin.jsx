import styles from "../../styles/admin.module.css";
import useAdminGameReset from "../../hooks/admin";

const Admin = () => {
  const { endGameplayForToday, loading, error, successMessage } = useAdminGameReset();

  return (
    <div className={styles.company}>
      <h1>Admin - End Gameplay for Today</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <button onClick={endGameplayForToday} disabled={loading}>
        {loading ? "Processing..." : "End Gameplay for Today"}
      </button>
    </div>
  );
};

export default Admin;
