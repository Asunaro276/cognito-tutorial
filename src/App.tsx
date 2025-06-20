import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './aws-config';
import { AuthProviderWrapper } from './auth/AuthContext';
import { AmplifyAuthProvider } from './auth/amplify-auth';
import { MockAuthProvider } from './auth/mock-auth';
import AuthComponent from './components/AuthComponent';
import ProtectedContent from './components/ProtectedContent';
import './App.css';

// モック認証を使用するかどうかを判定
const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// 認証プロバイダーの選択
const authProvider = useMockAuth
  ? new MockAuthProvider()
  : new AmplifyAuthProvider();

// モック認証を使用しない場合のみAWS Amplifyを初期化
if (!useMockAuth) {
  Amplify.configure(amplifyConfig);
}

function App() {
  return (
    <AuthProviderWrapper authProvider={authProvider}>
      <AuthComponent>
        <ProtectedContent />
      </AuthComponent>
    </AuthProviderWrapper>
  );
}

export default App;
