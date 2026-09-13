import { useWorkout } from '../context/WorkoutContext';

const STATUS_LABEL: Record<string, string> = {
  none: '記録なし',
  recovering: '回復中',
  ok: 'トレOK',
  recovered: '完全回復',
};

const STATUS_CLASS: Record<string, string> = {
  none: 'recovery-badge--none',
  recovering: 'recovery-badge--recovering',
  ok: 'recovery-badge--ok',
  recovered: 'recovery-badge--recovered',
};

/** 部位ごとに「最後にやってから何日たったか」と回復ステータスを一覧表示する */
export function BodyPartIntervalList() {
  const { getBodyPartIntervals } = useWorkout();
  const intervals = getBodyPartIntervals();

  if (intervals.length === 0) {
    return <p className="empty-state">部位がまだありません。下から追加してください。</p>;
  }

  return (
    <ul className="body-part-interval-list">
      {intervals.map(({ bodyPart, daysSince, status }) => (
        <li key={bodyPart.id} className="body-part-interval-list__row">
          <span className="body-part-interval-list__name">{bodyPart.name}</span>
          <span className="body-part-interval-list__days">
            {daysSince === null ? '—' : `${daysSince}日前`}
          </span>
          <span className={`recovery-badge ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
        </li>
      ))}
    </ul>
  );
}
