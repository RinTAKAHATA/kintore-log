import { useMemo, useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { ExerciseForm } from './ExerciseForm';
import { BodyPartBadge } from './BodyPartBadge';
import type { Exercise } from '../types';

interface Props {
  // 記録画面から「この種目を今日のメニューに追加する」用に使う（次のステップで接続する）
  onSelect?: (exercise: Exercise) => void;
}

/**
 * 種目の検索・一覧・追加・編集・削除をまとめて行うパーツ。
 * 「記録画面から種目を追加」と「種目マスタを編集」を別画面にすると
 * 二重管理になってしまう、という指摘を受けて1つにまとめた。
 */
export function ExercisePicker({ onSelect }: Props) {
  const { exercises, addExercise, updateExercise, deleteExercise, bodyParts } = useWorkout();
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = useMemo(
    () => exercises.filter((exercise) => exercise.name.toLowerCase().includes(query.toLowerCase())),
    [exercises, query],
  );

  return (
    <div className="exercise-picker">
      <input
        className="exercise-picker__search"
        type="text"
        placeholder="種目を検索"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {filtered.length === 0 && (
        <p className="empty-state">
          {exercises.length === 0
            ? 'まだ種目が登録されていません。下から追加してください。'
            : '一致する種目がありません。'}
        </p>
      )}

      <ul className="exercise-picker__list">
        {filtered.map((exercise) =>
          editingId === exercise.id ? (
            <li key={exercise.id} className="exercise-picker__item exercise-picker__item--editing">
              <ExerciseForm
                initial={exercise}
                onSubmit={(name, bodyPart) => {
                  updateExercise(exercise.id, name, bodyPart);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li key={exercise.id} className="exercise-picker__item">
              <button
                type="button"
                className="exercise-picker__row"
                onClick={() => onSelect?.(exercise)}
              >
                <span className="exercise-picker__name">{exercise.name}</span>
                {(() => {
                  const part = bodyParts.find((p) => p.id === exercise.bodyPartId);
                  return <BodyPartBadge name={part?.name ?? '不明'} color={part?.color ?? '#9aa0ad'} />;
                })()}
              </button>
              <div className="exercise-picker__row-actions">
                <button type="button" className="link-button" onClick={() => setEditingId(exercise.id)}>
                  編集
                </button>
                <button
                  type="button"
                  className="link-button link-button--danger"
                  onClick={() => {
                    if (confirm(`「${exercise.name}」を削除しますか？`)) {
                      deleteExercise(exercise.id);
                    }
                  }}
                >
                  削除
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {showAddForm ? (
        <ExerciseForm
          onSubmit={(name, bodyPart) => {
            addExercise(name, bodyPart);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button type="button" className="button button--primary" onClick={() => setShowAddForm(true)}>
          ＋ 新しい種目を追加
        </button>
      )}
    </div>
  );
}
