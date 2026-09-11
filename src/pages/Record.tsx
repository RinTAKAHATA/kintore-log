import { useWorkout } from '../context/WorkoutContext';
import { WorkoutEditor } from '../components/WorkoutEditor';

export function Record() {
  const { activeWorkout, startWorkout } = useWorkout();

  if (!activeWorkout) {
    return (
      <div className="page">
        <section className="card">
          <h2>記録</h2>
          <p className="card__note">「トレを開始」を押すと、ここにワークアウトの記録画面が出ます。</p>
          <button type="button" className="button button--primary" onClick={startWorkout}>
            トレを開始
          </button>
        </section>
      </div>
    );
  }

  return <WorkoutEditor />;
}
