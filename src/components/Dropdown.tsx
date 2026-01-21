import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

interface DropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    width?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    width = '200px',
    variant = 'secondary'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    const getBaseStyles = () => {
        switch (variant) {
            case 'primary': return { background: 'var(--primary)', color: 'white', border: 'none' };
            case 'ghost': return { background: 'transparent', color: 'var(--text-secondary)', border: 'none' };
            default: return { background: 'var(--bg-surface-secondary)', color: 'var(--text-main)', border: '1px solid var(--border)' };
        }
    };

    return (
        <div className="relative" ref={dropdownRef} style={{ width, position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    ...getBaseStyles()
                }}
                className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {selectedOption?.icon}
                    <span style={{ fontWeight: 500 }}>{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    width: '100%',
                    maxWidth: '300px', // Allow slightly wider dropdown than trigger if needed
                    minWidth: '100%',
                    backgroundColor: 'rgba(30,30,32,0.95)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    zIndex: 100,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    animation: 'scaleIn 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '10px 12px',
                                background: option.value === value ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                borderRadius: '8px',
                                border: 'none',
                                color: option.value === value ? '#60a5fa' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.1s'
                            }}
                            onMouseEnter={(e) => {
                                if (option.value !== value) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.color = 'var(--text-main)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (option.value !== value) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                                    {option.icon}
                                    {option.label}
                                </div>
                                {option.description && (
                                    <div style={{ fontSize: '0.75rem', opacity: 0.6, paddingLeft: option.icon ? '24px' : '0' }}>
                                        {option.description}
                                    </div>
                                )}
                            </div>
                            {option.value === value && <Check size={14} />}
                        </button>
                    ))}
                </div>
            )}
            <style>
                {`
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95) translateY(-5px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                `}
            </style>
        </div>
    );
};

export default Dropdown;
