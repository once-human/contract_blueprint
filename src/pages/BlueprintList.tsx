import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlueprintStore } from '../store/useBlueprintStore';
import { Plus, LayoutTemplate, PenLine, ArrowRight, FileType, Calendar, Hash } from 'lucide-react';

const BlueprintList: React.FC = () => {
    const navigate = useNavigate();
    const { blueprints } = useBlueprintStore();

    return (
        <div>
            <div className="page-header" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 className="page-title">Blueprints</h1>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LayoutTemplate size={16} />
                        Manage your contract templates.
                    </div>
                </div>
                <button
                    onClick={() => navigate('/blueprints/new')}
                    className="btn-primary"
                    style={{ borderRadius: '12px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} />
                    Create Blueprint
                </button>
            </div>

            {blueprints.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '6rem 2rem', borderStyle: 'dashed', borderColor: 'var(--border)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-secondary)' }}>
                        <LayoutTemplate size={40} strokeWidth={1.5} />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>No blueprints found</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                        Blueprints are templates for your contracts. Create your first blueprint to define the structure and fields.
                    </p>
                    <button
                        onClick={() => navigate('/blueprints/new')}
                        className="btn-primary"
                        style={{ borderRadius: '12px', padding: '0.75rem 2rem' }}
                    >
                        Start Building
                    </button>
                </div>
            ) : (
                <div style={{
                    background: '#151516',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blueprint Name</th>
                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Complexity</th>
                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Modified</th>
                                <th style={{ padding: '1.2rem 1.5rem', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blueprints.map((blueprint) => (
                                <tr key={blueprint.id} className="group" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-main)' }}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(10, 132, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                <LayoutTemplate size={18} />
                                            </div>
                                            <div>
                                                <div>{blueprint.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Hash size={10} />
                                                    {blueprint.id.substring(0, 8)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span className="badge" style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                color: 'var(--text-secondary)',
                                                border: '1px solid var(--border)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                whiteSpace: 'nowrap',
                                                padding: '4px 10px', borderRadius: '20px'
                                            }}>
                                                <FileType size={14} />
                                                {blueprint.fields.length} Fields
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                            <Calendar size={14} />
                                            Today
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                            <button
                                                className="btn-secondary btn-sm"
                                                onClick={() => navigate(`/blueprints/${blueprint.id}/edit`)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', border: '1px solid transparent', color: 'var(--text-main)' }}
                                            >
                                                <PenLine size={14} />
                                                Edit
                                            </button>
                                            <button
                                                className="btn-primary btn-sm"
                                                onClick={() => navigate(`/contracts/new?blueprintId=${blueprint.id}`)}
                                                style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px' }}
                                            >
                                                Use Template
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BlueprintList;
