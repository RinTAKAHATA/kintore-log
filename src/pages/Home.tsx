import { useNavigate } from 'react-router-dom';
import { BodyPartIntervalList } from '../components/BodyPartIntervalList';
import { BodyPartManager } from '../components/BodyPartManager';
import { useWorkout } from '../context/WorkoutContext';

export function Home() {
  const { activeWorkout, startWorkout } = useWorkout();
  const navigate = useNavigate();

  function handleStart() {
    if (!activeWorkout) startWorkout();
    navigate('/record');
  }

  return (
    <div className="page">
      <section className="card">
        <h2>部位別インターバル</h2>
        <BodyPartIntervalList />
        <BodyPartManager />
      </section>

      <button type="button" className="button button--primary button--large" onClick={handleStart}>
        {activeWorkout ? 'トレを再開' : 'トレを開始'}
      </button>
    </div>
  );
}
