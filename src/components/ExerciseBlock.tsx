import type { BodyPartDef, DropStage, Exercise, SetRecord, WorkoutEntry } from '../types';
import { formatSet } from '../utils/format';
import { BodyPartBadge } from './BodyPartBadge';
import { SetRow } from './SetRow';

interface Props {
  entry: WorkoutEntry;
  exercise: Exercise;
  bodyPart?: BodyPartDef;
  lastRecord: SetRecord[] | null;
  onStartRest: () => void;
  onSaveSet: (setId: string, weight: number, reps: number, drops: DropStage[]) => void;
  onDeleteSet: (setId: string) => void;
}

export function ExerciseBlock({
  entry,
  exercise,
  bodyPart,
  lastRecord,
  onStartRest,
  onSaveSet,
  onDeleteSet,
}: Props) {
  const hasRestingSet = entry.sets.some((set) => !set.confirmed);

  return (
    <section className="card exercise-block">
      <div className="exercise-block__header">
        <h3>{exercise.name}</h3>
        {bodyPart && <BodyPartBadge name={bodyPart.name} color={bodyPart.color} />}
      </div>

      <p className="card__note">
        {lastRecord && lastRecord.length > 0
          ? `前回：${lastRecord.map((set) => formatSet(set)).join(', ')}`
          : '前回の記録はまだありません'}
      </p>

      {entry.sets.length > 0 && (
        <div className="exercise-block__sets">
          {entry.sets.map((set) => (
            <SetRow
              key={set.id}
              set={set}
              onSave={(weight, reps, drops) => onSaveSet(set.id, weight, reps, drops)}
              onDelete={() => onDeleteSet(set.id)}
            />
          ))}
        </div>
      )}

      {!hasRestingSet && (
        <button type="button" className="button button--primary" onClick={onStartRest}>
          レスト開始
        </button>
      )}
    </section>
  );
}
