import React, { createContext, useContext } from 'react';
import type { AuthProvider } from './types';

const AuthContext = createContext<AuthProvider | null>(null);

interface AuthProviderWrapperProps {
  authProvider: AuthProvider;
  children: React.ReactNode;
}

export function AuthProviderWrapper({ authProvider, children }: AuthProviderWrapperProps) {
  return (
    <AuthContext.Provider value={authProvider}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthProvider {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProviderWrapper');
  }
  return context;
} 
