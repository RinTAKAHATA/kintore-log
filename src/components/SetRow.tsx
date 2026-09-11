import { useEffect, useState } from 'react';
import type { DropStage, SetRecord } from '../types';
import { formatElapsed } from '../utils/date';
import { formatSet } from '../utils/format';
import { NumberStepper } from './NumberStepper';

interface Props {
  set: SetRecord;
  onSave: (weight: number, reps: number, drops: DropStage[]) => void;
  onDelete: () => void;
}

/**
 * 1セット分の表示。
 * confirmed=trueなら「保存済み」の表示だけ（ドロップセットなら段を→でつなげて表示）。
 * confirmed=falseなら「レスト中」＝ストップウォッチ＋入力フォームを表示する。
 * ドロップセットは「ドロップで続ける」で、メインの重量・回数の下に段を追加していく。
 */
export function SetRow({ set, onSave, onDelete }: Props) {
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);
  const [drops, setDrops] = useState<DropStage[]>(set.drops ?? []);
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
        <span className="set-row__summary">{formatSet(set)}</span>
        <button type="button" className="link-button link-button--danger" onClick={onDelete}>
          削除
        </button>
      </div>
    );
  }

  function addDropStage() {
    const last = drops.length > 0 ? drops[drops.length - 1] : { weight, reps };
    setDrops([...drops, { weight: Math.max(0, last.weight - 10), reps: last.reps }]);
  }

  function updateDropStage(index: number, patch: Partial<DropStage>) {
    setDrops(drops.map((stage, i) => (i === index ? { ...stage, ...patch } : stage)));
  }

  function removeDropStage(index: number) {
    setDrops(drops.filter((_, i) => i !== index));
  }

  return (
    <div className="set-row set-row--resting">
      <div className="set-row__timer">⏱ レスト中 {formatElapsed(elapsedSec)}</div>

      <div className="set-row__stage">
        <div className="set-row__inputs">
          <NumberStepper label="重量(kg)" value={weight} step={2.5} onChange={setWeight} />
          <NumberStepper label="回数" value={reps} step={1} onChange={setReps} />
        </div>
      </div>

      {drops.map((stage, index) => (
        <div key={index} className="set-row__stage set-row__stage--drop">
          <span className="set-row__drop-label">↓ ドロップ{index + 1}</span>
          <div className="set-row__inputs">
            <NumberStepper
              label="重量(kg)"
              value={stage.weight}
              step={2.5}
              onChange={(value) => updateDropStage(index, { weight: value })}
            />
            <NumberStepper
              label="回数"
              value={stage.reps}
              step={1}
              onChange={(value) => updateDropStage(index, { reps: value })}
            />
          </div>
          <button
            type="button"
            className="link-button link-button--danger"
            onClick={() => removeDropStage(index)}
          >
            この段を削除
          </button>
        </div>
      ))}

      <div className="set-row__actions">
        <button type="button" className="button" onClick={addDropStage}>
          ＋ ドロップで続ける
        </button>
        <button
          type="button"
          className="button button--primary"
          onClick={() => onSave(weight, reps, drops)}
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
