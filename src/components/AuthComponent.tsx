import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { AuthUser } from '../auth/types';

interface AuthComponentProps {
  children: React.ReactNode;
}

export default function AuthComponent({ children }: AuthComponentProps) {
  const authProvider = useAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 認証プロバイダーから表示情報を取得
  const mode = authProvider.getMode();
  const signInOptions = authProvider.getSignInOptions();

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authProvider.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();

    // 認証状態の変化を監視
    const unsubscribe = authProvider.onAuthStateChange((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, [authProvider]);

  const handleSignIn = async () => {
    try {
      await authProvider.signIn();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authProvider.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // オプション選択でのサインイン
  const handleSignInWithOption = async (optionId: string) => {
    try {
      if (authProvider.signInWithOption) {
        await authProvider.signInWithOption(optionId);
      }
    } catch (error) {
      console.error('Sign in with option error:', error);
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
            {mode === 'development' && (
              <span className="block text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2">
                開発モード
              </span>
            )}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {mode === 'development'
              ? '開発環境での認証です'
              : '限定コンテンツにアクセスするには、ログインが必要です。'
            }
          </p>

          {signInOptions ? (
            // オプション選択型のサインインUI
            <div className="space-y-4">
              {signInOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSignInWithOption(option.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            // 通常のサインインUI
            <button
              onClick={handleSignIn}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              ログイン
            </button>
          )}
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
              {mode === 'development' && (
                <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  開発モード
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                こんにちは、{user.username}さん
                {user.email && ` (${user.email})`}
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
