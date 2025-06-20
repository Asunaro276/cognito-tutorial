window.amplifyConfig = {
    Auth: {
        region: 'ap-northeast-1',
        
        userPoolId: 'ap-northeast-1_sDDwUYPJe',
        
        userPoolWebClientId: 'cnt15doc3qjus4o6jkc02s1f0',
        
        oauth: {
            domain: 'oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com',
            
            scope: ['openid', 'email', 'profile'],
            
            // リダイレクトURL（現在のサイトURL）
            redirectSignIn: window.location.origin,
            redirectSignOut: window.location.origin,
            
            // OAuth 2.0 Authorization Code Flow
            responseType: 'code'
        }
    }
};

console.log('Amplify Config:', window.amplifyConfig);
