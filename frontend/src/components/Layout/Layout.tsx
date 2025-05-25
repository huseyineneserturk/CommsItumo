import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AIChatPopup } from '../AIChatPopup';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({
  children
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
      <AIChatPopup />
    </div>
  );
}