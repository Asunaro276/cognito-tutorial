# 🔐 OIDC チュートリアルアプリ

このアプリケーションはAWS CognitoとAmplifyを使用したOIDC認証のチュートリアルです。

## ✨ 機能

- ✅ AWS Cognito OIDC認証
- ✅ React + TypeScript + Vite
- ✅ Tailwind CSSによるモダンUI
- ✅ 認証状態管理
- ✅ 保護されたコンテンツ表示
- ✅ ユーザー情報表示
- ✅ Terraform自動デプロイ

## 🏗️ アーキテクチャ

```
ユーザー → React App (Amplify) → Cognito OIDC → 限定コンテンツ
```

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
# Bunを使用している場合
bun install

# npmを使用する場合
npm install
```

### 2. Terraformでインフラ構築

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 3. 環境変数の設定

Terraform適用後、出力された値を使用して`.env`ファイルを作成：

```bash
# .envファイルを作成
cp .env.example .env

# Terraformの出力から実際の値を取得
terraform output cognito_user_pool_id
terraform output cognito_user_pool_client_id
terraform output cognito_domain
```

`.env`ファイルに実際の値を設定：

```env
VITE_COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxxx
VITE_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN=oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com
```

### 4. 開発サーバーの起動

```bash
# 開発モードで起動
bun dev
# または
npm run dev
```

### 5. テストユーザーの作成

```bash
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username testuser \
  --user-attributes Name=email,Value=test@example.com \
  --temporary-password TempPass123! \
  --message-action SUPPRESS

# パスワードを永続化
aws cognito-idp admin-set-user-password \
  --user-pool-id YOUR_USER_POOL_ID \
  --username testuser \
  --password NewPassword123! \
  --permanent
```

## 🔧 使用方法

1. アプリケーションにアクセス
2. 「ログイン」ボタンをクリック
3. Cognitoのログイン画面でテストユーザーでログイン
4. 認証成功後、限定コンテンツが表示される
5. ユーザー情報と認証詳細を確認
6. 「ログアウト」でセッション終了

## 📁 プロジェクト構成

```
src/
├── components/
│   ├── AuthComponent.tsx      # 認証管理コンポーネント
│   └── ProtectedContent.tsx   # 保護されたコンテンツ
├── aws-config.ts              # AWS Amplify設定
├── App.tsx                    # メインアプリケーション
├── main.tsx                   # エントリーポイント
└── index.css                  # スタイル（Tailwind CSS）
```

## 🛠️ 技術スタック

- **フロントエンド**: React 19, TypeScript, Vite
- **スタイリング**: Tailwind CSS
- **認証**: AWS Cognito, AWS Amplify
- **インフラ**: Terraform
- **ホスティング**: AWS Amplify
- **プロトコル**: OAuth 2.0 + OpenID Connect

## 🔐 セキュリティ機能

- ✅ OAuth 2.0 Authorization Code Flow
- ✅ PKCE (Proof Key for Code Exchange)
- ✅ State parameter検証
- ✅ HTTPS強制
- ✅ トークン自動リフレッシュ
- ✅ セキュアなセッション管理

## 🐛 トラブルシューティング

### よくある問題

1. **「認証状態を確認中...」が続く**
   - `.env`ファイルの設定値を確認
   - Cognitoユーザープールの設定確認

2. **ログインボタンが反応しない**
   - ブラウザのコンソールでエラー確認
   - OAuth設定の確認

3. **ログイン後にエラー**
   - リダイレクトURL設定の確認
   - Cognitoクライアント設定の確認

### デバッグ

```javascript
// ブラウザコンソールで設定確認
console.log(import.meta.env);
```

## 🔄 開発ワークフロー

1. コード変更
2. 自動リロード（Vite HMR）
3. テスト
4. ビルド：`bun run build`
5. Amplifyへデプロイ

## 📈 次のステップ

このチュートリアルが完了したら、以下の機能を追加してみてください：

- ✨ ソーシャル認証（Google、Facebook）
- ✨ 多要素認証（MFA）
- ✨ API Gateway + Lambda統合
- ✨ カスタムドメイン設定
- ✨ ユーザー管理機能

## 📚 参考資料

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [OpenID Connect Specification](https://openid.net/connect/)
- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749) 
