import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Field, FieldType } from '../models';
import { useBlueprintStore } from '../store/useBlueprintStore';
import { useToast } from '../components/Toast';
import {
    Type, Calendar, Pen, CheckSquare, List,
    ArrowLeft, Save, Trash2, Box, Info,
    AlignLeft
} from 'lucide-react';

const GRID_SIZE = 20;

const BlueprintBuilder: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addBlueprint, updateBlueprint, getBlueprintById } = useBlueprintStore();
    const { addToast } = useToast();

    // State
    const [name, setName] = useState('Untitled Blueprint');
    const [fields, setFields] = useState<Field[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    // Drag State
    const [draggedField, setDraggedField] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        if (id) {
            const existing = getBlueprintById(id);
            if (existing) {
                setName(existing.name);
                setFields(existing.fields);
                setIsEditing(true);
            }
        }
    }, [id, getBlueprintById]);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Actions
    const handleAddField = (type: FieldType) => {
        const newField: Field = {
            id: generateId(),
            type,
            label: type === 'textBlock' ? 'Text Block' : `New ${type}`,
            content: type === 'textBlock' ? 'Double click to edit this text...' : undefined,
            position: { x: GRID_SIZE * 2, y: 50 + fields.length * (GRID_SIZE * 3) },
            options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
        };
        setFields([...fields, newField]);
        setSelectedFieldId(newField.id);
    };

    const handleUpdateField = (id: string, updates: Partial<Field>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleDeleteField = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setFields(fields.filter(f => f.id !== id));
        if (selectedFieldId === id) setSelectedFieldId(null);
        addToast('Component removed', 'info');
    };

    const handleSave = () => {
        if (!name.trim()) {
            addToast("Blueprint name cannot be empty", 'error');
            return;
        }
        if (fields.length === 0) {
            addToast("Please add at least one field", 'error');
            return;
        }

        if (isEditing && id) {
            updateBlueprint(id, { name, fields });
            addToast("Blueprint updated successfully", 'success');
        } else {
            const newBlueprint = {
                id: generateId(),
                name,
                fields,
            };
            addBlueprint(newBlueprint);
            addToast("Blueprint created successfully", 'success');
        }
        navigate('/blueprints');
    };

    // Drag Logic
    const handleMouseDown = (e: React.MouseEvent, field: Field) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedFieldId(field.id);
        setDraggedField(field.id);

        const fieldRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setDragOffset({
            x: e.clientX - fieldRect.left,
            y: e.clientY - fieldRect.top
        });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!draggedField || !canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        let rawX = e.clientX - canvasRect.left - dragOffset.x;
        let rawY = e.clientY - canvasRect.top - dragOffset.y;

        // Snap to grid
        const snappedX = Math.round(rawX / GRID_SIZE) * GRID_SIZE;
        const snappedY = Math.round(rawY / GRID_SIZE) * GRID_SIZE;

        const boundedX = Math.max(0, Math.min(snappedX, 794 - 200));
        const boundedY = Math.max(0, Math.min(snappedY, 1123 - 50));

        setFields(prev => prev.map(f => {
            if (f.id === draggedField) {
                return { ...f, position: { x: boundedX, y: boundedY } };
            }
            return f;
        }));
    }, [draggedField, dragOffset]);

    const handleMouseUp = useCallback(() => {
        setDraggedField(null);
    }, []);

    useEffect(() => {
        if (draggedField) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggedField, handleMouseMove, handleMouseUp]);

    const selectedField = fields.find(f => f.id === selectedFieldId);

    // Canvas click handler
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-area')) {
            setSelectedFieldId(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-height))', background: '#000000', color: 'var(--text-main)' }}>

            {/* Top Toolbar */}
            <div style={{
                height: '72px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 2rem',
                backgroundColor: 'rgba(20, 20, 20, 0.8)',
                backdropFilter: 'blur(20px)',
                zIndex: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                        onClick={() => navigate('/blueprints')}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Untitled Blueprint"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                padding: 0,
                                width: '400px',
                                boxShadow: 'none',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{
                            borderRadius: '12px',
                            padding: '0.8rem 1.8rem',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 14px rgba(10, 132, 255, 0.4)'
                        }}
                    >
                        <Save size={18} strokeWidth={2.5} />
                        <span style={{ fontWeight: 600 }}>Save Changes</span>
                    </button>
                </div>
            </div>

            {/* Main Workspace - 3 Column Layout */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left Sidebar: Components */}
                <div style={{
                    width: '280px',
                    borderRight: '1px solid var(--border)',
                    backgroundColor: '#0a0a0a',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Components
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            { type: 'textBlock', icon: <AlignLeft size={18} />, label: 'Text Block', desc: 'Headings & paragraphs' },
                            { type: 'text', icon: <Type size={18} />, label: 'Text Input', desc: 'Single line text' },
                            { type: 'date', icon: <Calendar size={18} />, label: 'Date Picker', desc: 'Date selection' },
                            { type: 'signature', icon: <Pen size={18} />, label: 'Signature', desc: 'Drawing pad' },
                            { type: 'checkbox', icon: <CheckSquare size={18} />, label: 'Checkbox', desc: 'Boolean toggle' },
                            { type: 'select', icon: <List size={18} />, label: 'Dropdown', desc: 'Option list' },
                        ].map((tool) => (
                            <button
                                key={tool.type}
                                onClick={() => handleAddField(tool.type as any)}
                                className="group"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px',
                                    background: 'transparent',
                                    border: '1px solid transparent',
                                    borderRadius: '12px',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-secondary)'
                                }}>
                                    {tool.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{tool.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{tool.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center: Canvas */}
                <div
                    className="canvas-area"
                    onClick={handleCanvasClick}
                    style={{
                        flex: 1,
                        overflow: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '4rem',
                        backgroundColor: '#111',
                        position: 'relative'
                    }}
                >
                    <div
                        ref={canvasRef}
                        style={{
                            width: '794px', height: '1123px', // A4
                            backgroundColor: '#ffffff',
                            backgroundImage: `
                                linear-gradient(#f1f5f9 1px, transparent 1px), 
                                linear-gradient(90deg, #f1f5f9 1px, transparent 1px)
                            `,
                            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                            position: 'relative',
                            boxShadow: '0 0 100px rgba(0,0,0,0.5)',
                            borderRadius: '4px',
                            flexShrink: 0
                        }}
                    >
                        {fields.map((field) => (
                            <div
                                key={field.id}
                                onMouseDown={(e) => handleMouseDown(e, field)}
                                style={{
                                    position: 'absolute',
                                    left: field.position.x,
                                    top: field.position.y,
                                    width: field.type === 'textBlock' ? '300px' : (field.type === 'checkbox' ? 'auto' : '220px'),
                                    border: selectedFieldId === field.id ? '2px solid #3b82f6' : '1px solid transparent',
                                    background: field.type === 'textBlock' ? 'transparent' : (selectedFieldId === field.id ? 'rgba(59, 130, 246, 0.05)' : 'white'),
                                    borderRadius: '6px',
                                    cursor: 'grab',
                                    padding: '6px',
                                    zIndex: selectedFieldId === field.id ? 10 : 1,
                                    boxShadow: selectedFieldId === field.id ? '0 4px 20px rgba(59, 130, 246, 0.25)' : 'none',
                                    userSelect: 'none',
                                    transition: 'box-shadow 0.2s, border-color 0.2s'
                                }}
                            >
                                {field.type === 'textBlock' ? (
                                    <div style={{ color: '#000', fontSize: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                        {field.content || 'Add text here...'}
                                    </div>
                                ) : (
                                    <>
                                        <div style={{
                                            fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '6px',
                                            textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between'
                                        }}>
                                            <span>{field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}</span>
                                            {selectedFieldId === field.id && <span style={{ color: '#3b82f6' }}>Selected</span>}
                                        </div>
                                        <div style={{
                                            height: '36px', background: '#f8fafc', border: '1px solid #cbd5e1',
                                            borderRadius: '6px', display: 'flex', alignItems: 'center', padding: '0 10px',
                                            fontSize: '13px', color: '#64748b'
                                        }}>
                                            {field.type === 'text' && 'Text Input...'}
                                            {field.type === 'date' && 'Select Date...'}
                                            {field.type === 'signature' && 'Signature Field'}
                                            {field.type === 'checkbox' && 'Checkbox Option'}
                                            {field.type === 'select' && 'Select Option...'}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar: Properties */}
                <div style={{
                    width: '320px',
                    borderLeft: '1px solid var(--border)',
                    backgroundColor: '#0a0a0a',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Properties
                    </div>

                    {selectedField ? (
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Generic Label Property */}
                            {selectedField.type !== 'textBlock' && (
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>Field Label</label>
                                    <input
                                        type="text"
                                        value={selectedField.label}
                                        onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                                    />
                                </div>
                            )}

                            {/* Type Indicator */}
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>Type</label>
                                <div style={{
                                    padding: '0.8rem', background: 'var(--bg-surface-secondary)', borderRadius: '8px',
                                    color: 'var(--text-main)', fontSize: '0.9rem', border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', gap: '10px'
                                }}>
                                    {selectedField.type === 'text' && <Type size={16} />}
                                    {selectedField.type === 'date' && <Calendar size={16} />}
                                    {selectedField.type === 'signature' && <Pen size={16} />}
                                    {selectedField.type === 'checkbox' && <CheckSquare size={16} />}
                                    {selectedField.type === 'select' && <List size={16} />}
                                    {selectedField.type === 'textBlock' && <AlignLeft size={16} />}
                                    {selectedField.type === 'textBlock' ? 'Text Block' : (selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1) + ' Input')}
                                </div>
                            </div>

                            {/* Specific Properties */}
                            {selectedField.type === 'textBlock' ? (
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>Content</label>
                                    <textarea
                                        value={selectedField.content || ''}
                                        onChange={(e) => handleUpdateField(selectedField.id, { content: e.target.value })}
                                        style={{ height: '150px', resize: 'vertical' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    {selectedField.type === 'select' && (
                                        <div>
                                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>Options (comma separated)</label>
                                            <input
                                                type="text"
                                                value={selectedField.options?.join(', ') || ''}
                                                onChange={(e) => handleUpdateField(selectedField.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                                                placeholder="Option 1, Option 2"
                                            />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-surface-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                        <input
                                            type="checkbox"
                                            id="req-check"
                                            checked={selectedField.required || false}
                                            onChange={(e) => handleUpdateField(selectedField.id, { required: e.target.checked } as any)}
                                            style={{ width: '1.1rem', height: '1.1rem', margin: 0 }}
                                        />
                                        <label htmlFor="req-check" style={{ color: 'var(--text-main)', fontSize: '0.9rem', cursor: 'pointer' }}>Required Field</label>
                                    </div>

                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: '1.5', marginTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span>
                                                {selectedField.type === 'signature' ? 'This field will require a digital signature from the user.' :
                                                    selectedField.required ? 'Users must fill this field before submitting.' :
                                                        'This field is optional for the user.'}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                                <button
                                    onClick={(e) => handleDeleteField(selectedField.id, e)}
                                    className="btn-secondary"
                                    style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Trash2 size={16} />
                                    Delete Component
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
                            <Box size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
                            <p style={{ fontSize: '0.95rem' }}>No Component Selected</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Click on a component in the canvas to edit its properties.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlueprintBuilder;
