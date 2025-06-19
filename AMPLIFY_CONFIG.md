# 🔧 AWS Amplify 設定ガイド

## 📋 amplify.yml の設定内容

現在のプロジェクト構成に合わせて、bunを使用するように `amplify.yml` を設定しました。

### 🛠️ ビルドプロセス

#### preBuildフェーズ
1. **Bunのインストール**: 最新版のBunをダウンロード・インストール
2. **バージョン確認**: Node.jsとBunのバージョンを表示
3. **依存関係インストール**: `bun install` で依存関係を取得

#### buildフェーズ
1. **環境変数確認**: Cognito設定値を表示（デバッグ用）
2. **ビルド実行**: `bun run build` でViteビルド
3. **成果物確認**: `dist/` ディレクトリの内容を表示

### 📦 成果物設定
- **baseDirectory**: `dist` (Viteのビルド出力)
- **files**: すべてのファイル (`**/*`)

### 💾 キャッシュ設定
- `node_modules/` - 依存関係
- `~/.bun/install/cache/` - Bunキャッシュ

## 🔐 環境変数の設定

### AWS Amplifyコンソールでの設定

1. **Amplifyアプリの管理画面**にアクセス
2. **「アプリの設定」** → **「環境変数」** を選択
3. 以下の環境変数を追加：

```
VITE_COGNITO_USER_POOL_ID = ap-northeast-1_xxxxxxxxx
VITE_COGNITO_USER_POOL_CLIENT_ID = xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_DOMAIN = oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com
```

### 環境変数の取得方法

Terraformを使用している場合：

```bash
cd terraform

# ユーザープールID
terraform output cognito_user_pool_id

# クライアントID
terraform output cognito_user_pool_client_id

# ドメイン
terraform output cognito_domain
```

または、AWS CLIを使用：

```bash
# ユーザープール一覧
aws cognito-idp list-user-pools --max-items 10

# クライアント一覧
aws cognito-idp list-user-pool-clients --user-pool-id YOUR_POOL_ID

# ドメイン情報
aws cognito-idp describe-user-pool-domain --domain oidc-tutorial-auth
```

## 🚀 デプロイ方法

### 1. 自動デプロイ（Git連携）
1. GitHubリポジトリと連携
2. pushで自動ビルド・デプロイ
3. `amplify.yml` の設定が自動適用

### 2. 手動デプロイ
1. ローカルでビルド: `bun run build`
2. `dist/` フォルダをzip圧縮
3. Amplifyコンソールで手動アップロード

## 🐛 トラブルシューティング

### よくある問題と解決策

#### 1. Bunのインストールに失敗
**エラー**: `curl: command not found` または権限エラー

**解決方法**:
```yaml
# amplify.ymlのpreBuildに追加
- yum update -y
- yum install -y curl
```

#### 2. Node.jsバージョンの問題
**エラー**: `Node.js version not compatible`

**解決方法**:
```yaml
# Node.js 18を明示的にインストール
- nvm install 18
- nvm use 18
```

#### 3. 環境変数が反映されない
**原因**: ビルド時に環境変数が設定されていない

**確認方法**:
- Amplifyコンソールの環境変数設定を確認
- ビルドログで環境変数の値を確認

#### 4. ビルドは成功するが認証エラー
**原因**: Cognitoの設定と環境変数の不一致

**確認項目**:
- ユーザープールIDが正しいか
- クライアントIDが正しいか
- ドメイン名が正しいか
- コールバックURLがAmplify URLと一致しているか

## 📊 ビルドログの確認

### 正常なビルドログの例

```
preBuild phase:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1638  100  1638    0     0   8190      0 --:--:-- --:--:-- --:--:--  8190
Installing Bun...
  Archive:  bun-linux-x64.zip
    inflating: bun                     
  bun was installed successfully to ~/.bun/bin/bun
  v18.19.0
  1.1.29
  261 packages installed [8.64s]

build phase:
  Building React app with Vite and Bun
  VITE_COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxxx
  VITE_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
  VITE_COGNITO_DOMAIN=oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com
  vite v6.3.5 building for production...
  ✓ 615 modules transformed.
  dist/index.html                   0.44 kB │ gzip:  0.30 kB
  dist/assets/index-Bsdquzc_.css    5.52 kB │ gzip:  1.73 kB
  dist/assets/index-CxEgmZNd.js   266.75 kB │ gzip: 84.64 kB
  ✓ built in 1.63s
  Build completed successfully
  total 20
  drwxr-xr-x 3 root root 4096 Jun 19 23:41 .
  drwxr-xr-x 8 root root 4096 Jun 19 23:41 ..
  drwxr-xr-x 2 root root 4096 Jun 19 23:41 assets
  -rw-r--r-- 1 root root  444 Jun 19 23:41 index.html
  -rw-r--r-- 1 root root 1497 Jun 19 23:41 vite.svg
```

## 🔄 設定の更新

### amplify.ymlを変更した場合
1. リポジトリにpush（Git連携の場合）
2. または、手動で再デプロイ

### 環境変数を変更した場合
1. Amplifyコンソールで環境変数を更新
2. **「アプリの設定」** → **「環境変数」** → **「保存」**
3. 新しいビルドをトリガー

## 📝 ベストプラクティス

1. **環境変数の管理**: 本番環境では実際の値を設定
2. **キャッシュの活用**: `node_modules/` のキャッシュでビルド時間短縮
3. **ログの確認**: デバッグ情報でトラブルシューティング
4. **セキュリティ**: 環境変数に機密情報を含めない（IDやドメインは問題なし） 
