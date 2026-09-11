import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { ExerciseBlock } from './ExerciseBlock';
import { ExercisePicker } from './ExercisePicker';

/** 進行中のワークアウト（トレ中）を丸ごと表示・編集する画面本体 */
export function WorkoutEditor() {
  const {
    activeWorkout,
    exercises,
    bodyParts,
    addEntryToActiveWorkout,
    startRestForEntry,
    saveSet,
    deleteSet,
    finishWorkout,
    getLastRecordFor,
  } = useWorkout();
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();

  if (!activeWorkout) return null; // 呼び出し側（Record.tsx）でガードしている想定

  function handleFinish() {
    if (activeWorkout!.entries.length === 0) {
      if (!confirm('まだ記録がありませんが、トレを終了しますか？')) return;
    }
    finishWorkout();
    navigate('/');
  }

  return (
    <div className="page">
      <div className="workout-editor__toolbar">
        <span className="workout-editor__date">トレ中：{activeWorkout.date}</span>
        <button type="button" className="button" onClick={handleFinish}>
          トレを終了
        </button>
      </div>

      {activeWorkout.entries.map((entry) => {
        const exercise = exercises.find((e) => e.id === entry.exerciseId);
        if (!exercise) return null;
        const bodyPart = bodyParts.find((part) => part.id === exercise.bodyPartId);
        return (
          <ExerciseBlock
            key={entry.id}
            entry={entry}
            exercise={exercise}
            bodyPart={bodyPart}
            lastRecord={getLastRecordFor(exercise.id)}
            onStartRest={() => startRestForEntry(entry.id)}
            onSaveSet={(setId, weight, reps, drops) => saveSet(entry.id, setId, weight, reps, drops)}
            onDeleteSet={(setId) => deleteSet(entry.id, setId)}
          />
        );
      })}

      {showPicker ? (
        <section className="card">
          <h3>種目を選ぶ</h3>
          <ExercisePicker
            onSelect={(exercise) => {
              addEntryToActiveWorkout(exercise.id);
              setShowPicker(false);
            }}
          />
          <button type="button" className="button" onClick={() => setShowPicker(false)}>
            閉じる
          </button>
        </section>
      ) : (
        <button type="button" className="button button--primary" onClick={() => setShowPicker(true)}>
          ＋ 種目を追加
        </button>
      )}
    </div>
  );
}
