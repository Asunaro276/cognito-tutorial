import type { AuthProvider, AuthUser, SignInOption } from './types';

// モックユーザーのデータ
const MOCK_USERS: AuthUser[] = [
  {
    username: 'testuser1',
    userId: 'test-user-1',
    email: 'test1@example.com'
  },
  {
    username: 'admin',
    userId: 'admin-user',
    email: 'admin@example.com'
  },
  {
    username: 'developer',
    userId: 'dev-user',
    email: 'dev@example.com'
  }
];

export class MockAuthProvider implements AuthProvider {
  private currentUser: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // ローカルストレージから認証状態を復元
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser;
  }

  // モック認証では、通常のsignInは使用されない（オプション選択を使用）
  async signIn(): Promise<void> {
    return;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('mockUser');
    this.notifyListeners(null);
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // 登録解除関数を返す
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getMode(): 'production' | 'development' {
    return 'development';
  }

  getSignInOptions(): SignInOption[] | null {
    return MOCK_USERS.map(user => ({
      id: user.userId,
      label: `${user.username}でログイン`,
      user
    }));
  }

  async signInWithOption(optionId: string): Promise<void> {
    const selectedUser = MOCK_USERS.find(user => user.userId === optionId);
    if (selectedUser) {
      this.currentUser = selectedUser;
      localStorage.setItem('mockUser', JSON.stringify(selectedUser));
      this.notifyListeners(selectedUser);
    }
  }

  private notifyListeners(user: AuthUser | null): void {
    this.listeners.forEach(callback => callback(user));
  }
} 
