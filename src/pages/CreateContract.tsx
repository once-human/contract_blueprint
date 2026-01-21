import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBlueprintStore } from '../store/useBlueprintStore';
import { useContractStore } from '../store/useContractStore';
import { ContractStatus } from '../models';
import type { Contract } from '../models';

const CreateContract: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const blueprintIdParam = searchParams.get('blueprintId');

    const { blueprints } = useBlueprintStore();
    const { addContract } = useContractStore();

    const [selectedBlueprintId, setSelectedBlueprintId] = useState(blueprintIdParam || '');
    const [contractName, setContractName] = useState('');

    // Update selected blueprint if param changes or initial load
    useEffect(() => {
        if (blueprintIdParam) {
            setSelectedBlueprintId(blueprintIdParam);
        }
    }, [blueprintIdParam]);

    const handleCreate = () => {
        if (!selectedBlueprintId || !contractName.trim()) {
            alert('Please select a blueprint and enter a contract name.');
            return;
        }

        const blueprint = blueprints.find(b => b.id === selectedBlueprintId);
        if (!blueprint) {
            alert('Selected blueprint not found.');
            return;
        }

        const newContract: Contract = {
            id: Math.random().toString(36).substr(2, 9),
            name: contractName,
            blueprintId: selectedBlueprintId,
            fields: blueprint.fields.map(field => ({
                ...field,
                value: null, // Initialize values to null
            })),
            status: ContractStatus.CREATED,
            createdAt: new Date().toISOString(),
        };

        addContract(newContract);
        navigate(`/contracts/${newContract.id}`);
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '4rem auto' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Create Contract</h1>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Select Blueprint
                    </label>
                    <select
                        value={selectedBlueprintId}
                        onChange={(e) => setSelectedBlueprintId(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-app)' }}
                    >
                        <option value="" disabled>-- Choose a Blueprint --</option>
                        {blueprints.map(bp => (
                            <option key={bp.id} value={bp.id}>{bp.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Contract Name
                    </label>
                    <input
                        type="text"
                        value={contractName}
                        onChange={(e) => setContractName(e.target.value)}
                        placeholder="e.g. Acme service agreement"
                        style={{ width: '100%', padding: '0.75rem', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    onClick={handleCreate}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem' }}
                    disabled={!selectedBlueprintId || !contractName.trim()}
                >
                    Create Contract
                </button>
            </div>
        </div>
    );
};

export default CreateContract;
