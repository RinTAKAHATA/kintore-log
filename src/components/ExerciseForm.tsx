import { useState, type FormEvent } from 'react';
import type { Exercise } from '../types';
import { useWorkout } from '../context/WorkoutContext';

interface Props {
  initial?: Exercise; // 指定があれば編集モード、なければ新規追加モード
  onSubmit: (name: string, bodyPartId: string) => void;
  onCancel?: () => void;
}

export function ExerciseForm({ initial, onSubmit, onCancel }: Props) {
  const { bodyParts } = useWorkout();
  const [name, setName] = useState(initial?.name ?? '');
  const [bodyPartId, setBodyPartId] = useState(initial?.bodyPartId ?? bodyParts[0]?.id ?? '');

  if (bodyParts.length === 0) {
    return (
      <p className="empty-state">
        先に部位を追加してください（ホーム画面の「部位別インターバル」から追加できます）。
      </p>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !bodyPartId) return;
    onSubmit(name, bodyPartId);
    if (!initial) {
      setName(''); // 新規追加のときは続けて入力できるように空にする
    }
  }

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <input
        className="exercise-form__input"
        type="text"
        placeholder="種目名（例：ベンチプレス）"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <select
        className="exercise-form__select"
        value={bodyPartId}
        onChange={(event) => setBodyPartId(event.target.value)}
      >
        {bodyParts.map((part) => (
          <option key={part.id} value={part.id}>
            {part.name}
          </option>
        ))}
      </select>
      <div className="exercise-form__actions">
        <button type="submit" className="button button--primary">
          {initial ? '更新する' : '追加する'}
        </button>
        {onCancel && (
          <button type="button" className="button" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
