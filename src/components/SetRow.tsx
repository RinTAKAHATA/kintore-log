import { useEffect, useState } from 'react';
import type { SetRecord } from '../types';
import { formatElapsed } from '../utils/date';
import { NumberStepper } from './NumberStepper';

interface Props {
  set: SetRecord;
  onSave: (weight: number, reps: number) => void;
  onDelete: () => void;
}

/**
 * 1セット分の表示。
 * confirmed=trueなら「保存済み」の表示だけ。
 * confirmed=falseなら「レスト中」＝ストップウォッチ＋入力フォームを表示する。
 */
export function SetRow({ set, onSave, onDelete }: Props) {
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);
  const [elapsedSec, setElapsedSec] = useState(0);

  // レスト中の間だけ、1秒ごとに経過時間を数える
  useEffect(() => {
    if (set.confirmed) return;
    const startedAt = Date.now();
    const timerId = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(timerId);
  }, [set.confirmed, set.id]);

  if (set.confirmed) {
    return (
      <div className="set-row set-row--done">
        <span className="set-row__summary">
          {set.weight}kg × {set.reps}回
        </span>
        <button type="button" className="link-button link-button--danger" onClick={onDelete}>
          削除
        </button>
      </div>
    );
  }

  return (
    <div className="set-row set-row--resting">
      <div className="set-row__timer">⏱ レスト中 {formatElapsed(elapsedSec)}</div>
      <div className="set-row__inputs">
        <NumberStepper label="重量(kg)" value={weight} step={2.5} onChange={setWeight} />
        <NumberStepper label="回数" value={reps} step={1} onChange={setReps} />
      </div>
      <div className="set-row__actions">
        <button
          type="button"
          className="button button--primary"
          onClick={() => onSave(weight, reps)}
        >
          保存
        </button>
        <button type="button" className="link-button link-button--danger" onClick={onDelete}>
          削除
        </button>
      </div>
    </div>
  );
}
