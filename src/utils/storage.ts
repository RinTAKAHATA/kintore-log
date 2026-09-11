// localStorageの読み書きをまとめる場所。
// プライベートブラウジングなどでlocalStorageが使えない場合もあるので、
// 必ずtry/catchで囲んでアプリが落ちないようにする。

const PREFIX = 'kintore-log:';

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // 保存できなくても画面は動き続けさせる
  }
}
