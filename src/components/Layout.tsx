import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
    return (
        <>
            <Header />
            <main className="container" style={{
                flex: 1,
                paddingTop: '2.5rem',
                paddingBottom: '4rem',
            }}>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
