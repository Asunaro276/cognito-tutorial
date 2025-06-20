import { getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import type { AuthProvider, AuthUser, SignInOption } from './types';

export class AmplifyAuthProvider implements AuthProvider {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const currentUser = await getCurrentUser();
      return currentUser as AuthUser;
    } catch (error) {
      console.log('User not authenticated:', error);
      return null;
    }
  }

  async signIn(): Promise<void> {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const unsubscribe = Hub.listen('auth', async ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
        case 'tokenRefresh':
          const user = await this.getCurrentUser();
          callback(user);
          break;
        case 'signedOut':
          callback(null);
          break;
      }
    });

    return unsubscribe;
  }

  getMode(): 'production' | 'development' {
    return 'production';
  }

  getSignInOptions(): SignInOption[] | null {
    // Amplify認証では通常のOIDCフローを使用するため、オプション選択はなし
    return null;
  }
} 
