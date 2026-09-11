import type { DropStage } from '../types';

/** セット1つを "60kg×8" や、ドロップセットなら "60kg×8→40kg×6" のような文字列にする */
export function formatSet(set: { weight: number; reps: number; drops?: DropStage[] }): string {
  const stages = [{ weight: set.weight, reps: set.reps }, ...(set.drops ?? [])];
  return stages.map((stage) => `${stage.weight}kg×${stage.reps}`).join('→');
}
