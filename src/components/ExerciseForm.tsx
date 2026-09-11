import { useState, type FormEvent } from 'react';
import type { BodyPart, Exercise } from '../types';
import { BODY_PARTS } from '../types';

interface Props {
  initial?: Exercise; // 指定があれば編集モード、なければ新規追加モード
  onSubmit: (name: string, bodyPart: BodyPart) => void;
  onCancel?: () => void;
}

export function ExerciseForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [bodyPart, setBodyPart] = useState<BodyPart>(initial?.bodyPart ?? '胸');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit(name, bodyPart);
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
        value={bodyPart}
        onChange={(event) => setBodyPart(event.target.value as BodyPart)}
      >
        {BODY_PARTS.map((part) => (
          <option key={part} value={part}>
            {part}
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
