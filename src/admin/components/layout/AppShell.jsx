import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';



export function AppShell({ children }: AppShellProps) {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
