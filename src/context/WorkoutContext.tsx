import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { BodyPartDef, Exercise, SetRecord, Workout, WorkoutEntry } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { createId } from '../utils/id';
import { todayDateString } from '../utils/date';

// 最初に用意しておく部位（ここから自由に追加・削除・名前変更できる）
const DEFAULT_BODY_PARTS: Array<{ name: string; color: string }> = [
  { name: '胸', color: '#2f6fed' },
  { name: '背中', color: '#2f9e6f' },
  { name: '脚', color: '#c98a1f' },
  { name: '肩', color: '#8a5fe0' },
  { name: '腕', color: '#e0602e' },
  { name: '腹', color: '#1fa5a5' },
  { name: 'その他', color: '#7a7f8a' },
];

// 部位を追加するときに順番に割り当てる色
const COLOR_PALETTE = [
  '#2f6fed',
  '#2f9e6f',
  '#c98a1f',
  '#8a5fe0',
  '#e0602e',
  '#1fa5a5',
  '#7a7f8a',
  '#d6336c',
  '#0ca678',
  '#495057',
];

function createDefaultBodyParts(): BodyPartDef[] {
  return DEFAULT_BODY_PARTS.map((part) => ({
    id: createId(),
    name: part.name,
    color: part.color,
    createdAt: new Date().toISOString(),
  }));
}

interface DeleteBodyPartResult {
  ok: boolean;
  exercises: string[]; // 削除できなかった場合、その部位を使っている種目名
}

interface WorkoutContextValue {
  // 部位マスタ
  bodyParts: BodyPartDef[];
  addBodyPart: (name: string) => void;
  updateBodyPart: (id: string, name: string) => void;
  deleteBodyPart: (id: string) => DeleteBodyPartResult;

  // 種目マスタ
  exercises: Exercise[];
  addExercise: (name: string, bodyPartId: string) => void;
  updateExercise: (id: string, name: string, bodyPartId: string) => void;
  deleteExercise: (id: string) => void;

  // ワークアウト記録
  workouts: Workout[]; // 終了したワークアウト（履歴）
  activeWorkout: Workout | null; // 今トレ中のワークアウト（無ければnull）
  startWorkout: () => void;
  finishWorkout: () => void;
  addEntryToActiveWorkout: (exerciseId: string) => void;
  startRestForEntry: (entryId: string) => void;
  saveSet: (entryId: string, setId: string, weight: number, reps: number) => void;
  deleteSet: (entryId: string, setId: string) => void;
  getLastRecordFor: (exerciseId: string) => SetRecord[] | null;
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [bodyParts, setBodyParts] = useState<BodyPartDef[]>(() =>
    loadFromStorage<BodyPartDef[]>('bodyParts', createDefaultBodyParts()),
  );
  const [exercises, setExercises] = useState<Exercise[]>(() =>
    loadFromStorage<Exercise[]>('exercises', []),
  );
  const [workouts, setWorkouts] = useState<Workout[]>(() =>
    loadFromStorage<Workout[]>('workouts', []),
  );
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(() =>
    loadFromStorage<Workout | null>('activeWorkout', null),
  );

  useEffect(() => {
    saveToStorage('bodyParts', bodyParts);
  }, [bodyParts]);

  useEffect(() => {
    saveToStorage('exercises', exercises);
  }, [exercises]);

  useEffect(() => {
    saveToStorage('workouts', workouts);
  }, [workouts]);

  useEffect(() => {
    saveToStorage('activeWorkout', activeWorkout);
  }, [activeWorkout]);

  // --- 部位マスタ ---

  function addBodyPart(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const bodyPart: BodyPartDef = {
      id: createId(),
      name: trimmed,
      color: COLOR_PALETTE[bodyParts.length % COLOR_PALETTE.length],
      createdAt: new Date().toISOString(),
    };
    setBodyParts((prev) => [...prev, bodyPart]);
  }

  function updateBodyPart(id: string, name: string) {
    setBodyParts((prev) => prev.map((part) => (part.id === id ? { ...part, name } : part)));
  }

  function deleteBodyPart(id: string): DeleteBodyPartResult {
    const usedBy = exercises.filter((exercise) => exercise.bodyPartId === id);
    if (usedBy.length > 0) {
      return { ok: false, exercises: usedBy.map((exercise) => exercise.name) };
    }
    setBodyParts((prev) => prev.filter((part) => part.id !== id));
    return { ok: true, exercises: [] };
  }

