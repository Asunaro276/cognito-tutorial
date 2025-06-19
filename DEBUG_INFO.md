# 🐛 認証エラー解決ガイド

## ❌ 発生していたエラー
```
GET https://oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com/error?error=invalid_request&client_id=YOUR_CLIENT_ID 400 (Bad Request)
```

## ✅ 解決済み

### 🔍 問題の原因
1. **プレースホルダー値の使用**: `YOUR_CLIENT_ID` が実際の値に置き換えられていなかった
2. **環境変数の未設定**: ローカル開発時に`.env`ファイルが存在しなかった

### 🛠️ 実施した修正

#### 1. **aws-config.ts の更新**
プレースホルダー値を実際のTerraform出力値で置き換え：

```typescript
// 修正前
userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'YOUR_USER_POOL_ID',
userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || 'YOUR_CLIENT_ID',

// 修正後  
userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-northeast-1_sDDwUYPJe',
userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || 'cnt15doc3qjus4o6jkc02s1f0',
```

#### 2. **実際の設定値**
Terraform出力から取得した値：
```
cognito_user_pool_id = "ap-northeast-1_sDDwUYPJe"
cognito_user_pool_client_id = "cnt15doc3qjus4o6jkc02s1f0"  
cognito_domain = "oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com"
amplify_app_url = "https://main.dek04gtky4et6.amplifyapp.com"
```

## 🔧 環境変数の設定（オプション）

### ローカル開発環境
`.env`ファイルを作成（プロジェクトルート）：
```env
VITE_COGNITO_USER_POOL_ID=ap-northeast-1_sDDwUYPJe
VITE_COGNITO_USER_POOL_CLIENT_ID=cnt15doc3qjus4o6jkc02s1f0
VITE_COGNITO_DOMAIN=oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com
```

### AWS Amplify本番環境
Amplifyコンソール → アプリ設定 → 環境変数：
```
VITE_COGNITO_USER_POOL_ID = ap-northeast-1_sDDwUYPJe
VITE_COGNITO_USER_POOL_CLIENT_ID = cnt15doc3qjus4o6jkc02s1f0
VITE_COGNITO_DOMAIN = oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com
```

## 🧪 テスト手順

### 1. ローカルでの確認
```bash
# 開発サーバー起動
bun dev

# ブラウザでhttp://localhost:5173にアクセス
# ブラウザのDevToolsコンソールで確認：
console.log(window.location.origin); // リダイレクトURL確認
```

### 2. 本番環境での確認
1. AmplifyのURL (`https://main.dek04gtky4et6.amplifyapp.com`) にアクセス
2. 「ログイン」ボタンをクリック
3. Cognitoのログイン画面が正しく表示されることを確認

### 3. 認証フローのテスト
```bash
# テストユーザーの作成
aws cognito-idp admin-create-user \
  --user-pool-id ap-northeast-1_sDDwUYPJe \
  --username testuser \
  --user-attributes Name=email,Value=test@example.com \
  --temporary-password TempPass123! \
  --message-action SUPPRESS

# パスワードを永続化
aws cognito-idp admin-set-user-password \
  --user-pool-id ap-northeast-1_sDDwUYPJe \
  --username testuser \
  --password NewPassword123! \
  --permanent
```

## 🚨 今後のトラブルシューティング

### よくあるエラーと解決方法

#### 1. `invalid_client` エラー
**原因**: クライアントIDが間違っている
**解決**: Terraform出力で正しいIDを確認

#### 2. `redirect_mismatch` エラー  
**原因**: コールバックURLが設定と異なる
**解決**: Cognitoコンソールでリダイレクト設定を確認

#### 3. `unauthorized_client` エラー
**原因**: OAuth設定の問題
**解決**: allowed_oauth_flowsとscopesを確認

### デバッグ用コンソールコマンド

```javascript
// ブラウザのDevToolsで実行
console.log('Current config:', import.meta.env);
console.log('Amplify config:', window.AWS?.config);
console.log('Current URL:', window.location.href);
```

## 📊 設定確認チェックリスト

- [x] ✅ aws-config.ts でプレースホルダー値を実際の値に更新
- [x] ✅ Terraformでコールバック URLが動的に設定されている  
- [x] ✅ Cognitoドメインが正しく設定されている
- [x] ✅ OAuth設定（scopes, response_type）が正しい
- [x] ✅ ビルド・デプロイファイルを更新済み

## 🔄 更新済みファイル

1. **src/aws-config.ts** - 実際のCognito設定値を使用
2. **cognito-tutorial-deploy.zip** - 修正済みの設定を含むデプロイファイル
3. **DEBUG_INFO.md** - このトラブルシューティングガイド

---

この修正により、`YOUR_CLIENT_ID`エラーは解決され、正常な認証フローが動作するはずです。 
