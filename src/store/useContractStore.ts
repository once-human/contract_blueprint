import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Contract } from '../models';

interface ContractState {
    contracts: Contract[];
    addContract: (contract: Contract) => void;
    updateContract: (contract: Contract) => void;
    getContractById: (id: string) => Contract | undefined;
}

export const useContractStore = create<ContractState>()(
    persist(
        (set, get) => ({
            contracts: [],
            addContract: (contract) =>
                set((state) => ({ contracts: [...state.contracts, contract] })),
            updateContract: (updatedContract) =>
                set((state) => ({
                    contracts: state.contracts.map((c) =>
                        c.id === updatedContract.id ? updatedContract : c
                    ),
                })),
            getContractById: (id) => get().contracts.find((c) => c.id === id),
        }),
        {
            name: 'contract-storage',
        }
    )
);