  // --- 種目マスタ ---

  function addExercise(name: string, bodyPartId: string) {
    const trimmed = name.trim();
    if (!trimmed || !bodyPartId) return;
    const exercise: Exercise = {
      id: createId(),
      name: trimmed,
      bodyPartId,
      createdAt: new Date().toISOString(),
    };
    setExercises((prev) => [...prev, exercise]);
  }

  function updateExercise(id: string, name: string, bodyPartId: string) {
    const trimmed = name.trim();
    if (!trimmed || !bodyPartId) return;
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === id ? { ...exercise, name: trimmed, bodyPartId } : exercise,
      ),
    );
  }

  function deleteExercise(id: string) {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  }

  // --- ワークアウト記録 ---

  function startWorkout() {
    setActiveWorkout((prev) => {
      if (prev) return prev; // すでに進行中ならそのまま
      const now = new Date();
      const workout: Workout = {
        id: createId(),
        date: todayDateString(now),
        startedAt: now.toISOString(),
        entries: [],
      };
      return workout;
    });
  }

  function finishWorkout() {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      // 「保存」まで押していない(レスト中で確定していない)セットは記録として残さない
      const finished: Workout = {
        ...prev,
        finishedAt: new Date().toISOString(),
        entries: prev.entries
          .map((entry) => ({ ...entry, sets: entry.sets.filter((set) => set.confirmed) }))
          .filter((entry) => entry.sets.length > 0), // セットが1つも無い種目は履歴に残さない
      };
      setWorkouts((prevWorkouts) => [...prevWorkouts, finished]);
      return null;
    });
  }

  function addEntryToActiveWorkout(exerciseId: string) {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      if (prev.entries.some((entry) => entry.exerciseId === exerciseId)) return prev; // 追加済み
      const entry: WorkoutEntry = { id: createId(), exerciseId, sets: [] };
      return { ...prev, entries: [...prev.entries, entry] };
    });
  }

  function startRestForEntry(entryId: string) {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.map((entry) => {
          if (entry.id !== entryId) return entry;
          if (entry.sets.some((set) => !set.confirmed)) return entry; // すでにレスト中のセットがある
          const lastConfirmed = [...entry.sets].reverse().find((set) => set.confirmed);
          const pendingSet: SetRecord = {
            id: createId(),
            type: 'normal',
            weight: lastConfirmed?.weight ?? 0,
            reps: lastConfirmed?.reps ?? 0,
            confirmed: false,
          };
          return { ...entry, sets: [...entry.sets, pendingSet] };
        }),
      };
    });
  }

  function saveSet(entryId: string, setId: string, weight: number, reps: number) {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.map((entry) =>
          entry.id !== entryId
            ? entry
            : {
                ...entry,
                sets: entry.sets.map((set) =>
                  set.id === setId ? { ...set, weight, reps, confirmed: true } : set,
                ),
              },
        ),
      };
    });
  }

  function deleteSet(entryId: string, setId: string) {
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.map((entry) =>
          entry.id !== entryId
            ? entry
            : { ...entry, sets: entry.sets.filter((set) => set.id !== setId) },
        ),
      };
    });
  }

  function getLastRecordFor(exerciseId: string): SetRecord[] | null {
    const past = workouts
      .filter((workout) => workout.entries.some((entry) => entry.exerciseId === exerciseId))
      .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)); // 新しい順
    if (past.length === 0) return null;
    const entry = past[0].entries.find((e) => e.exerciseId === exerciseId);
    return entry ? entry.sets.filter((set) => set.confirmed) : null;
  }

  return (
    <WorkoutContext.Provider
      value={{
        bodyParts,
        addBodyPart,
        updateBodyPart,
        deleteBodyPart,
        exercises,
        addExercise,
        updateExercise,
        deleteExercise,
        workouts,
        activeWorkout,
        startWorkout,
        finishWorkout,
        addEntryToActiveWorkout,
        startRestForEntry,
        saveSet,
        deleteSet,
        getLastRecordFor,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) {
    throw new Error('useWorkoutはWorkoutProviderの内側でしか使えません');
  }
  return ctx;
}
