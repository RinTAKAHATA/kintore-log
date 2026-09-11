// 種目やセットにつけるユニークなIDを作る。
// crypto.randomUUIDが使える環境ならそれを使い、使えなければ簡易版にフォールバックする。
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
