import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContractStore } from '../store/useContractStore';
import { useBlueprintStore } from '../store/useBlueprintStore';
import { useToast } from '../components/Toast';
import { ContractStatus } from '../models';
import { getAvailableTransitions, getStatusColor } from '../utils/lifecycle';
import {
    ChevronLeft, CheckCircle, XCircle,
    FileSignature, Download,
    FileText
} from 'lucide-react';
import Dropdown from '../components/Dropdown';

const ContractView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getContractById, updateContract } = useContractStore();
    const { getBlueprintById } = useBlueprintStore();
    const { addToast } = useToast();
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

    const contract = getContractById(id!);

    if (!contract) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Contract not found</div>;
    }

    const mapBlueprint = getBlueprintById(contract.blueprintId);
    // Handle edge case where blueprint might be deleted or missing
    const blueprint = mapBlueprint || { name: 'Unknown Blueprint', fields: [] };

    const transitions = getAvailableTransitions(contract.status);

    const handleFieldChange = (fieldId: string, value: any) => {
        if (contract.status === ContractStatus.SIGNED || contract.status === ContractStatus.LOCKED || contract.status === ContractStatus.REVOKED) {
            return; // Read only
        }

        const newFields = contract.fields.map(f => f.id === fieldId ? { ...f, value } : f);
        updateContract({ ...contract, fields: newFields });
    };

    const handleSignatureSave = (fieldId: string, name: string) => {
        if (!name.trim()) {
            setEditingFieldId(null); // Cancel if empty
            return;
        }
        handleFieldChange(fieldId, `${name}\n${new Date().toLocaleString()}`);
        setEditingFieldId(null);
    };

    const handleStatusChange = (newStatus: string) => {
        updateContract({ ...contract, status: newStatus as ContractStatus });
        addToast(`Contract marked as ${newStatus}`, 'success');
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - var(--header-height))', overflow: 'hidden' }}>

            {/* Main Document Area */}
            <div style={{ flex: 1, backgroundColor: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', overflowY: 'auto' }}>

                {/* Header Action Bar */}
                <div style={{
                    width: '794px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-secondary)', border: '1px solid var(--border)'
                            }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{contract.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span className="badge" style={{
                                    backgroundColor: getStatusColor(contract.status) + '20',
                                    color: getStatusColor(contract.status),
                                    border: `1px solid ${getStatusColor(contract.status)}40`
                                }}>
                                    {contract.status}
                                </span>
                                <span>• Last updated today</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {transitions.length > 0 && (
                            <Dropdown
                                options={transitions.map(t => ({
                                    value: t,
                                    label: `Mark as ${t}`,
                                    icon: t === 'SIGNED' ? <FileSignature size={14} /> : (t === 'APPROVED' ? <CheckCircle size={14} /> : <XCircle size={14} />)
                                }))}
                                value=""
                                onChange={(val) => handleStatusChange(val)}
                                placeholder="Process Contract"
                                width="200px"
                                variant="primary"
                            />
                        )}
                        <button className="btn-secondary" style={{ borderRadius: '8px' }}>
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* The Paper */}
                <div style={{
                    width: '794px',
                    minHeight: '1123px', // A4
                    backgroundColor: '#fff',
                    boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                    position: 'relative',
                    padding: '0', // No padding from container, fields have positions
                    borderRadius: '2px',
                    marginBottom: '4rem'
                }}>
                    {/* Watermark for draft statuses */}
                    {(contract.status === ContractStatus.CREATED || contract.status === ContractStatus.REVOKED) && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)',
                            fontSize: '8rem', color: 'rgba(0,0,0,0.03)', fontWeight: 900, pointerEvents: 'none', select: 'none'
                        }}>
                            {contract.status}
                        </div>
                    )}

                    {contract.fields.map((field) => (
                        <div
                            key={field.id}
                            style={{
                                position: 'absolute',
                                left: field.position.x,
                                top: field.position.y,
                                width: field.type === 'textBlock' ? '300px' : (field.type === 'checkbox' ? 'auto' : '220px'),
                                zIndex: 1
                            }}
                        >
                            {field.type === 'textBlock' ? (
                                <div style={{
                                    color: '#000',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    fontFamily: 'Georgia, serif', // More document-like
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {field.content}
                                </div>
                            ) : (
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#64748b',
                                        marginBottom: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                                    </label>

                                    {field.type === 'text' && (
                                        <input
                                            type="text"
                                            value={field.value as string || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            style={{
                                                background: '#f8fafc',
                                                border: '1px solid #cbd5e1',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                                                color: '#1e293b'
                                            }}
                                            placeholder="Enter text..."
                                        />
                                    )}

                                    {field.type === 'date' && (
                                        <input
                                            type="date"
                                            value={field.value as string || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b' }}
                                        />
                                    )}

                                    {field.type === 'select' && (
                                        <select
                                            value={field.value as string || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b' }}
                                        >
                                            <option value="">Select option...</option>
                                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    )}

                                    {field.type === 'checkbox' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input
                                                type="checkbox"
                                                checked={field.value as boolean || false}
                                                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                                                style={{ width: '1.2rem', height: '1.2rem', margin: 0 }}
                                            />
                                            <span style={{ fontSize: '0.9rem', color: '#334155' }}>I agree</span>
                                        </div>
                                    )}

                                    {field.type === 'signature' && (
                                        <div style={{
                                            border: field.value || editingFieldId === field.id ? '2px solid transparent' : '2px dashed #cbd5e1',
                                            borderRadius: '8px',
                                            background: field.value ? 'rgba(0, 255, 0, 0.05)' : '#f8fafc',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            cursor: ([ContractStatus.CREATED, ContractStatus.SENT, ContractStatus.APPROVED].includes(contract.status)) && !field.value && editingFieldId !== field.id ? 'pointer' : 'default',
                                            transition: 'all 0.2s'
                                        }}
                                            onClick={() => {
                                                const isEditable = [ContractStatus.CREATED, ContractStatus.SENT, ContractStatus.APPROVED].includes(contract.status);
                                                // Start editing if editable, not already having a value, and not currently editing
                                                if (isEditable && !field.value && editingFieldId !== field.id) {
                                                    setEditingFieldId(field.id);
                                                }
                                            }}
                                        >
                                            {/* Clear Button */}
                                            {field.value && [ContractStatus.CREATED, ContractStatus.SENT, ContractStatus.APPROVED].includes(contract.status) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFieldChange(field.id, '');
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '4px', right: '4px',
                                                        background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '4px',
                                                        cursor: 'pointer', padding: '4px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#64748b'
                                                    }}
                                                    title="Clear Signature"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            )}

                                            {/* Content */}
                                            {editingFieldId === field.id ? (
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Type name..."
                                                    style={{
                                                        fontFamily: '"Brush Script MT", "Cursive", "Great Vibes", cursive',
                                                        fontSize: '1.8rem',
                                                        color: '#1e293b',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        textAlign: 'center',
                                                        width: '90%',
                                                        outline: 'none'
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSignatureSave(field.id, e.currentTarget.value);
                                                        if (e.key === 'Escape') setEditingFieldId(null);
                                                    }}
                                                    onBlur={(e) => handleSignatureSave(field.id, e.target.value)}
                                                />
                                            ) : field.value ? (
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{
                                                        fontFamily: '"Brush Script MT", "Cursive", "Great Vibes", cursive',
                                                        fontSize: '1.8rem',
                                                        color: '#1e293b',
                                                        lineHeight: 1
                                                    }}>
                                                        {String(field.value).split('\n')[0]}
                                                    </div>
                                                    <div style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        Verified &bull; {String(field.value).split('\n')[1] || 'Today'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                                    {([ContractStatus.CREATED, ContractStatus.SENT, ContractStatus.APPROVED].includes(contract.status)) ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(10, 132, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <FileSignature size={16} />
                                                            </div>
                                                            <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--primary)' }}>Click to Sign</div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ fontSize: '0.8rem' }}>Signature Field</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar */}
            <div style={{
                width: '320px',
                borderLeft: '1px solid var(--border)',
                backgroundColor: 'var(--bg-surface)',
                padding: '0'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Contract Details
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Blueprint</div>
                            <div style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileText size={16} color="var(--primary)" />
                                {blueprint.name}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Created</div>
                            <div style={{ fontSize: '0.95rem' }}>{new Date(contract.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Contract ID</div>
                            <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{contract.id}</div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Audit Timeline
                    </div>

                    <div className="timeline" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                            <div style={{
                                width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)',
                                position: 'relative', zIndex: 1, marginTop: '4px',
                                boxShadow: '0 0 0 4px rgba(10, 132, 255, 0.2)'
                            }}></div>
                            {/* Line would go here */}
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Contract Created</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(contract.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                        {/* Placeholder for more events */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractView;
