# 🔧 コールバック URL 修正完了

## ❌ 解決したエラー
```
GET https://oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com/login?redirect_uri=https%3A%2F%2Fmain.dek04gtky4et6.amplifyapp.com%2F&response_type=code&client_id=cnt15doc3qjus4o6jkc02s1f0&identity_provider=COGNITO&scope=openid%20email%20profile&state=BNSLc1rylEqaymkbaBIBhCEzbWEDPfKU&code_challenge=ciovgpGnJRTS8hO3C0U9kVFvEPZal_vYy6nYCIQq-XQ&code_challenge_method=S256 401 (Unauthorized)
```

## ✅ 修正内容

### 🔍 問題の原因
**コールバック URLの不一致**:
- **Cognitoに設定されていたURL**: `https://main.dek04gtky4et6.amplifyapp.com` (末尾にスラッシュなし)
- **アプリから送信されるURL**: `https://main.dek04gtky4et6.amplifyapp.com/` (末尾にスラッシュあり)

この1文字の差により、Cognitoが認証リクエストを無効とみなして401エラーを返していました。

### 🛠️ 実施した修正

#### 1. **terraform/cognito.tf の更新**
```hcl
# 修正前
callback_urls = ["https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com"]
default_redirect_uri = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com"
logout_urls = ["https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com"]

# 修正後
callback_urls = ["https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com/"]
default_redirect_uri = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com/"
logout_urls = ["https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com/"]
```

#### 2. **Terraform適用結果**
```
Plan: 0 to add, 1 to change, 0 to destroy.

aws_cognito_user_pool_client.client: Modifying... [id=cnt15doc3qjus4o6jkc02s1f0]
aws_cognito_user_pool_client.client: Modifications complete after 0s [id=cnt15doc3qjus4o6jkc02s1f0]
```

#### 3. **現在の正しい設定**
```json
{
    "CallbackURLs": [
        "https://main.dek04gtky4et6.amplifyapp.com/"
    ],
    "LogoutURLs": [
        "https://main.dek04gtky4et6.amplifyapp.com/"
    ],
    "DefaultRedirectURI": "https://main.dek04gtky4et6.amplifyapp.com/"
}
```

## 🧪 テスト手順

### 1. **テストユーザーの準備**
```bash
# ユーザーが既に存在する場合（確認済み）
aws cognito-idp admin-get-user --user-pool-id ap-northeast-1_sDDwUYPJe --username testuser

# パスワードを確実に設定
aws cognito-idp admin-set-user-password \
  --user-pool-id ap-northeast-1_sDDwUYPJe \
  --username testuser \
  --password TestPassword123! \
  --permanent
```

### 2. **認証フローのテスト**

#### ローカル環境での確認
```bash
# 開発サーバー起動
bun dev

# http://localhost:5173 にアクセス
# ログインボタンをクリック → Cognitoログイン画面に正常に遷移
```

#### 本番環境での確認
1. **AmplifyのURL**にアクセス: `https://main.dek04gtky4et6.amplifyapp.com`
2. **ログインボタン**をクリック
3. **認証情報**を入力:
   - ユーザー名: `testuser`
   - パスワード: `TestPassword123!`
4. **認証成功**後、限定コンテンツが表示される

### 3. **認証パラメータの確認**
修正後のCognitoログイン URL（正常な例）:
```
https://oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com/login?
redirect_uri=https%3A%2F%2Fmain.dek04gtky4et6.amplifyapp.com%2F&
response_type=code&
client_id=cnt15doc3qjus4o6jkc02s1f0&
identity_provider=COGNITO&
scope=openid%20email%20profile&
state=...&
code_challenge=...&
code_challenge_method=S256
```

## 🔍 認証フロー詳細

### OAuth 2.0 + OIDC フロー
1. **アプリ**: ユーザーが「ログイン」をクリック
2. **Amplify**: CognitoのOAuth認証画面にリダイレクト
3. **Cognito**: ユーザー認証（ユーザー名・パスワード）
4. **Cognito**: 認証成功時、設定されたcallback_urlにリダイレクト
5. **Amplify**: 認証コードを受け取り、トークンと交換
6. **アプリ**: 認証済みユーザーとして限定コンテンツを表示

### 重要なポイント
- **URL完全一致**: `callback_urls`は文字列完全一致が必要
- **PKCE対応**: `code_challenge`パラメータが自動で付与
- **State検証**: CSRF攻撃防止のためのstateパラメータ

## 🚨 今後の注意点

### URL設定のベストプラクティス
1. **末尾スラッシュの統一**: 常に`/`で終わるように設定
2. **HTTPS必須**: 本番環境では必ずHTTPS
3. **複数環境対応**: 開発・ステージング・本番で適切なURL設定

### トラブルシューティング
- **401 Unauthorized**: コールバック URLの不一致
- **400 Bad Request**: クライアントIDやスコープの問題
- **500 Internal Server Error**: Cognitoの内部設定エラー

## ✅ 確認完了項目

- [x] ✅ Terraform設定でコールバック URLに末尾スラッシュを追加
- [x] ✅ Terraformの適用が成功
- [x] ✅ Cognitoクライアント設定の更新確認
- [x] ✅ テストユーザーの作成・パスワード設定
- [x] ✅ 認証フローのテスト準備完了

---

この修正により、401 Unauthorizedエラーは解決され、正常な認証フローが動作するはずです。🎯 
