import type { ResourcesConfig } from 'aws-amplify';

// この設定は通常、Terraformの出力値から取得されます
// 実際の値は、Terraform apply後に更新する必要があります
export const amplifyConfig: ResourcesConfig = {
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
