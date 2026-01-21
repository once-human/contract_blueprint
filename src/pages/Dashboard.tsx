import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContractStore } from '../store/useContractStore';
import { useBlueprintStore } from '../store/useBlueprintStore';
import { ContractStatus } from '../models';
import type { Contract } from '../models';
import { getAvailableTransitions, getStatusColor } from '../utils/lifecycle';
import {
    Plus, Search, Filter, FileText, CheckCircle,
    Clock, AlertCircle, ChevronRight, Layout
} from 'lucide-react';
import Dropdown from '../components/Dropdown';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { contracts, updateContract } = useContractStore();
    const { blueprints } = useBlueprintStore();
    const [filter, setFilter] = useState<'All' | 'Active' | 'Pending' | 'Signed'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc'>('date-desc');

    const filteredContracts = contracts
        .filter((contract) => {
            const matchesFilter =
                filter === 'All' ? true :
                    filter === 'Active' ? ([ContractStatus.CREATED, ContractStatus.APPROVED, ContractStatus.SENT] as ContractStatus[]).includes(contract.status) :
                        filter === 'Pending' ? ([ContractStatus.CREATED, ContractStatus.APPROVED] as ContractStatus[]).includes(contract.status) :
                            filter === 'Signed' ? ([ContractStatus.SIGNED, ContractStatus.LOCKED] as ContractStatus[]).includes(contract.status) : true;

            const matchesSearch = contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contract.id.includes(searchQuery) ||
                blueprints.find(b => b.id === contract.blueprintId)?.name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
            return 0;
        });

    const getBlueprintName = (id: string) => {
        const blueprint = blueprints.find(b => b.id === id);
        return blueprint ? blueprint.name : 'Unknown Blueprint';
    };

    const handleStatusChange = (contract: Contract, newStatus: string) => {
        if (newStatus && newStatus !== contract.status) {
            updateContract({ ...contract, status: newStatus as ContractStatus });
        }
    };

    const total = contracts.length;
    const active = contracts.filter(c => [ContractStatus.CREATED, ContractStatus.APPROVED, ContractStatus.SENT].includes(c.status)).length;
    const signed = contracts.filter(c => c.status === ContractStatus.SIGNED).length;

    return (
        <div>
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        Welcome back. You have {active} active contracts.
                    </div>
                </div>
                <button
                    onClick={() => navigate('/contracts/new')}
                    className="btn-primary"
                    style={{ borderRadius: '12px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} />
                    Create Contract
                </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><FileText size={100} /></div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layout size={16} /> Total Contracts
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{total}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><Clock size={100} /></div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={16} /> Active
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{active}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}><CheckCircle size={100} /></div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} /> Signed
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>{signed}</div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div className="tab-group" style={{ marginBottom: 0 }}>
                    {['All', 'Active', 'Pending', 'Signed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab as any)}
                            className={`tab-btn ${filter === tab ? 'active' : ''}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search contracts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '280px',
                                paddingLeft: '44px',
                                background: 'rgba(255,255,255,0.05)',
                                borderColor: 'var(--border)'
                            }}
                        />
                    </div>

                    <Dropdown
                        options={[
                            { value: 'date-desc', label: 'Newest First' },
                            { value: 'date-asc', label: 'Oldest First' },
                            { value: 'name-asc', label: 'Name (A-Z)' }
                        ]}
                        value={sortBy}
                        onChange={(val) => setSortBy(val as any)}
                        width="180px"
                    />
                </div>
            </div>

            {contracts.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '6rem 2rem', borderStyle: 'dashed', borderColor: 'var(--border)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-secondary)' }}>
                        <FileText size={32} />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>No contracts yet</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Create your first contract to get started tracking.</p>
                </div>
            ) : (
                <div className="table-container shadow-md">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '30%' }}>Contract Name</th>
                                <th style={{ width: '20%' }}>Blueprint</th>
                                <th>Status</th>
                                <th>Date Created</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContracts.map((contract) => {
                                const transitions = getAvailableTransitions(contract.status);
                                return (
                                    <tr key={contract.id} className="group">
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: getStatusColor(contract.status) }}>
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <div>{contract.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>#{contract.id.substring(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getBlueprintName(contract.blueprintId)}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: getStatusColor(contract.status) + '15',
                                                    color: getStatusColor(contract.status),
                                                    border: `1px solid ${getStatusColor(contract.status)}30`,
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                                }}
                                            >
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                                {contract.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            {new Date(contract.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                                <button
                                                    className="btn-secondary btn-sm"
                                                    onClick={() => navigate(`/contracts/${contract.id}`)}
                                                    style={{ background: 'transparent', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                >
                                                    View
                                                    <ChevronRight size={14} />
                                                </button>

                                                {transitions.length > 0 && (
                                                    <Dropdown
                                                        options={transitions.map(t => ({ value: t, label: `Mark as ${t}`, icon: <CheckCircle size={14} /> }))}
                                                        value=""
                                                        onChange={(val) => handleStatusChange(contract, val)}
                                                        placeholder="Status"
                                                        width="140px"
                                                        variant="ghost"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
