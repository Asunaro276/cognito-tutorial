// Amplify Configuration for Cognito OIDC
// このファイルはsetup.shによって自動生成されました

window.amplifyConfig = {
    Auth: {
        // リージョン
        region: 'ap-northeast-1',
        
        // Cognito User Pool ID
        userPoolId: 'ap-northeast-1_sDDwUYPJe',
        
        // Cognito User Pool Web Client ID
        userPoolWebClientId: 'cnt15doc3qjus4o6jkc02s1f0',
        
        // OAuth設定
        oauth: {
            // Cognito Domain
            domain: 'oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com',
            
            // OpenID Connectスコープ
            scope: ['openid', 'email', 'profile'],
            
            // リダイレクトURL（現在のサイトURL）
            redirectSignIn: window.location.origin,
            redirectSignOut: window.location.origin,
            
            // OAuth 2.0 Authorization Code Flow
            responseType: 'code'
        }
    }
};

// デバッグ用：設定値をコンソールに表示
console.log('Amplify Config:', window.amplifyConfig);
