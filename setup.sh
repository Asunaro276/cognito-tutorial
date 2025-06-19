#!/bin/bash

# Cognito OIDC with Amplify セットアップスクリプト
echo "🚀 Cognito OIDC with Amplify セットアップを開始します"

# 1. Terraformで既存設定の確認
echo "📋 Terraform設定を確認中..."
cd terraform

# Terraform初期化
if [ ! -d ".terraform" ]; then
    echo "🔧 Terraform初期化中..."
    terraform init
fi

# Terraform計画表示
echo "📊 Terraform計画を表示中..."
terraform plan

# ユーザー確認
echo ""
read -p "❓ Terraformを適用しますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Terraformを適用中..."
    terraform apply -auto-approve
    
    # 出力値を取得
    echo "📝 設定値を取得中..."
    USER_POOL_ID=$(terraform output -raw cognito_user_pool_id)
    CLIENT_ID=$(terraform output -raw cognito_user_pool_client_id)
    COGNITO_DOMAIN=$(terraform output -raw cognito_domain)
    AMPLIFY_URL=$(terraform output -raw amplify_app_url)
    REGION=$(terraform output -raw aws_region 2>/dev/null || echo "ap-northeast-1")
    
    # config.jsを更新
    echo "⚙️  config.jsを更新中..."
    cd ..
    
    cat > config.js << EOF
// Amplify Configuration for Cognito OIDC
// このファイルはsetup.shによって自動生成されました

window.amplifyConfig = {
    Auth: {
        // リージョン
        region: '${REGION}',
        
        // Cognito User Pool ID
        userPoolId: '${USER_POOL_ID}',
        
        // Cognito User Pool Web Client ID
        userPoolWebClientId: '${CLIENT_ID}',
        
        // OAuth設定
        oauth: {
            // Cognito Domain
            domain: '${COGNITO_DOMAIN}',
            
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
EOF
    
    echo "✅ Terraformセットアップ完了！"
    echo ""
    echo "🌐 Amplify URL: ${AMPLIFY_URL}"
    echo "🔐 Cognito Domain: https://${COGNITO_DOMAIN}"
    echo ""
    echo "📋 次のステップ:"
    echo "1. 【重要】Amplifyコンソールで手動デプロイを実行"
    echo "   - AWS Amplifyコンソールにアクセス"
    echo "   - アプリ「cognito-tutorial」を選択"
    echo "   - 「main」ブランチを選択"
    echo "   - 「Deploy without Git provider」をクリック"
    echo "   - index.html, config.js, amplify.ymlをアップロード"
    echo ""
    echo "2. ${AMPLIFY_URL} にアクセスして認証をテスト"
    echo "3. 必要に応じてCognitoでテストユーザーを作成"
    echo ""
    echo "🔧 テストユーザー作成コマンド:"
    echo "aws cognito-idp admin-create-user --user-pool-id ${USER_POOL_ID} --username testuser --user-attributes Name=email,Value=your-email@example.com --temporary-password TempPass123! --message-action SUPPRESS"
    echo ""
    echo "📄 アップロードするファイル:"
    echo "- index.html"
    echo "- config.js (今更新されました)"
    echo "- amplify.yml"
    
else
    echo "❌ セットアップをキャンセルしました"
fi 
