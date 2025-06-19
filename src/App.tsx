import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './aws-config';
import AuthComponent from './components/AuthComponent';
import ProtectedContent from './components/ProtectedContent';
import './App.css';

// AWS Amplifyの設定を初期化
Amplify.configure(amplifyConfig);

function App() {
  return (
    <AuthComponent>
      <ProtectedContent />
    </AuthComponent>
  );
}

export default App;
