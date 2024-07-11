import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
