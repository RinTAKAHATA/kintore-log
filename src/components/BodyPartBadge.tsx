interface Props {
  name: string;
  color: string;
}

export function BodyPartBadge({ name, color }: Props) {
  return (
    <span className="body-part-badge" style={{ background: color }}>
      {name}
    </span>
  );
}
