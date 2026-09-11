import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { BodyPart, Exercise, Workout } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { createId } from '../utils/id';

interface WorkoutContextValue {
  // 種目マスタ
  exercises: Exercise[];
  addExercise: (name: string, bodyPart: BodyPart) => void;
  updateExercise: (id: string, name: string, bodyPart: BodyPart) => void;
  deleteExercise: (id: string) => void;

  // ワークアウト記録（今回はまだ空。次のステップで記録画面から使う）
  workouts: Workout[];
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>(() =>
    loadFromStorage<Exercise[]>('exercises', []),
  );
  const [workouts] = useState<Workout[]>(() => loadFromStorage<Workout[]>('workouts', []));

  // exercisesが変わるたびにlocalStorageへ保存する
  useEffect(() => {
    saveToStorage('exercises', exercises);
  }, [exercises]);

  function addExercise(name: string, bodyPart: BodyPart) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exercise: Exercise = {
      id: createId(),
      name: trimmed,
      bodyPart,
      createdAt: new Date().toISOString(),
    };
    setExercises((prev) => [...prev, exercise]);
  }

  function updateExercise(id: string, name: string, bodyPart: BodyPart) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === id ? { ...exercise, name: trimmed, bodyPart } : exercise,
      ),
    );
  }

  function deleteExercise(id: string) {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  }

  return (
    <WorkoutContext.Provider
      value={{ exercises, addExercise, updateExercise, deleteExercise, workouts }}
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
