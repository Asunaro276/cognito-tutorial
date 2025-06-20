import type { ResourcesConfig } from 'aws-amplify';

// 開発環境でのモック設定
const mockConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'mock-pool-id',
      userPoolClientId: 'mock-client-id',
      loginWith: {
        oauth: {
          domain: 'mock-domain.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [window.location.origin + '/'],
          redirectSignOut: [window.location.origin + '/'],
          responseType: 'code',
        },
      },
    },
  },
};

// 本番環境設定
const prodConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-northeast-1_sDDwUYPJe',
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || 'cnt15doc3qjus4o6jkc02s1f0',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN || 'oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [window.location.origin + '/'],
          redirectSignOut: [window.location.origin + '/'],
          responseType: 'code',
        },
      },
    },
  },
};

// 環境に応じて設定を切り替え
const isDevelopment = import.meta.env.DEV;
const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export const amplifyConfig: ResourcesConfig = (isDevelopment && useMockAuth) ? mockConfig : prodConfig; 
