import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Blueprint } from '../models';

interface BlueprintState {
    blueprints: Blueprint[];
    addBlueprint: (blueprint: Blueprint) => void;
    updateBlueprint: (id: string, updatedBlueprint: Partial<Blueprint>) => void;
    getBlueprintById: (id: string) => Blueprint | undefined;
}

export const useBlueprintStore = create<BlueprintState>()(
    persist(
        (set, get) => ({
            blueprints: [],
            addBlueprint: (blueprint) =>
                set((state) => ({
                    blueprints: [...state.blueprints, blueprint]
                })),
            updateBlueprint: (id, updatedBlueprint) => set((state) => ({
                blueprints: state.blueprints.map(b => b.id === id ? { ...b, ...updatedBlueprint } : b)
            })),
            getBlueprintById: (id) => get().blueprints.find((b) => b.id === id),
        }),
        {
            name: 'blueprint-storage',
        }
    )
);
