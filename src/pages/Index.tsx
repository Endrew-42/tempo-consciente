import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TimeProvider } from '@/contexts/TimeContext';
import { Navigation } from '@/components/Navigation';
import { BlockScreen } from '@/components/BlockScreen';
import { Dashboard } from '@/screens/Dashboard';
import { Settings } from '@/screens/Settings';
import { History } from '@/screens/History';

const Index: React.FC = () => {
  return (
    <TimeProvider>
      <div className="min-h-screen bg-background">
        <BlockScreen />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/configuracoes" element={<Settings />} />
          <Route path="/historico" element={<History />} />
        </Routes>
        <Navigation />
      </div>
    </TimeProvider>
  );
};

export default Index;
