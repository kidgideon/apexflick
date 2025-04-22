import styles from '../../styles/task.module.css';
import { useNavigate } from 'react-router-dom';
import card from '../../images/apexcard.png';
import useTasks from '../../hooks/task';

const Task = ({ userId }) => {
  const navigate = useNavigate();
  
  // Get tasks and logic from the custom hook
  const {
    tasks,
    showModal,
    completedTask,
    setShowModal,
    handleTaskClick
  } = useTasks(userId);

  const Backwards = () => navigate(-1);

  return (
    <div className={styles.taskOverview}>
      {/* Modal for task completion */}
      {showModal && (
        <div className={styles.rewardModal}>
          <h3>Task Complete</h3>
          <p>You earned <strong>+{completedTask}</strong> Apex Cards</p>
          <button onClick={() => setShowModal(false)}>OK</button>
        </div>
      )}

      {/* Navbar */}
      <div className={styles.navbar}>
        <div className={styles.back}>
          <svg onClick={Backwards} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
        <div className={styles.title}><h3>Tasks</h3></div>
        <div className={styles.end}></div>
      </div>

      {/* Task List */}
      <div className={styles.allTasks}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.task}>
            <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
</svg>

            </div>
            <div className={styles.text}>{task.text}</div>
            <div className={styles.reward}>
              <img src={card} alt="reward" />
              <span>+{task.reward}</span>
            </div>
            <div className={styles.btn}>
              <button
                onClick={() => handleTaskClick(task)}
                disabled={task.done} // Disable button if task is already done
              >
                {task.done ? 'Completed' : 'Follow Us'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
