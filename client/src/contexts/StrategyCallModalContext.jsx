'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import StrategyCallModalDialog from '@/components/Home/StrategyCallModalDialog';

const StrategyCallModalContext = createContext(null);

export function StrategyCallModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState('strategy');

  const openModal = useCallback((opts = {}) => {
    if (opts?.intent === 'audit' || opts?.intent === 'strategy') {
      setIntent(opts.intent);
    } else {
      setIntent('strategy');
    }
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openModal, closeModal, isOpen: open }),
    [open, openModal, closeModal]
  );

  return (
    <StrategyCallModalContext.Provider value={value}>
      {children}
      <StrategyCallModalDialog open={open} intent={intent} onClose={closeModal} />
    </StrategyCallModalContext.Provider>
  );
}

export function useStrategyCallModal() {
  const ctx = useContext(StrategyCallModalContext);
  if (!ctx) {
    throw new Error('useStrategyCallModal must be used within StrategyCallModalProvider');
  }
  return ctx;
}
