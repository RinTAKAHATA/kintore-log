import { ExercisePicker } from '../components/ExercisePicker';

export function Home() {
  return (
    <div className="page">
      <section className="card">
        <h2>部位別インターバル</h2>
        <p className="card__note">
          （準備中）記録機能ができたら、ここに「各部位を最後にやってから何日たったか」が出ます。
        </p>
      </section>

      <section className="card">
        <h2>種目マスタ</h2>
        <p className="card__note">
          まずはよく使う種目を登録しておくと、このあと記録画面がスムーズになります。
        </p>
        <ExercisePicker />
      </section>
    </div>
  );
}
