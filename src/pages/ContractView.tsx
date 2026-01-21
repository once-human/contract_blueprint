import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContractStore } from '../store/useContractStore';
import { useBlueprintStore } from '../store/useBlueprintStore';
import { useToast } from '../components/Toast';
import { ContractStatus } from '../models';
import { getAvailableTransitions, getStatusColor } from '../utils/lifecycle';
import {
    ChevronLeft, CheckCircle, XCircle, Clock,
    FileSignature, AlertTriangle, Download,
    MoreVertical, FileText
} from 'lucide-react';
import Dropdown from '../components/Dropdown';

const ContractView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getContractById, updateContract } = useContractStore();
    const { getBlueprintById } = useBlueprintStore();
    const { addToast } = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const contract = getContractById(id!);

    if (!contract) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Contract not found</div>;
    }

    const blueprint = getBlueprintById(contract.blueprintId);
    if (!blueprint) return <div>Blueprint not found</div>;

    const transitions = getAvailableTransitions(contract.status);

    const handleFieldChange = (fieldId: string, value: any) => {
        if (contract.status === ContractStatus.SIGNED || contract.status === ContractStatus.LOCKED || contract.status === ContractStatus.REVOKED) {
            return; // Read only
        }

        const newFields = contract.fields.map(f => f.id === fieldId ? { ...f, value } : f);
        updateContract({ ...contract, fields: newFields });
    };

    const handleStatusChange = (newStatus: string) => {
        updateContract({ ...contract, status: newStatus as ContractStatus });
        addToast(`Contract marked as ${newStatus}`, 'success');
    };

    // Signature Pad Logic 
    const startDrawing = (e: React.MouseEvent) => {
        if (contract.status !== ContractStatus.SENT && contract.status !== ContractStatus.APPROVED) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        setIsDrawing(true);
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
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
                                        <div style={{ border: '2px dashed #cbd5e1', borderRadius: '4px', background: '#f8fafc', position: 'relative' }}>
                                            <canvas
                                                ref={canvasRef}
                                                width={220}
                                                height={100}
                                                style={{ cursor: 'crosshair', display: 'block' }}
                                                onMouseDown={startDrawing}
                                                onMouseMove={draw}
                                                onMouseUp={stopDrawing}
                                                onMouseLeave={stopDrawing}
                                            />
                                            <div style={{
                                                position: 'absolute', bottom: '4px', right: '4px',
                                                fontSize: '0.65rem', color: '#94a3b8', pointerEvents: 'none'
                                            }}>
                                                Sign above
                                            </div>
                                            {(contract.status === ContractStatus.SENT || contract.status === ContractStatus.APPROVED) && (
                                                <button
                                                    onClick={clearSignature}
                                                    style={{
                                                        position: 'absolute', top: '4px', right: '4px',
                                                        background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '4px',
                                                        padding: '2px 6px', fontSize: '0.65rem', color: '#64748b', cursor: 'pointer'
                                                    }}
                                                >
                                                    Clear
                                                </button>
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
