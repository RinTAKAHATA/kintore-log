import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { BodyPartBadge } from './BodyPartBadge';

/**
 * 部位（胸・背中・脚…）の一覧表示と、追加・名前変更・削除をまとめたパーツ。
 * 使用中の種目がある部位は削除できないようにしている（データが壊れないように）。
 */
export function BodyPartManager() {
  const { bodyParts, addBodyPart, updateBodyPart, deleteBodyPart } = useWorkout();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addBodyPart(trimmed);
    setNewName('');
  }

  function handleDelete(id: string) {
    const result = deleteBodyPart(id);
    setBlockedMessage(
      result.ok
        ? null
        : `この部位を使っている種目があるため削除できません：${result.exercises.join('、')}`,
    );
  }

  if (!editing) {
    return (
      <div className="body-part-manager">
        <div className="body-part-manager__badges">
          {bodyParts.map((part) => (
            <BodyPartBadge key={part.id} name={part.name} color={part.color} />
          ))}
        </div>
        <button type="button" className="link-button" onClick={() => setEditing(true)}>
          部位を編集
        </button>
      </div>
    );
  }

  return (
    <div className="body-part-manager">
      {blockedMessage && <p className="body-part-manager__error">{blockedMessage}</p>}
      <ul className="body-part-manager__list">
        {bodyParts.map((part) => (
          <li key={part.id} className="body-part-manager__row">
            <input
              className="body-part-manager__input"
              type="text"
              value={part.name}
              onChange={(event) => updateBodyPart(part.id, event.target.value)}
            />
            <button
              type="button"
              className="link-button link-button--danger"
              onClick={() => handleDelete(part.id)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <div className="body-part-manager__row">
        <input
          className="body-part-manager__input"
          type="text"
          placeholder="新しい部位名（例：ふくらはぎ）"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        <button type="button" className="button" onClick={handleAdd}>
          追加
        </button>
      </div>
      <button type="button" className="button button--primary" onClick={() => setEditing(false)}>
        完了
      </button>
    </div>
  );
}
