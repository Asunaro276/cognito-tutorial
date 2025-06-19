# 🔐 Cognito OIDC with Amplify セットアップガイド


Amazon CognitoとAWS AmplifyでOpenID Connect (OIDC) 認証を実装するための完全なガイド

## 📋 概要

このプロジェクトは以下を実装します：
✅ AWS Amplifyでの静的サイトホスティング  
✅ Amazon CognitoでのOIDC認証  
✅ フロントエンドJavaScriptでの認証フロー  
✅ Terraformによるインフラ自動構築  

## 🏗️ アーキテクチャ

```
Browser → Amplify (index.html) → Cognito (OIDC) → Protected Content
```

## 🚀 クイックスタート

### 1. 自動セットアップ（推奨）

```bash
# 実行権限を付与
chmod +x setup.sh

# 自動セットアップ実行
./setup.sh
```

### 2. 手動セットアップ

#### ステップ1: Terraformでインフラ構築

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

#### ステップ2: 設定値の取得

```bash
# 必要な値を取得
terraform output cognito_user_pool_id
terraform output cognito_user_pool_client_id  
terraform output cognito_domain
terraform output amplify_app_url
```

#### ステップ3: フロントエンド設定の更新

`config.js`を以下のように更新：

```javascript
window.amplifyConfig = {
    Auth: {
        region: 'ap-northeast-1',
        userPoolId: 'YOUR_ACTUAL_USER_POOL_ID',
        userPoolWebClientId: 'YOUR_ACTUAL_CLIENT_ID',
        oauth: {
            domain: 'YOUR_ACTUAL_COGNITO_DOMAIN',
            scope: ['openid', 'email', 'profile'],
            redirectSignIn: window.location.origin,
            redirectSignOut: window.location.origin,
            responseType: 'code'
        }
    }
};
```

## 🧪 テスト

### 1. テストユーザーの作成

```bash
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username testuser \
  --user-attributes Name=email,Value=test@example.com \
  --temporary-password TempPass123! \
  --message-action SUPPRESS
```

### 2. 認証フローのテスト

1. Amplify URLにアクセス
2. 「ログイン」ボタンをクリック
3. Cognitoのログイン画面でテストユーザーでログイン
4. プロテクトされたコンテンツが表示されることを確認

## 📁 ファイル構成

```
.
├── index.html           # メインHTMLファイル
├── config.js           # Amplify設定ファイル
├── amplify.yml         # Amplifyビルド設定
├── setup.sh            # 自動セットアップスクリプト
├── terraform/
│   ├── main.tf         # Terraformメイン設定
│   ├── cognito.tf      # Cognito設定
│   ├── amplify.tf      # Amplify設定
│   └── outputs.tf      # 出力値定義
└── COGNITO_OIDC_SETUP.md
```

## 🔧 技術詳細

### Cognito設定

- **認証フロー**: OAuth 2.0 Authorization Code Flow
- **スコープ**: `openid`, `email`, `profile`
- **リダイレクト**: Amplify URL
- **トークン有効期限**: 
  - Access Token: 60分
  - ID Token: 60分
  - Refresh Token: 30日

### Amplify設定

- **ホスティング**: 静的サイト
- **ビルド**: 自動デプロイ
- **HTTPS**: 自動有効化

### セキュリティ機能

✅ PKCE (Proof Key for Code Exchange)  
✅ State parameter検証  
✅ HTTPS強制  
✅ CORS設定  
✅ Token自動リフレッシュ  

## 🐛 トラブルシューティング

### よくある問題

#### 1. "Amplify設定が未完了" エラー

**原因**: `config.js`の設定値が更新されていない  
**解決**: `setup.sh`を再実行するか、手動で`config.js`を更新

#### 2. OAuth認証エラー

**原因**: Cognitoの設定とAmplify URLの不一致  
**解決**: Terraform再適用でコールバックURL更新

```bash
cd terraform && terraform apply
```

#### 3. ログイン後に無限ループ

**原因**: リダイレクトURL設定の問題  
**解決**: Cognitoコンソールでリダイレクト設定確認

### ログの確認

```bash
# ブラウザのDevToolsコンソールで確認
console.log(window.amplifyConfig);

# AWS CLIでCognito設定確認
aws cognito-idp describe-user-pool --user-pool-id YOUR_POOL_ID
```

## 🔍 監視とログ

### CloudWatch Logs

- Cognito認証ログ
- Amplifyビルドログ
- Lambda@Edgeログ（カスタムドメイン使用時）

### メトリクス

- 認証成功/失敗率
- ページビュー数
- ユーザーセッション時間

## 🚧 次のステップ

### 追加実装可能な機能

1. **ソーシャル認証**: Google, Facebook, Amazon
2. **多要素認証**: SMS, TOTP
3. **カスタムドメイン**: 独自ドメインでの認証
4. **API Gateway**: バックエンドAPI保護
5. **Lambda Authorizer**: カスタム認証ロジック

### 本番環境への移行

1. カスタムドメイン設定
2. SSL証明書設定
3. ログ監視設定
4. バックアップ設定
5. セキュリティ監査

## 📚 参考資料

- [Amazon Cognito Developer Guide](https://docs.aws.amazon.com/cognito/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [OpenID Connect Specification](https://openid.net/connect/)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

## 💡 サポート

問題や質問がある場合：
1. このREADMEのトラブルシューティングセクションを確認
2. AWS公式ドキュメントを参照
3. CloudWatchログを確認
4. GitHub Issuesで質問投稿

---

🎉 **おめでとうございます！** 
Cognito OIDCとAmplifyの実装が完了しました。セキュアな認証システムをお楽しみください！ 
