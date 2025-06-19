import { useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';

interface UserAttributes {
  email?: string;
  name?: string;
  preferred_username?: string;
  sub?: string;
}

export default function ProtectedContent() {
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserAttributes();
  }, []);

  const loadUserAttributes = async () => {
    try {
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes);
    } catch (error) {
      console.error('Failed to load user attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">ユーザー情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          🎉 認証成功！
        </h2>
        <p className="text-green-700">
          おめでとうございます！AWS CognitoのOIDC認証を通じて、この限定コンテンツにアクセスできました。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">📋 ユーザー情報</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2">{userAttributes.email || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">名前:</span>
              <span className="ml-2">{userAttributes.name || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">ユーザー名:</span>
              <span className="ml-2">{userAttributes.preferred_username || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">User ID:</span>
              <span className="ml-2 text-xs font-mono">{userAttributes.sub || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">🔐 認証フロー</h3>
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              このアプリケーションは以下の技術スタックを使用しています：
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>AWS Cognito (認証基盤)</li>
              <li>OpenID Connect (OIDC)</li>
              <li>OAuth 2.0 Authorization Code Flow</li>
              <li>React + TypeScript</li>
              <li>AWS Amplify (ホスティング)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-4">🛠️ 技術的な詳細</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">認証スコープ</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• openid</li>
              <li>• email</li>
              <li>• profile</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">トークン有効期限</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Access Token: 60分</li>
              <li>• ID Token: 60分</li>
              <li>• Refresh Token: 30日</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">セキュリティ機能</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• PKCE対応</li>
              <li>• State parameter検証</li>
              <li>• HTTPS強制</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          💡 次のステップ
        </h3>
        <p className="text-blue-700 text-sm">
          このチュートリアルを完了しました！次は、ソーシャル認証（Google、Facebook）の追加や、
          多要素認証（MFA）の実装を試してみましょう。
        </p>
      </div>
    </div>
  );
} 
