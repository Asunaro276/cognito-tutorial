export interface AuthUser {
  username: string;
  userId: string;
  email?: string;
  signInDetails?: any;
}

export interface SignInOption {
  id: string;
  label: string;
  user: AuthUser;
}

export interface AuthProvider {
  getCurrentUser(): Promise<AuthUser | null>;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
  
  // UI表示用の情報
  getMode(): 'production' | 'development';
  getSignInOptions(): SignInOption[] | null; // nullの場合は通常のサインインフロー
  signInWithOption?(optionId: string): Promise<void>; // オプション選択でのサインイン
} 
