// アプリ全体で使うデータの型をここにまとめる

/** 部位タグ。種目ごとに1つ持たせて、部位別インターバル表示に使う */
export type BodyPart = '胸' | '背中' | '脚' | '肩' | '腕' | '腹' | 'その他';

export const BODY_PARTS: BodyPart[] = ['胸', '背中', '脚', '肩', '腕', '腹', 'その他'];

/** 種目マスタ（例：ベンチプレス、スクワット…） */
export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
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
  targetRestSec?: number; // 目標レスト（セット後にタイマーで計る秒数）
  restSec?: number; // 実際に休んだ秒数（次のセットを記録した時点で確定）
}

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
