// アプリ全体で使うデータの型をここにまとめる

/** 部位（自分で追加・削除・名前変更できるデータ。最初は7個を初期値として用意する） */
export interface BodyPartDef {
  id: string;
  name: string;
  color: string; // バッジの色
  createdAt: string; // ISO日時
}

/** 種目マスタ（例：ベンチプレス、スクワット…） */
export interface Exercise {
  id: string;
  name: string;
  bodyPartId: string; // BodyPartDef.id への参照
  createdAt: string; // ISO日時
}

/** セットの種類。ドロップセットは1セットの中に複数の「段」を持つ */
export type SetType = 'normal' | 'drop';

/** ドロップセットの2段目以降（重量を下げて続けて行う分） */
export interface DropStage {
  weight: number;
  reps: number;
}

/** 1セット分の記録 */
export interface SetRecord {
  id: string;
  type: SetType;
  weight: number;
  reps: number;
  drops?: DropStage[]; // typeが'drop'のときだけ使う
}
// レスト時間は画面上で計るだけ（ストップウォッチ表示）で、データとしては保存しない

/** ワークアウト内の1種目ぶん（種目＋そのセットの配列） */
export interface WorkoutEntry {
  id: string;
  exerciseId: string;
  sets: SetRecord[];
}

/** 1回のトレーニング（ジムに行った1回分） */
export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  startedAt: string; // ISO日時
  finishedAt?: string; // 終了していない（トレ中）はundefined
  entries: WorkoutEntry[];
}
