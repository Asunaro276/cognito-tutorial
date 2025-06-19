import { useEffect, useState } from 'react';
import { getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface AuthUser {
  username: string;
  userId: string;
  signInDetails?: any;
}

interface AuthComponentProps {
  children: React.ReactNode;
}

export default function AuthComponent({ children }: AuthComponentProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();

    // Auth状態の変化を監視
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
          checkAuthState();
          break;
        case 'signedOut':
          setUser(null);
          break;
        case 'tokenRefresh':
          checkAuthState();
          break;
      }
    });

    return unsubscribe;
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser as AuthUser);
    } catch (error) {
      console.log('User not authenticated:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">認証状態を確認中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">
            OIDC チュートリアル
          </h1>
          <p className="text-gray-600 text-center mb-6">
            限定コンテンツにアクセスするには、ログインが必要です。
          </p>
          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">OIDC チュートリアル</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                こんにちは、{user.username}さん
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
} 
