import type { BodyPart } from '../types';

const COLORS: Record<BodyPart, string> = {
  胸: '#2f6fed',
  背中: '#2f9e6f',
  脚: '#c98a1f',
  肩: '#8a5fe0',
  腕: '#e0602e',
  腹: '#1fa5a5',
  その他: '#7a7f8a',
};

export function BodyPartBadge({ bodyPart }: { bodyPart: BodyPart }) {
  return (
    <span className="body-part-badge" style={{ background: COLORS[bodyPart] }}>
      {bodyPart}
    </span>
  );
}
