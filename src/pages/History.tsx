import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { formatSet } from '../utils/format';

export function History() {
  const { workouts, exercises, bodyParts } = useWorkout();
  const [openId, setOpenId] = useState<string | null>(null);

  if (workouts.length === 0) {
    return (
      <div className="page">
        <section className="card">
          <h2>履歴</h2>
          <p className="empty-state">まだ記録がありません。トレを終了すると、ここに表示されます。</p>
        </section>
      </div>
    );
  }

  const sorted = [...workouts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="page">
      <ul className="history-list">
        {sorted.map((workout) => {
          const isOpen = openId === workout.id;
          const bodyPartNames = Array.from(
            new Set(
              workout.entries
                .map((entry) => exercises.find((e) => e.id === entry.exerciseId))
                .map((exercise) => bodyParts.find((part) => part.id === exercise?.bodyPartId)?.name)
                .filter((name): name is string => Boolean(name)),
            ),
          );

          return (
            <li key={workout.id} className="card history-list__item">
              <button
                type="button"
                className="history-list__row"
                onClick={() => setOpenId(isOpen ? null : workout.id)}
              >
                <span className="history-list__date">
                  {workout.date}　{bodyPartNames.join('・') || '記録なし'}
                </span>
                <span className="history-list__meta">
                  {workout.entries.length}種目 {isOpen ? '︿' : '﹀'}
                </span>
              </button>

              {isOpen && (
                <div className="history-list__detail">
                  {workout.entries.map((entry) => {
                    const exercise = exercises.find((e) => e.id === entry.exerciseId);
                    return (
                      <div key={entry.id} className="history-list__exercise">
                        <strong>{exercise?.name ?? '（削除された種目）'}</strong>
                        <span>{entry.sets.map((set) => formatSet(set)).join(', ')}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
