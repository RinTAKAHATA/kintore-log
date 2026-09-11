interface Props {
  label: string;
  value: number;
  step: number;
  min?: number;
  onChange: (value: number) => void;
}

/** 重量・回数を＋－ボタン、または直接入力で調整する部品 */
export function NumberStepper({ label, value, step, min = 0, onChange }: Props) {
  return (
    <label className="number-stepper">
      <span className="number-stepper__label">{label}</span>
      <div className="number-stepper__control">
        <button
          type="button"
          className="number-stepper__button"
          onClick={() => onChange(Math.max(min, value - step))}
        >
          －
        </button>
        <input
          className="number-stepper__input"
          type="number"
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Number.isNaN(next) ? min : Math.max(min, next));
          }}
        />
        <button
          type="button"
          className="number-stepper__button"
          onClick={() => onChange(value + step)}
        >
          ＋
        </button>
      </div>
    </label>
  );
}
