import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { User, LayoutDashboard, FileText } from 'lucide-react';

const Header: React.FC = () => {
    const { appName } = useAppStore();

    return (
        <header className="glass-header">
            <div className="container header-content">

                {/* Logo Area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '28px', height: '28px',
                            background: 'linear-gradient(135deg, #0A84FF 0%, #007AFF 100%)',
                            borderRadius: '8px',
                            boxShadow: '0 0 10px rgba(10, 132, 255, 0.3)'
                        }}></div>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff' }}>
                            {appName}
                        </span>
                    </div>

                    {/* Navigation - Segmented Control Style */}
                    <nav className="nav-pills">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/blueprints"
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <FileText size={16} />
                            Blueprints
                        </NavLink>
                    </nav>
                </div>

                {/* User Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="btn-icon-only"
                        style={{
                            width: '40px', height: '40px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            color: 'var(--text-secondary)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'var(--text-secondary)';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <User size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
