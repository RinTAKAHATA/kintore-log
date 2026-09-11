// 日付・時間の表示や計算をまとめる場所。
// Date.toISOString()はUTC基準になり、日本時間だと日付がずれることがあるので、
// 「今日の日付」はローカル時間から自分で組み立てる。

export function todayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 経過秒数を "0:42" のような表示にする（レスト中のストップウォッチ用） */
export function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
